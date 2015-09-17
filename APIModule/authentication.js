var pool = require('../lib/DbHelper.js');
var manage = require('./manage.js');
var ConfigInfo = require('../Config.js');
var crypto = require('crypto');
var http=require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
//var pool = new DbHelperClass(ConfigInfo.BusinessDB);
var redisHelper = require('../lib/RedisHelper.js');
//var TokenVerification = require('./tokenVerification.js');
var moment = require('moment');
var fs = require("fs");
var path=require('path');
function User(user) {
    this.userName = user.username;
    this.userPwd = user.userpwd;
    this.tenantId = user.tenantId;
    this.customerName = user.customerName;
}

//根据用户名得到用户数量：返回值用户名数量
User.prototype.CheckUserByName = function (callback) {
    //默认
    var etUserByName_Sql = "select count(*) as 'UserCount' from core_user where LOWER(username) = LOWER(?)";
    var etUserByName_SqlParameters = [this.userName];
    //有customerName
    if (Boolean(this.customerName == 'null' ? null : this.customerName)) {
        etUserByName_Sql = "select count(0) as 'UserCount' from core_user u " +
            "left join tenants_tenants t " +
            "on u.tenant=t.id " +
            "where LOWER(username) = LOWER(?) and LOWER(customer_names)=LOWER(?) " +
            "limit 1;";
        etUserByName_SqlParameters = [this.userName, this.customerName];
    }
    //有tenantID
    if (Boolean(this.tenantId == 'null' ? null : this.tenantId)) {
        etUserByName_Sql = "select count(*) as 'UserCount' from core_user where LOWER(username) = LOWER(?) and tenant=?";
        etUserByName_SqlParameters = [this.userName, this.tenantId];
    }

    pool.ExecuteQuery(etUserByName_Sql, etUserByName_SqlParameters, function (err, result) {
        if (err) {
            console.log(err);
            callback(-1);
        }
        else {
            if (result[0]) {
                //var returnUserCount = result[0].UserCount;
                callback(result[0].UserCount);
            }
            else {
                callback(-1);
            }
        }
    });
};

//登录方法
User.prototype.Login = function (callback) {
    var self = this;
    self.CheckUserByName(function (ucount) {
        if (ucount >= 0) {
            //获取用户名和密码，密码加密
            var sha512 = crypto.createHash('sha512');
            var passWord = sha512.update(self.userPwd).digest('hex');
            var userName = self.userName;
            var tenantId = self.tenantId;
            var customerName = self.customerName;
            //构造用户名密码匹配SQL命令
            var login_Sql =
                " select u.id,s.tenant,u.username,s.pwdhashsha512,t.customer_names custName,t.name as fullCustomerName,u.status " +
                " from core_usersecurity s " +
                " left join core_user u " +
                " on s.userid=u.id " +
                " left join tenants_tenants t" +
                " on s.tenant=t.id" +
                " where LOWER(u.username)=LOWER(?) and s.pwdhashsha512=? " +
                " limit 1; ";
            var login_SqlParameters = [userName, passWord];
            //有customerName
            if (Boolean(customerName == 'null' ? null : customerName)) {
                login_Sql =
                    " select u.id,s.tenant,u.username,s.pwdhashsha512,t.customer_names custName,t.name as fullCustomerName,u.status " +
                    " from core_usersecurity s " +
                    " left join core_user u " +
                    " on s.userid=u.id " +
                    " left join tenants_tenants t" +
                    " on s.tenant=t.id" +
                    " where LOWER(u.username)=LOWER(?) and s.pwdhashsha512=? and t.name=? " +
                    " limit 1; ";
                login_SqlParameters = [userName, passWord, customerName];
            }
            //有tenantID
            if (Boolean(tenantId == 'null' ? null : tenantId)) {
                login_Sql =
                    " select u.id,s.tenant,u.username,s.pwdhashsha512,t.customer_names custName,t.name as fullCustomerName,u.status " +
                    " from core_usersecurity s " +
                    " left join core_user u " +
                    " on s.userid=u.id " +
                    " left join tenants_tenants t" +
                    " on s.tenant=t.id" +
                    " where LOWER(u.username)=LOWER(?) and s.pwdhashsha512=? and u.tenant=? " +
                    " limit 1; ";
                login_SqlParameters = [userName, passWord, tenantId];
            }
            pool.ExecuteQuery(login_Sql, login_SqlParameters, function (err, result) {
                if (err) {
                    console.log(err.message);
                }
                if (result.length > 0) {
                    if (result[0].status.toString() == '1') {
                        callback(1, result[0]);//用户登录成功
                    }
                    else {
                        callback(-3, result[0]);//用户未启用
                    }
                }
                else {
                    callback(0);//用户密码错误
                }
            });
        }
        else {
            //用户不存在
            (Boolean(self.tenantId == 'null' ? null : self.tenantId) ||
                Boolean(self.customerName == 'null' ? null : self.customerName)) ?
                callback(-4) ://全局用户不存在
                callback(-1);//租户下用户不存在
        }
    });
};

