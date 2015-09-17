/// <reference path="../jquery.cookie.js" />
/// <reference path="../common/tools.js" />
/*与API交互接口*/
(function () {
    var domain = "";
    window.baseTools = {
        getSecurityCode: function () {//获取验证码
            var self = this;
            var url = domain + "/api/authentication/verification?" + Math.random();
            return url;
        },
        getVersion:function(parameters,callback){//获取版本号
            var self = this;
            var url = domain + "/api/middleware/GetVersion";
            self.getDataIsCheckCookie(url, parameters, callback,null,null,false);
        },
        checkLogin: function (parameters, callback,timeoutcallback) {//检验登录
            var self = this;
            var url = domain + "/api/authentication/login";
            self.LoginFun(url, parameters, callback,'post',timeoutcallback);
        },
        loginOut: function (parameters, callback) {
            var self = this;
            clearCookie();
            //ajax9();
            var url = domain + "/api/authentication/logout";
            location.href = url;
        },
        getModuleList:function(parameters, callback){
            var self = this;
            var url = domain + "/api/manage/GetModelList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        getLoginInfo:function(parameters, callback){
            var self = this;
            var url = domain + "/api/authentication/getLoginInfo";
            parameters = { params: parameters };
            self.getData(url, parameters, callback,'get');
        },
        getTenantList:function(parameters, callback){
            var self = this;
            var url = domain + "/api/tenant/GetTenantList";
            self.getDataIsCheckCookie(url, parameters, callback,null,null,false);
        },
        getPermission: function (parameters, callback) {//获取权限
            var self = this;
            var url = domain + "/api/manage/GetPermission";
            self.getData(url, parameters, callback);
        },
        getUserById: function (parameters, callback) {//获取用户
            var self = this;
            var url = domain + "/api/manage/GetUserById";
            self.getData(url, parameters, callback);
        },
        getUserList: function (parameters, callback) {//获取用户列表
            var self = this;
            var url = domain + "/api/manage/GetUserList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        addUser: function (parameters, callback) {//添加用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback);
        },
        editUser: function (parameters, callback) {//编辑用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback, "put");
        },
        updatePassword: function (parameters, callback) {//修改密码
            var self = this;
            var path = "/api/manage/UpdatePassword";
            self.editData(path, parameters, callback);
        },
        resetPassword: function (parameters, callback) {//修改密码
            var self = this;
            var path = "/api/manage/ResetPassword";
            self.editData(path, parameters, callback);
        },
        updateUserInformation: function (parameters, callback) {//修改密码
            var self = this;
            var path = "/api/manage/UpdateUserInformation";
            self.editData(path, parameters, callback);
        },
        deleteUser: function (parameters, callback) {//删除用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback, "delete");
        },
        getGrouptById: function (parameters, callback) {//获取组
            var self = this;
            var url = domain + "/api/manage/GetGroupById";
            self.getData(url, parameters, callback);
        },
        getGroupbyCondition: function (parameters, callbac) {//获取组通过查询条件
            var self = this;
            var url = domain + "/api/manage/GetGroupByCondition";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        getGroupList: function (parameters, callback) {//获取用户
            var self = this;
            var url = domain + "/api/manage/GetGroupList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        addGroup: function (parameters, callback) {//添加用户
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback);
        },
        editGroup: function (parameters, callback) {//编辑组
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback, "put");
        },
        deleteGroup: function (parameters, callback) {//删除组
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback, "delete");
        },
        getNews: function (parameters, callback) {//获取新闻舆情
            var self = this;
            var url = domain + "/api/middleware/GetNewsList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetHandleStatus: function (parameters, callback) {//获取舆情处理状态
            var self = this;
            var url = domain + "/api/middleware/GetHandleStatus";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getEnNews: function (parameters, callback) {//获取En新闻舆情
            console.log('获取En新闻舆情');
            var self = this;
            var url = domain + "/api/middleware/GetEnNewsList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getWeibo: function (parameters, callback) {//获取微博舆情
            console.log('获取微博舆情');
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getWeixin: function (parameters, callback) {//获取微信舆情
            console.log('获取微博舆情');
            var self = this;
            var url = domain + "/api/middleware/GetWeiXinList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        editNews: function (parameters, callback) {//编辑新闻
            var self = this;
            var path = "/api/middleware/EditNewsByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        editEnNews: function (parameters, callback) {//编辑英文新闻。。与editNews 一样，但是为了让InfoMonitoring.js公共使用。
            var self = this;
            var path = "/api/middleware/EditNewsByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        editWeiBo: function (parameters, callback) {//编辑微博
            var self = this;
            var path = "/api/middleware/EditWeiBoByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        editWeixin: function (parameters, callback) {//编辑微信
            var self = this;
            var path = "/api/middleware/EditWeiXinByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        addEmergency: function (parameters, callback) {//添加应急方案
            var self = this;
            var path = "/api/middleware/AddEmergencyPlan";
            self.editData(path, parameters, callback);
        },
        deleteEmergency: function (parameters, callback) {//删除应急方案
            var self = this;
            var path = "/api/middleware/DeleteEmergencyPlanByID";
            self.editData(path, parameters, callback, "get");
        },
        editEmergency: function (parameters, callback) {//编辑应急方案
            var self = this;
            var path = "/api/middleware/UpdateEmergencyPlan";
            self.editData(path, parameters, callback);
        },
        getEmergency: function (parameters, callback) {//获取应急预案
            var self = this;
            var url = domain + "/api/middleware/GetEmergencyPlanByCondition";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getPermission: function (parameters, callback) {//获取权限
            var self = this;
            var url = domain + "/api/manage/GetModulePermissionByToken";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback, 'get');
        },
        getSentimentReport: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/getSentimentReport";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentDailyReport: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/GetSentimentDailyReport";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentReportByCategory: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/GetSentimentReportByCategory";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentReportBySide: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/GetSentimentReportBySide";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentReportBySource: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/GetSentimentReportBySource";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentReportBySensitive: function (parameters, callback) {//舆情汇总报表
            var self = this;
            var url = domain + "/api/middleware/GetSentimentReportBySensitive";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        //room14
        getHotWords: function (parameters, callback) {//热词
            var self = this;
            var url = domain + "/api/middleware/GetHotWords";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getSentimentLinear: function (parameters, callback, timeoutCallback) {//指数 
            var self = this;
            var url = domain + "/api/middleware/GetSentimentLinear";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback, null, timeoutCallback);
        },
        GetNewsSentimentPie: function (parameters, callback) {//新闻饼图 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentPie";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentPie: function (parameters, callback) {//新闻和微博饼图
            var self = this;
           // var url = domain + "/api/middleware/GetNewsAndWeiBoSentimentPie";
            var url = domain + "/api/middleware/GetSentimentPie";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentPie: function (parameters, callback) {//微博饼图 
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentPie";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetNewsSentimentMonth: function (parameters, callback) {//新闻月度统计图 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentMonth";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentMonth: function (parameters, callback) {//微博月度统计图 
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentMonth";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetNewsSentimentMonitor: function (parameters, callback) {//新闻监听 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentMonitor";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentMonitor: function (parameters, callback) {//微博监听
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentMonitor";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentPublish: function (parameters, callback) {//微博发布
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentPublish";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetBrands:function(parameters, callback){//获取十六级
            var self = this;
            var url = domain + "/api/middleware/GetBrands";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentiment: function (parameters, callback) {//首页获取负面趋势（小时）
            var self = this;
            var url = domain + "/api/middleware/GetSentiment/hour";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetSentimentDay: function (parameters, callback) {//关注度曲线（首页获取负面趋势（周））
            var self = this;
            var url = domain + "/api/middleware/GetSentimentDay";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoHot: function (parameters, callback) {//热点播报
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoHot";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },

        /*<Managerment_APIs>*/
        GetManagerNews: function (parameters, callback) {//获取新闻列表(管理)
            var self = this;
            var url = domain + "/api/middleware/GetNewsListByBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetManagerEnNews: function (parameters, callback) {//获取海外新闻列表(管理)
            var self = this;
            var url = domain + "/api/middleware/GetEnNewsListBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetManagerWeibo: function (parameters, callback) {//获取微博列表(管理)
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoListByBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetManagerWeixin: function (parameters, callback) {//获取微信列表(管理)
            var self = this;
            var url = domain + "/api/middleware/GetWeiXinListBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteNewsBat: function (parameters, callback) {//批量删除新闻(管理)
            var self = this;
            var url = domain + "/api/middleware/DeleteNews";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditNewsBat: function (parameters, callback) {//批量更新新闻(管理)
            var self = this;
            var url = domain + "/api/middleware/EditNewsOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteWeiboBat: function (parameters, callback) {//批量删除微博(管理)
            var self = this;
            var url = domain + "/api/middleware/DeleteWeiBo";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditWeiboBat: function (parameters, callback) {//批量更新微博(管理)
            var self = this;
            var url = domain + "/api/middleware/EditWeiBoOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteWeixinBat: function (parameters, callback) {//批量删除微信(管理)
            var self = this;
            var url = domain + "/api/middleware/DeleteWeiXin";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditWeixinBat: function (parameters, callback) {//批量更新微信(管理)
            var self = this;
            var url = domain + "/api/middleware/EditWeiXinOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        /*<分词管理>*/
        GetCategoryTagList: function (parameters, callback) {//微信处理日志
            var self = this;
            var url = domain + "/api/manage/GetCategoryTagList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        AddCategoryTag: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/AddCategoryTag";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        DeleteCategoryTag: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/DeleteCategoryTag";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        SaveCategoryTag: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/SaveCategoryTag";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        /*</分词管理>*/
        /*<搜索关键字>*/
        GetSearchKeywordsList: function (parameters, callback) {//微信处理日志
            var self = this;
            var url = domain + "/api/manage/GetSearchKeywordsList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        AddSearchKeywords: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/AddSearchKeywords";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        UpdateSearchKeywords: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/UpdateSearchKeywords";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        DeleteSearchKeywords: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/manage/DeleteSearchKeywords";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        /*</搜索关键字>*/

        /*</Managerment_APIs>*/


        GetNewsHandleLog: function (parameters, callback) {//新闻处理日志
            var self = this;
            var url = domain + "/api/middleware/GetNewsHandleLog";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoHandleLog:function(parameters, callback){//微博处理日志
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoHandleLog";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiXinHandleLog:function(parameters, callback){//微信处理日志
            var self = this;
            var url = domain + "/api/middleware/GetWeiXinHandleLog";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
     
        editData: function (path, parameters, callback, type) {//编辑数据
            var self = this;
            var url = domain + path;
            self.setData(url, parameters, callback, type);
        },
        getData: function (url, options, callback, type, timeoutCallback) {//获取数据
            try {
                    //CheckCookies();
                //$(document).queue(function () { 
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    beforeSend: function(req){
                        var token=$.cookie("authentication");
                        if(token){
                            req.setRequestHeader("authentication",token);
                        }
                    },
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //  alert('error:' + textStatus + ',' + errorThrown);
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            if (timeoutCallback != null&&timeoutCallback!=undefined) {
                                console.log(status);
                                timeoutCallback();
                            }
                        }
                    }
                });
                if (jqXhr) {
                    //jqXhr.abort();
                }
                //$(this).dequeue();
                // });
            } catch (e) {
                alert(e.message);
            }
        },
        getDataIsCheckCookie:function(url, options, callback, type, timeoutCallback,isCheckCookie){
            try {
                if(isCheckCookie){
                    //CheckCookies();
                }

                //$(document).queue(function () {
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    beforeSend: function(req){
                        var token=$.cookie("authentication");
                        if(token){
                            req.setRequestHeader("authentication",token);
                        }
                    },
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //  alert('error:' + textStatus + ',' + errorThrown);
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            if (timeoutCallback != null&&timeoutCallback!=undefined) {
                                console.log(status);
                                timeoutCallback();
                            }
                        }
                    }
                });
                if (jqXhr) {
                    //jqXhr.abort();
                }
                //$(this).dequeue();
                // });
            } catch (e) {
                alert(e.message);
            }
        },
        LoginFun: function (url, options, callback, type, timeoutCallback) {//获取数据
            try {
                //$(document).queue(function () { 
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //  alert('error:' + textStatus + ',' + errorThrown);
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            if (timeoutCallback != null) {
                                console.log(status);
                                timeoutCallback();
                            }
                        }
                    }
                });
            } catch (e) {
                alert(e.message);
            }
        },
        setData: function (url, options, callback, type) {//设置数据
            try {
                $.ajax({
                    url: url,
                    dataType: "json",
                    data: options || {},
                    type: type || 'post',
                    jsonpCallback: 'callback',
                    success: function (result) {
                        if (result && callback) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error:' + textStatus + ',' + errorThrown);
                    }
                });
            } catch (e) {
                alert(e.message);
            }
        },
        translateWeiBoSource: function (str) {//微博转换
            var result = "";
            switch (str) {
                case "sina_weibo":
                    result = "新浪";
                    break;
                case "163_weibo":
                    result = "网易";
                    break;
                case "qq_weibo":
                    result="腾讯";
                    break;
                default:
                    result="微博";
                    break;

            }
            return result;
        },
        translateWeiBoSourceI: function (str) {//微博转换
            var result = "";
            switch (str) {
                case "sina_weibo":
                    result = "来自新浪微博";
                    break;
                case "163_weibo":
                    result = "来自网易微博";
                    break;
                case "qq_weibo":
                    result="来自腾讯微博";
                    break;
                default:
                    result="来自微博";
                    break;

            }
            return result;
        }
    };

    window.global = {
        UserInfo: {
            UserName: $.cookie(cookieInfo.uname) || "",
            CustomerName: $.cookie(cookieInfo.cname) || "",
            UserID: $.cookie(cookieInfo.uid) || "",
            ClientToken: $.cookie(cookieInfo.token) || "",
            FullCustomerName: $.cookie(cookieInfo.fcname)||"",
            TokenId: null
        },
        CustormerLogo: {
            "昆山": "昆山市",
            "洪泽": "洪泽县",
            "南通": "南通市",
            "无锡": "无锡市",
            "盐城": "盐城市",
            "哈尔滨": "哈尔滨市",
            "烟台": "烟台市",
            "佛山": "佛山市",
            "东莞": "东莞市",
            "北京": "北京市",
             "济宁":"济宁市",
            "软通动力": "软通动力"
            //"昆山": "/img/default/LogoImg/logo.png",
            //"洪泽": "/img/default/LogoImg/logo.png",
            //"南通": "/img/default/LogoImg/logo.png",
            //"无锡": "/img/default/LogoImg/logo.png",
            //"盐城": "/img/default/LogoImg/logo.png",
            //"哈尔滨": "/img/default/LogoImg/logo.png",
            //"烟台": "/img/default/LogoImg/logo.png",
            //"佛山": "/img/default/LogoImg/logo.png"
        }
    };
})();
//验证登录超时（UI）
function CheckCookies() {
    var token = $.cookie(cookieInfo.token);
    var userid = $.cookie(cookieInfo.uid);
    if (token == null || userid == null) {
        //window.location.href = "/login.html";
    }
}
function RedirectLogin(){
    //window.location.href = "/login.html";
}