//Post登录
exports.PostLogin = function (req, res) {
    var userName = req.body.userName;
    var userPwd = req.body.userPwd;
    var tenantId = req.body.tid;
    var customerName = req.body.cname;
    var returnUrl = req.body.returnUrl;

    if (typeof (req.session.VerificationCode) == "string" &&
        typeof(req.body.verificationCode) == "string") {
        if (!VerificationMatch(req.body.verificationCode, req.session.VerificationCode, true)) {
            return res.json({loginStatus: -2});//验证码不存在或者不正确
        }
    }
    else {
        return res.json({loginStatus: -2});
    }

    var user = new User({username: userName.toLowerCase(), userpwd: userPwd, tenantId: tenantId, customerName: customerName});
    //数据准备
    var now = moment().add(ConfigInfo.TokenConfig.TokenSaveDays, 'day');
    var expiresFromNow = now.utc().format('YYYY-MM-DD HH:mm:ss');
    console.log('LocalCookie Expire Date:' + new Date(expiresFromNow));
    user.Login(function (loginStatus, result) {
        //console.log({loginStatus: loginStatus});
        if (loginStatus === 1) {
            //设置Session
            generateRandomToken(function (err, token) {
                //封装token+custom_name
                var clientInfo = { ClientToken: token,
                    CustomName: result.custName,
                    FullCustomerName:result.fullCustomerName,
                    TenantID: result.tenant,
                    UserID: result.id,
                    UserName: user.userName};
                req.session.clientInfo = clientInfo;
                //保存token信息到服务器
                SaveToken(req, token, expiresFromNow, result, clientInfo, function (err, isSuccess) {
                    //发送结果
                    if (isSuccess) {
                        res.json({loginStatus: loginStatus, clientInfo: clientInfo});
                    }
                    else {
                        res.json({loginStatus: -1, clientInfo: null});
                    }
                });
            });
        }
        else {
            res.json({loginStatus: loginStatus, clientInfo: null});
        }
    });
};

exports.ApiLogin = function (req, res) {
    var userName = req.body.userName;
    var userPwd = req.body.userPwd;
    var isRem = req.body.isRem;
    var user = new User({username: userName.toLowerCase(), userpwd: userPwd});
    //数据准备
    var now = moment().add(ConfigInfo.TokenConfig.TokenSaveDays, 'day');
    var expiresFromNow = now.utc().format('YYYY-MM-DD HH:mm:ss');
    user.Login(function (loginStatus, result) {
        console.log({loginStatus: loginStatus});
        if (loginStatus === 1) {
            //设置Session
            generateRandomToken(function (err, token) {
                //封装token+custom_name
                var clientInfo = {ClientToken: token,
                    CustomName: result.custName,
                    FullCustomerName:result.fullCustomerName,
                    TenantID: result.tenant,
                    UserID: result.id,
                    UserName: user.userName};
                req.session.clientInfo = clientInfo;
                //保存token信息到服务器
                SaveToken(req, token, expiresFromNow, result, clientInfo, function (err) {
                    //发送结果
                    res.json({loginStatus: loginStatus, clientInfo: clientInfo});
                });
            });
        }
        else {
            res.json({loginStatus: loginStatus});
        }
    });
};

//登出
exports.Logout = function (req, res) {
    //var clientInfo = req.cookies.clienttoken;
    var currentToken = req.cookies.clienttoken ||  req.session.clientInfo.ClientToken ;
    req.session.clientInfo=null;
    if (currentToken) {
        DeleteToken(currentToken, function (err, affectRowCount) {
            if (err) {
                console.log('Authentication Logout Error: ' + err.message);
            }
            if (affectRowCount == 1) {
                console.log('Authentication Logout Success(Token Deleted from DB!)');
            }
            try {
                //req.session.AuthenticationToken = null;
                req.signedCookies.AuthenticationToken = null;
                res.clearCookie('AuthenticationToken');
                console.log('Authentication Logout Success(Token Deleted from cookie!)');
            }
            catch (ex) {
                console.log('Authentication Logout Exception: ' + ex);
            }
            //res.redirect('/login.html');
             res.redirect(ConfigInfo.TokenConfig.DefaultRedirectPage);
        });
    }
    else {
        //res.redirect('/login.html');
        res.redirect(ConfigInfo.TokenConfig.DefaultRedirectPage);
    }
};

//检查在线状态
exports.IsLogined = function (req, res, next) {
    var url = req.originalUrl.toString();
    var isSkip = IsSkip(url);
    //var islogin = url.search(ConfigInfo.TokenConfig.DefaultRedirectPage) > 0;
    if (isSkip) {
        next();
    }
    else {
        VerifyToken(req, res, function (isVerified) {
            if (!isVerified) {
                //if (!islogin) {
                //res.redirect('/login.html');
                res.redirect(ConfigInfo.TokenConfig.DefaultRedirectPage);
                //}
            }else{
            next();
            }
        });
    }
};
//模拟登录
exports.simulatedLogin=function(req,res,next){
    var url = req.originalUrl.toString();
    var filePath=path.resolve(__dirname,'../public/index.html');
    console.log(filePath);
    if(url.search('beijing')>=0){

    }
    var userName=url.split('/')[1].split('.')[0];
    var userPwd='123456';
    var user = new User({username: userName.toLowerCase(), userpwd: userPwd,customerName:''});
    //数据准备
    var now = moment().add(ConfigInfo.TokenConfig.TokenSaveDays, 'day');
    var expiresFromNow = now.utc().format('YYYY-MM-DD HH:mm:ss');
    var sql='select *from tenants_tenants where alias=?';
    pool.ExecuteQuery(sql, [userName], function (err, result) {
        if(err){
            console.log(err);
        }else{
            if(result&&result[0]){
                user.customerName=result[0].name;
                user.Login(function (loginStatus, result) {
                    //console.log({loginStatus: loginStatus});
                    if (loginStatus === 1) {
                        //设置Session
                        generateRandomToken(function (err, token) {
                            //封装token+custom_name
                            var clientInfo = { ClientToken: token,
                                CustomName: result.custName,
                                FullCustomerName:result.fullCustomerName,
                                TenantID: result.tenant,
                                UserID: result.id,
                                UserName: user.userName};
                            req.session.clientInfo = clientInfo;
                            //保存token信息到服务器
                            SaveToken(req, token, expiresFromNow, result, clientInfo, function (err, isSuccess) {
                                //发送结果
                                if (isSuccess) {
                                    //res.json({loginStatus: loginStatus, clientInfo: clientInfo});
                                    fs.readFile(filePath, {encoding:'utf8'}, function (err, file) {
                                        if (err) {
                                            console.log('文件不存在');
                                        }
                                        res.send(file);
                                    });
                                }
                                else {
                                    res.send('页面不存在');
                                }
                            });
                        });
                    }
                    else {
                        res.send('页面不存在');
                    }
                });
            }else{
                res.send('页面不存在');
            }
        }
    });


}

//获取Token
exports.GetClientInfo = function (req, res) {
    var clientInfo = req.signedCookies.AuthenticationToken || req.session.AuthenticationToken;
    res.json({clientInfo: clientInfo});
};

exports.GenerateVerificationCode = function (req, res) {
    var ccap = require('ccap')({
        width: 130,
        height: 50,
        offset: 30,
        fontsize: 45,
        quality: 100,
        generate: function () {
            return generateVerificationCode(4);
        }
    });
    var ary = ccap.get();
    var verificationCode = ary[0];
    var buf = ary[1];
    req.session.VerificationCode = verificationCode;
   //console.log("Current Buf VerificationCode "+req.session.VerificationCode);
    res.send(buf);
};
exports.GetSessionInfo=function(req,res){
    var clientInfo=req.session.clientInfo||false;
    res.send({clientInfo:clientInfo});
}

//生成验证码
function generateVerificationCode(num) {
    var codeSource = [//'1','2','3','4','5','6','7','8','9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var codeText = '';
    for (var i = 0; i < num; i++) {
        var random = Number((Math.random() * 49).toFixed(0));
        codeText += codeSource[random];
    }
    return codeText;
}

function generateRandomToken(callback) {
    crypto.randomBytes(256, function (err, buffer) {
        if (err) return callback(err);
        var token = crypto
            .createHash('sha1')
            .update(buffer)
            .digest('hex');

        callback(false, token);
    });
};

function VerificationMatch(clientCode, serverCode, isFuzzy) {
    if (!isFuzzy) {
        return clientCode == serverCode;
    }
    else {
        return clientCode.toLowerCase() == serverCode.toLowerCase();
    }
}

function IsSkip(orgUrl) {
    var returnValue = null;
    var skipArry = ConfigInfo.TokenConfig.SkipVerification;
    if (orgUrl == "/") {
        return returnValue = true;
    }
    var urlArr = orgUrl.split('/');
    for (var index in urlArr) {
        var urlParam = urlArr[index];
        for (var i = 0; i < skipArry.length; i++) {
            if (urlParam.search(skipArry[i]) >= 0) {
                returnValue = true;
                break;
            }
        }
    }

//    for (var i = 0; i < skipArry.length; i++) {
//        if(orgUrl.search(skipArry[i])>0){
//            returnValue=true;
//            break;
//        }
//    }
    return returnValue;
}

//var generateRandomToken = function (callback) {
//    crypto.randomBytes(256, function (err, buffer) {
//        if (err) return callback(err);
//        var token = crypto
//            .createHash('sha1')
//            .update(buffer)
//            .digest('hex');
//
//        callback(false, token);
//    });
//};

function getUserInformationByToken(token, callback) {
    var sqlCommand = 'SELECT *  ' +
        'FROM `core_authorization` ' +
        'WHERE currentToken=?;';
    var sqlParameters = [token];
    pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, res) {
        if (err) {
            console.log('tokenVerification_GetUserInformationByToken error ' + err.message);
            return;
        }
        if (res.length > 0) {
            var result = res[0];
            callback(true, result);
            return;
        }
        callback(false, res);
    });
};

function GetTokenFromRequest(req) {
    var currentToken = null;
    try {
        currentToken = req.signedCookies.AuthenticationToken //点击了记住我
            || req.session.AuthenticationToken//未点击记住我
            || req.headers.authentication;//来自Mobile

        var clientInfo = utility.ParamToJson(currentToken);
        if (typeof(clientInfo) == "object") {
            currentToken = clientInfo.ClientToken;
        }
    }
    catch (e) {
        currentToken = currentToken;
    }
    return currentToken;
}

//function GetUserInformationByToken(token, callback) {
//    var currentToken = token;
//    redisHelper.get(currentToken, function (value) {
//        if (value != null && value != false) {
//            var redisInfo = JSON.parse(value);
//            console.log("GetUserInformationByToken from Redis:[%s]", currentToken);
//            callback(true, redisInfo.clientInfo);
//        }
//        else {
//            var sqlCommand =
//                "SELECT a.`Id`,a.`userId` as 'UserID',a.`tenant` as 'TenantID', a.currentToken as 'ClientToken', " +
//                "u.username UserName,  " +
//                "t.customer_names CustomName " +
//                "FROM `core_authorization` a " +
//                "left join core_user u " +
//                "on a.userId=u.id " +
//                "left join tenants_tenants t " +
//                "on a.tenant=t.id " +
//                "where a.currentToken=? " +
//                "group by a.`userId`,a.`tenant` " +
//                "limit 1; ";
//            var sqlParameters = [currentToken];
//            pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, res) {
//                if (err) {
//                    console.log('tokenVerification_GetUserInformationByToken error ' + err.message);
//                    callback(false, err);
//                }
//                if (res.length > 0) {
//                    var result = res[0];
//                    var clientInfo = {ClientToken: result.ClientToken,
//                        CustomName: result.CustomName,
//                        TenantID: result.TenantID,
//                        UserID: result.UserID,
//                        UserName: result.UserName};
//                    console.log("GetUserInformationByToken from DB:[%s]", currentToken);
//                    callback(true, clientInfo);
//                }
//                else {
//                    callback(false, err);
//                }
//            });
//        }
//    });
//};

//保存Token
exports.SaveToken = SaveToken;
function SaveToken(req, token, expires, user, clientInfo, callback) {
    //数据准备
    var currentToken = token;
    var tokenExpires = moment(expires).utc().format('YYYY-MM-DD HH:mm:ss');
    var userId = user.id;
    var tenant = user.tenant;
    var ipAddress = req.host;
    var ipsProxy = req.ips.toString();
    var userAgent = req.get('User-Agent');
    var createTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    //构造SQL命令
    var sqlCommand = "INSERT INTO `core_authorization` " +
        "(`currentToken`,`tokenExpires`,`userId`,`tenant`,`ipAddress`,`ipsProxy`,`userAgent`,`createTime`) " +
        "VALUES(?,?,?,?,?,?,?,?);";
    var sqlParameter = [currentToken, tokenExpires, userId, tenant, ipAddress, ipsProxy, userAgent, createTime];
    pool.ExecuteQuery(sqlCommand, sqlParameter, function (err, res) {
        if (err) {
            //console.log('tokenVerification_SaveToken error:' + err.message);
            callback(err, false);
            return;
        }
        //保存到Redis
        var userClient = {ipsProxy: ipsProxy, userAgent: userAgent, ipAddress: ipAddress, tokenExpires: tokenExpires, clientInfo: clientInfo};
        redisHelper.set(currentToken, JSON.stringify(userClient));
        //console.log('tokenVerification_SaveToken success: ' + res);
        callback(err, true);
    });
};

//验证Token
exports.VerifyToken = VerifyToken;
function VerifyToken(req, res, callback) {
    //获取客户端Token
    var currentToken = null;
    currentToken = req.cookies.clienttoken //点击了记住我
        || req.session.clientInfo//未点击记住我
        || req.headers.authentication;//来自Mobile

    var clientInfo = req.session.clientInfo;//utility.ParamToJson(currentToken);
    if (typeof(clientInfo) == "object") {
        currentToken = clientInfo.ClientToken;
        callback(true);
        return;
    }

    console.log("VerifyToken:[%s],token comes from [%s]", currentToken, req.originalUrl);
    if (currentToken) {
        //验证
        var ipAddress = req.host;
        var ipsProxy = req.ips.toString();
        var userAgent = req.get('User-Agent');
        //redis 快速验证开始
        redisHelper.get(currentToken, function (value) {
            if (value != null && value != false) {
                var userClient = JSON.parse(value);
                var currentTime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
                var expiresTime = moment(userClient.tokenExpires).utc().format('YYYY-MM-DD HH:mm:ss');
                if (moment(currentTime).isBefore(expiresTime)) {
                    var rt = ipAddress == userClient.ipAddress &&
                        ipsProxy == userClient.ipsProxy &&
                        userAgent == userClient.userAgent;
                    if (rt) {
                        console.log('Redis Verify Token(%s) Success!', currentToken);
                        GetUserInformationByToken(currentToken, function (hasInfo, clientInfo) {
                            if (hasInfo) {
                                req.session.clientInfo = clientInfo;
                                callback(true);//验证通过
                            }
                            else {
                                callback(false);
                            }

                        });
                    }
                    else {
                        callback(false);//用户客户端信息不匹配验证失败
                    }
                }
                else {
                    callback(false);//Token过期
                }
            }
            else {
                //redis 快速验证结束
                //构造SQL查询逻辑
                var sqlCommand = 'SELECT `Id`,`tokenExpires` ' +
                    'FROM `core_authorization` ' +
                    'where currentToken=? and ipAddress=? and ipsProxy=? and userAgent=?; ';
                var sqlParameters = [currentToken, ipAddress, ipsProxy, userAgent];
                pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, res) {
                    if (err) {
                        //console.log('tokenVerification_VerifyToken error ' + err.message);
                        callback(false);
                    }
                    else {
                        if (res.length > 0) {
                            var result = res[0];
                            var currentTime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
                            var expiresTime = moment(result.tokenExpires).utc().format('YYYY-MM-DD HH:mm:ss');
                            if (moment(currentTime).isBefore(expiresTime)) {
                                GetUserInformationByToken(currentToken, function (hasInfo, clientInfo) {
                                    if (hasInfo) {
                                        req.session.clientInfo = clientInfo;
                                        callback(true);//验证通过
                                    }
                                    else {
                                        callback(false);
                                    }
                                });
                                //callback(true);//验证通过
                            }
                            else {
                                callback(false);//Token过期
                            }
                        }
                        else {
                            callback(false);//数据库无此Token
                        }
                    }
                });
            }
        });
    }
    else {
        callback(false);//无客户端Token
    }
};

//延期Token（指定过期日期）
exports.DelayToken = DelayToken;
function DelayToken(req, res, token, expires) {
    var sqlCommand = 'UPDATE `core_authorization` ' +
        'SET `tokenExpires` = ? ' +
        'WHERE `currentToken` = ?;';
    var sqlParameters = [expires, token];
    //sqlCommand = "call DelayToken(?,?);";
    pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, result) {
        if (err) {
            //console.log('tokenVerification_DelayToken error ' + err.message);
            return;
        }
        //res.json({AffectRowCount: result.affectedRows});
        res.json(result);
    });
};

//延期Token（配置时间）
exports.ClientRequestDelayToken = ClientRequestDelayToken
function ClientRequestDelayToken(req) {
    var token = GetTokenFromRequest(req);
    var now = moment().add(ConfigInfo.TokenConfig.TokenSaveDays, 'day');
    var expiresFromNow = now.utc().format('YYYY-MM-DD HH:mm:ss');
    //刷新MysqlDB token过期时间
    var sqlCommand = 'UPDATE `core_authorization` ' +
        'SET `tokenExpires` = ? ' +
        'WHERE `currentToken` = ?;';
    var sqlParameters = [expiresFromNow, token];
    //sqlCommand = "call DelayToken(?,?);";
    pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, result) {
        if (err) {
            //console.log('tokenVerification_DelayToken error ' + err.message);
            return;
        }
        //res.json({AffectRowCount: result.affectedRows});
        redisHelper.get(token, function (value) {
            var ci = JSON.parse(value);
            ci.tokenExpires = expiresFromNow;
            redisHelper.set(token, ci);
            res.json(result);
        });
        //刷新Redis token过期时间
    });
};

//删除Token
exports.DeleteToken = DeleteToken;
function DeleteToken(token, callback) {
    getUserInformationByToken(token, function (noerr, result) {
        if (noerr) {
            var sqlCommand = 'Delete from `core_authorization` ' +
                'WHERE `Id` = ?;';
            var sqlParameters = [result.Id];
            pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, result) {
                if (err) {
                    //console.log('tokenVerification_DelayToken error ' + err.message);
                    return;
                }
                callback(err, result.affectedRows);
            });
        }
    });
};

//刷新Token
exports.RefreshToken = RefreshToken;
function RefreshToken(req, res) {
    //数据准备
    var now = moment().add(7, 'day');
    var expiresFromNow = now.utc().format('YYYY-MM-DD HH:mm:ss');

    var oldToken = GetTokenFromRequest(req);
    console.log(oldToken);
    getUserInformationByToken(oldToken, function (noerr, result) {
        if (noerr) {
            generateRandomToken(function (err, token) {
                var id = result.Id;
                var currentToken = token;
                var tokenExpires = expiresFromNow;
                var userId = result.userId;
                var tenant = result.tenant;
                var ipAddress = req.host;
                var ipsProxy = req.ips.toString();
                var userAgent = req.get('User-Agent');
                var lastToken = oldToken;
                var createTime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
                //构造SQL语句
                var sqlCommand = "INSERT INTO `core_authorization` " +
                    "(`currentToken`,`tokenExpires`,`userId`,`tenant`,`ipAddress`,`ipsProxy`," +
                    "`userAgent`,`lastToken`,`createTime`) " +
                    "VALUES(?,?,?,?,?,?,?,?,?);";
                var sqlParameters = [currentToken, tokenExpires, userId, tenant, ipAddress, ipsProxy,
                    userAgent, lastToken, createTime];
                //插入
                pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, result) {
                    if (err) {
                        //console.log('tokenVerification_RefreshToken error ' + err.message);
                        res.json({RefreshToken: false});
                        return;
                    }
                    try {
                        if (req.signedCookies.AuthenticationToken)
                            res.cookie('AuthenticationToken', token, {
                                signed: true,
                                expires: new Date(expiresFromNow),
                                httpOnly: true
                            });
                    }
                    catch (ex) {
                        req.session.AuthenticationToken = token;
                    }
                    pool.ExecuteQuery('delete from core_authorization where Id=?', [id], function (err, result) {
                        console.log(result);
                    });
                    res.json({RefreshToken: true});
                });
            });
        }
        else {
            console.log('4');
            res.json({RefreshToken: false});
        }
    });
};

//通过Token获取用户信息
exports.GetUserInformationByToken = GetUserInformationByToken;
function GetUserInformationByToken(token, callback) {
    var currentToken = token;
    redisHelper.get(currentToken, function (value) {
        if (value != null && value != false) {
            var redisInfo = JSON.parse(value);
            console.log("GetUserInformationByToken from Redis:[%s]", currentToken);
            callback(true, redisInfo.clientInfo);
        }
        else {
            var sqlCommand =
                "SELECT a.`Id`,a.`userId` as 'UserID',a.`tenant` as 'TenantID', a.currentToken as 'ClientToken', " +
                "u.username UserName,  " +
                "t.customer_names CustomName " +
                "FROM `core_authorization` a " +
                "left join core_user u " +
                "on a.userId=u.id " +
                "left join tenants_tenants t " +
                "on a.tenant=t.id " +
                "where a.currentToken=? " +
                "group by a.`userId`,a.`tenant` " +
                "limit 1; ";
            var sqlParameters = [currentToken];
            pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, res) {
                if (err) {
                    //console.log('tokenVerification_GetUserInformationByToken error ' + err.message);
                    callback(false, err);
                }
                if (res.length > 0) {
                    var result = res[0];
                    var clientInfo = {ClientToken: result.ClientToken,
                        CustomName: result.CustomName,
                        TenantID: result.TenantID,
                        UserID: result.UserID,
                        UserName: result.UserName};
                    console.log("GetUserInformationByToken from DB:[%s]", currentToken);
                    callback(true, clientInfo);
                }
                else {
                    callback(false, err);
                }
            });
        }
    });
};