var ConfigInfo = require('../Config');
var pool = require('../lib/DbHelper');
var moment = require('moment');
var async = require('async');
var utility = require('../lib/Utility');
var path = require('path');
var BasicSettings = ConfigInfo.BasicSettings;
var redisHelper = require('../lib/RedisHelper.js');
var Handler = require('../lib/Model/Handler');
//获取版本号
exports.GetVersion = function (req, res) {
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    var reusltObj;
    if (query.key) {
        reusltObj = utility.jsonResult(false, {version: BasicSettings[query.key]});
    } else {
        reusltObj = utility.jsonResult(false, {version: BasicSettings.innerVersion});
    }
    res.send(reusltObj);
};
//获取十六级
exports.GetBrands = function (req, res) {
    var sql = "SELECT DISTINCT category_name FROM cfg_sys_information_tag WHERE classification_name='政府舆情'";
    pool.ExecuteQuery(sql, null, function (err, rows) {
        if (err) {
            console.log(err);
            return res.send(utility.jsonResult(err));
        }
        if (rows.length > 0) {
            return  res.send(utility.jsonResult(null, rows));
        }
    });
}
//获取新闻列表
exports.GetNewsList = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = "select * from v_b_news_evaluation_customer where search_engine <> 'bing_news_api_en' and news_title is not null and report_date <= now()";

    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and report_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and report_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.news_title)) {
        sql += " and news_title like '%\\" + query.news_title + "%'";
    }
    if (utility.isValidData(query.status)) {//舆情状态 已处理、未处理
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {//是否敏感
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    //console.log(sql);
    async.parallel([function (callback) {
        pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, result);
        });
    }],function (err, results) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        if (results.length > 0) {
            var data = {
                success: true,
                totalcount: results[1][0].count,
                rows: results[0]
            };
            res.send(data);
        }
    });
    //pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
    //    if (err) {
    //        console.error(err);
    //        res.send(utility.jsonResult(err));
    //        return;
    //    }
    //    var data = {
    //        success: true,
    //        totalcount: 0,
    //        rows: rows
    //    };
    //    pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
    //        //console.log('查询到新闻总行数：' + result[0].count);
    //        if (err) {
    //            res.send(utility.jsonResult(err));
    //        }
    //        else {
    //            data.totalcount = result[0].count;
    //            res.send(data);
    //        }
    //    });
    //});
    //});
};
exports.GetHandleStatus = function (req, res) {
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    if (!utility.isValidData(query.b_id)||!utility.isValidData(query.sentiment_type)) {
        res.send(utility.jsonResult('缺少必须参数b_id'));
        return;
    }
    if (!utility.isValidData(query.sentiment_type)) {
        res.send(utility.jsonResult('缺少必须参数sentiment_type'));
        return;
    }
    var tableName = 'b_news_evaluation_handle';
    switch(query.sentiment_type){
        case 'news':
            tableName = 'b_news_evaluation_handle';
            break;
        case 'weibo':
            tableName = 'b_weibo_evaluation_handle';
            break;
        case 'weixin':
            tableName = 'b_weixin_evaluation_handle';
            break;
    }
    var sql ="SELECT * FROM "+tableName+" WHERE b_id = ? LIMIT 1";
    var sqlParams = [query.b_id];
    pool.ExecuteQueryNoCache(sql, sqlParams,function (err, result) {
        res.send(utility.jsonResult(err,result));
    });
}
//获取新闻列表
exports.GetNewsListByBrand = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = "select * from b_news_evaluation where search_engine <> 'bing_news_api_en' and news_title is not null";

    if (clientInfo != null && clientInfo != false) {
        //sql += " and customer_name = ?";
        // sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and report_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and report_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.news_title)) {
        sql += " and news_title like '%\\" + query.news_title + "%'";
    }
    if (utility.isValidData(query.status)) {//舆情状态 已处理、未处理
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {//是否敏感
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        var data = {
            success: true,
            totalcount: 0,
            rows: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            //console.log('查询到新闻总行数：' + result[0].count);
            if (err) {
                res.send(utility.jsonResult(err));
            }
            else {
                data.totalcount = result[0].count;
                res.send(data);
            }
        });
    });
    //});
};

//编辑新闻
exports.EditNewsByID = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    if (!utility.isValidData(query.b_id)) {
        res.send(utility.jsonResult('缺少必须参数新闻ID'));
        return;
    }
    var checkIsExistsSql = "select count(0) as counts,IFNULL(status,0) as status from b_news_evaluation_handle where b_id = " + query.b_id;
    pool.ExecuteQueryNoCache(checkIsExistsSql, function (err, result) {
        if (err) {
            res.send(utility.jsonResult(err));
        }
        else {
            if (result[0].counts > 0) {//已经存在，则修改
                if (result[0].status && utility.isValidData(query.status)) {
                    return  res.send(utility.jsonResult("此新闻已经处理过"));
                }
                var sql = 'update b_news_evaluation_handle set updated_date= now()';
                var sqlParams = [];
                if (utility.isValidData(query.status)) {
                    sql += " ,status = ?";
                    sqlParams.push(query.status);
                    if (clientInfo != null && clientInfo != false) {
                        sql += " ,handle_user = ?";
                        sqlParams.push(clientInfo.UserID);
                        sql += " ,handle_date = now()";
                    }
                }
                if (query.is_sensitive != undefined) {
                    sql += " ,is_sensitive = ?";
                    sqlParams.push(query.is_sensitive);
                }
                if (query.handle_id != undefined) {
                    sql += " ,handle_id = ?";
                    sqlParams.push(query.handle_id);
                }
                if (query.handle_type != undefined) {
                    sql += " ,handle_type = ?";
                    sqlParams.push(query.handle_type);
                }
                if (query.handle_remark != undefined) {
                    sql += " ,handle_remark = ?";
                    sqlParams.push(query.handle_remark);
                }
                if (clientInfo != null && clientInfo != false) {
                    sql += " ,updated_by = ?";
                    sqlParams.push(clientInfo.UserID);
                }
                sql += " where b_id = ?";

                if (query.status) {
                    sql += " and IFNULL(STATUS,0)!=1";
                }
                sqlParams.push(query.b_id);
                pool.ExecuteQuery(sql, sqlParams, function (err, result) {
                    if (err) {
                        console.error(err);
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_news_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功！'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败！'));
                        }
                    }
                });
            }
            else {//不存在记录，则插入新数据
                var insertSql = "insert into `b_news_evaluation_handle`(`b_id`,`STATUS`,`is_sensitive`,`updated_by`,`updated_date`,`handle_id`,`handle_type`,`handle_remark`,`handle_date`,`handle_user`,tenant_id)";
                insertSql += "values (?,?,?,?,?,?,?,?,?,?,?)";
                var obj = new Handler();
                obj.b_id = query.b_id;
                obj.status = query.status || 0;
                obj.is_sensitive = query.is_sensitive || 0;
                obj.updated_by = clientInfo.UserID;
                obj.updated_date = new Date();
                obj.handle_id = query.handle_id;
                obj.handle_type = query.handle_type;
                obj.handle_remark = query.handle_remark;
                obj.handle_date = new Date();
                obj.handle_user = clientInfo.UserID;
                obj.tenant_id = clientInfo.TenantID;
                var insertSqlParams = [obj.b_id, obj.status, obj.is_sensitive, obj.updated_by, obj.updated_date, obj.handle_id, obj.handle_type, obj.handle_remark, obj.handle_date, obj.handle_user, obj.tenant_id];
                pool.ExecuteQuery(insertSql, insertSqlParams, function (err, result) {
                    if (err) {
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_news_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功！'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败！'));
                        }
                    }
                });
            }
        }
    });
    //});
};

//获取微博列表
exports.GetWeiBoList = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = 'select * from v_b_weibo_evaluation_customer where status_text IS NOT NULL and created_date <= now()';
    var currentToken = null;
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and created_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and created_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.status_text)) {
        sql += " and status_text like '%\\" + query.status_text + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    async.parallel([function (callback) {
        pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, result);
        });
    }],function (err, results) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        if (results.length > 0) {
            var data = {
                success: true,
                totalcount: results[1][0].count,
                rows: results[0]
            };
            res.send(data);
        }
    });
    //pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
    //    if (err) {
    //        console.error(err);
    //        res.send(utility.jsonResult(err));
    //        return;
    //    }
    //    var data = {
    //        success: true,
    //        totalcount: 0,
    //        rows: rows
    //    };
    //    pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
    //        //console.log('查询到微博总行数：' + result[0].count);
    //        if (err) {
    //            res.send(utility.jsonResult(err));
    //        }
    //        else {
    //            data.totalcount = result[0].count;
    //            res.send(data);
    //        }
    //    });
    //});
    //});
};
//获取微博列表
exports.GetWeiBoListByBrand = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = 'select * from b_weibo_evaluation where status_text IS NOT NULL';
    var currentToken = null;
    if (clientInfo != null && clientInfo != false) {
        //sql += " and customer_name = ?";
        //sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and created_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and created_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.status_text)) {
        sql += " and status_text like '%\\" + query.status_text + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        var data = {
            success: true,
            totalcount: 0,
            rows: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            //console.log('查询到微博总行数：' + result[0].count);
            if (err) {
                res.send(utility.jsonResult(err));
            }
            else {
                data.totalcount = result[0].count;
                res.send(data);
            }
        });
    });
    //});
};

//编辑微博
exports.EditWeiBoByID = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    if (!utility.isValidData(query.b_id)) {
        res.send(utility.jsonResult('缺少必须参数微博ID'));
        return;
    }
    var checkIsExistsSql = "select count(0) as counts,IFNULL(status,0) as status from b_weibo_evaluation_handle where b_id = " + query.b_id;
    pool.ExecuteQueryNoCache(checkIsExistsSql, function (err, result) {
        if (err) {
            res.send(utility.jsonResult(err));
        }
        else {
            if (result[0].counts > 0) {//已经存在，则修改
                if (result[0].status && utility.isValidData(query.status)) {
                    return  res.send(utility.jsonResult("此条微博已经处理过"));
                }
                var sql = 'update b_weibo_evaluation_handle set updated_date= now()';
                var sqlParams = [];
                if (utility.isValidData(query.status)) {
                    sql += " ,status = ?";
                    sqlParams.push(query.status);
                    if (clientInfo != null && clientInfo != false) {
                        sql += " ,handle_user = ?";
                        sqlParams.push(clientInfo.UserID);
                        sql += " ,handle_date = now()";
                    }
                }
                if (query.is_sensitive != undefined) {
                    sql += " ,is_sensitive = ?";
                    sqlParams.push(query.is_sensitive);
                }
                if (query.handle_id != undefined) {
                    sql += " ,handle_id = ?";
                    sqlParams.push(query.handle_id);
                }
                if (query.handle_type != undefined) {
                    sql += " ,handle_type = ?";
                    sqlParams.push(query.handle_type);
                }
                if (query.handle_remark != undefined) {
                    sql += " ,handle_remark = ?";
                    sqlParams.push(query.handle_remark);
                }
                if (clientInfo != null && clientInfo != false) {
                    sql += " ,updated_by = ?";
                    sqlParams.push(clientInfo.UserID);
                }
                sql += " where b_id = ?";
                if (query.status) {
                    sql += " and IFNULL(STATUS,0)!=1";
                }
                sqlParams.push(query.b_id);
                pool.ExecuteQuery(sql, sqlParams, function (err, result) {
                    var affectedRows = result.affectedRows;
                    if (err) {
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_weibo_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败'));
                        }
                    }
                });
            }
            else {//不存在记录，则插入新数据
                var insertSql = "insert into `b_weibo_evaluation_handle`(`b_id`,`STATUS`,`is_sensitive`,`updated_by`,`updated_date`,`handle_id`,`handle_type`,`handle_remark`,`handle_date`,`handle_user`,tenant_id)";
                insertSql += "values (?,?,?,?,?,?,?,?,?,?,?)";
                var obj = new Handler();
                obj.b_id = query.b_id;
                obj.status = query.status || 0;
                obj.is_sensitive = query.is_sensitive || 0;
                obj.updated_by = clientInfo.UserID;
                obj.updated_date = new Date();
                obj.handle_id = query.handle_id;
                obj.handle_type = query.handle_type;
                obj.handle_remark = query.handle_remark;
                obj.handle_date = new Date();
                obj.handle_user = clientInfo.UserID;
                obj.tenant_id = clientInfo.TenantID;
                var insertSqlParams = [obj.b_id, obj.status, obj.is_sensitive, obj.updated_by, obj.updated_date, obj.handle_id, obj.handle_type, obj.handle_remark, obj.handle_date, obj.handle_user, obj.tenant_id];
                pool.ExecuteQuery(insertSql, insertSqlParams, function (err, result) {
                    if (err) {
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_weibo_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败'));
                        }
                    }
                });
            }
        }
    });
    //});
};

//获取英文新闻列表
exports.GetEnNewsList = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = "select * from v_b_news_evaluation_customer where search_engine = 'bing_news_api_en' and report_date <= now()";

    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and report_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and report_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.news_title)) {
        sql += " and LOWER(news_title) like '%" + query.news_title.toLowerCase() + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    //console.log(sql);
    async.parallel([function (callback) {
        pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, result);
        });
    }],function (err, results) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        if (results.length > 0) {
            var data = {
                success: true,
                totalcount: results[1][0].count,
                rows: results[0]
            };
            res.send(data);
        }
    });
    //pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
    //    if (err) {
    //        console.error(err);
    //        res.send(utility.jsonResult(err));
    //        return;
    //    }
    //    var data = {
    //        success: true,
    //        totalcount: 0,
    //        rows: rows
    //    };
    //    pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
    //        //console.log(result[0].count);
    //        if (err) {
    //            res.send(utility.jsonResult(err));
    //        }
    //        else {
    //            data.totalcount = result[0].count;
    //            res.send(data);
    //        }
    //
    //    });
    //});
    //});
};
//获取英文新闻列表
exports.GetEnNewsListByBrand = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = "select * from b_news_evaluation where search_engine = 'bing_news_api_en'";

    if (clientInfo != null && clientInfo != false) {
        //sql += " and customer_name = ?";
        //sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and report_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and report_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.news_title)) {
        sql += " and LOWER(news_title) like '%" + query.news_title.toLowerCase() + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        var data = {
            success: true,
            totalcount: 0,
            rows: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            //console.log(result[0].count);
            if (err) {
                res.send(utility.jsonResult(err));
            }
            else {
                data.totalcount = result[0].count;
                res.send(data);
            }

        });
    });
    //});
};

//获取热词（包括综合热词）
exports.GetHotWords = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'select word_name,MAX(word_count) AS mCount from b_brand_hotword where 1 = 1';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ?";
        sqlParams.push(query.field_name);
    }
    if (utility.isValidData(query.brand_name)) {
        sql += " and brand_name = ?";
        sqlParams.push(query.brand_name)
    }
    if (utility.isValidData(query.start_date)) {
        sql += " and date_id >= ?";
        sqlParams.push(parseInt(moment(query.start_date).format('YYYYMMDD')));
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and date_id < ?";
        var localTime = moment(query.end_date).add(1, 'days').format('YYYYMMDD');
        sqlParams.push(parseInt(localTime));
    }
    //极性 正面、负面、中性
    if (query.word_value != undefined) {
        if (query.word_value == '-1') {
            sql += " and word_value < 0";
        }
        else if (query.word_value == '0') {
            sql += " and word_value = 0";
        }
        else if (query.word_value == '1') {
            sql += " and word_value > 0";
        }
    }
    sql += " GROUP BY word_name order by mCount desc";
    if (query.topn != undefined && !isNaN(query.topn)) {
        sql += " limit ?";
        sqlParams.push(parseInt(query.topn));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var hotWords = [];
        for (var i = 0; i < rows.length; i++) {
            hotWords.push(rows[i].word_name);
        }
        var result = {
            success: true,
            data: hotWords
        };
        res.send(result);
    });
    //});
};

//获取舆情指数数据 二维
exports.GetSentimentLinear = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var granulityMinute = 10;//统计粒度 10分钟
    var subIndex = 11;
    var startTimeString, endTimeString, appendString;
    if (utility.isValidData(query.granulityMinute) && !isNaN(query.granulityMinute) && utility.isValidData(query.start_date) && utility.isValidData(query.end_date)) {
        //201406230829
        granulityMinute = query.granulityMinute;
        switch (granulityMinute) {
            case 60:
                subIndex = 10;
                startTimeString = moment(query.start_date).format('YYYY-MM-DD HH');
                endTime = moment(query.end_date).format('YYYY-MM-DD HH');
                appendString = "00";
                break;
            case 1440://60*24
                subIndex = 8;
                startTimeString = moment(query.start_date).format('YYYY-MM-DD');
                endTime = moment(query.end_date).add(1, 'days').format('YYYY-MM-DD');
                appendString = "0000";
                break;
            default:
                startTimeString = moment(query.start_date).format('YYYY-MM-DD HH:mm');
                endTime = moment(query.end_date).format('YYYY-MM-DD HH:mm');
                appendString = "0";
                break;
        }
    }
    else {
        res.send('缺少必须参数：指数粒度、时间区间。或者参数类型不对。');
        return;
    }
    var sql = 'SELECT ROUND(avg(score_index)) points,LEFT(date_id,' + subIndex + ') timepoint FROM `b_brand_evaluation` WHERE 1 = 1';
    var sqlParams = [];
    if (utility.isValidData(query.start_date)) {
        sql += " and date_id >=?";
        sqlParams.push(parseInt(moment(startTimeString).format('YYYYMMDDHHmm')));
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and date_id <?";
        sqlParams.push(parseInt(moment(endTimeString).format('YYYYMMDDHHmm')));
    }
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ?";
        sqlParams.push(query.field_name);
    }
    if (utility.isValidData(query.brand_name)) {
        sql += " and brand_name = ?";
        sqlParams.push(query.brand_name)
    }
    sql += ' GROUP BY LEFT(date_id,' + subIndex + ')';
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var propArray = [];
        var obj = {};
        var startTime = moment(startTimeString);
        var endTime = moment(endTimeString);
        for (var i = 0; i < rows.length; i++) {
            var prop = "timepoint_" + rows[i].timepoint;
            obj[prop] = rows[i].points;
            propArray.push(rows[i].timepoint);
        }
        while (startTime < endTime) {
            var timePoint = moment(startTime).format('YYYYMMDDHHmm').substring(0, subIndex);
            var prop = "timepoint_" + timePoint;
            if (!obj.hasOwnProperty(prop)) {
                propArray.push(timePoint);
                obj[prop] = 100;
            }
            startTime = startTime.add(granulityMinute, 'minutes');
        }
        propArray.sort();
        var dataArray = [];
        for (var i = 0; i < propArray.length; i++) {
            //20140623015 or 2014062301 or 20140623
            var time = propArray[i] + appendString;
            var year = time.substring(0, 4);
            var month = time.substring(4, 6) - 1;
            var day = time.substring(6, 8);
            var hour = time.substring(8, 10);
            var minute = time.substring(10, 12);
            dataArray.push([Date.UTC(year, month, day, hour, minute), obj["timepoint_" + propArray[i]]]);
        }
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取新闻舆情饼状分布图
exports.GetNewsSentimentPie = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'SELECT brand_name,COUNT(0) AS news_count FROM v_b_news_evaluation WHERE 1 = 1';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ?";
        sqlParams.push(query.field_name);
    }
    if (utility.isValidData(query.start_date)) {
        sql += " and report_date >= ?";
        var Time = moment(query.start_date).format();
        sqlParams.push(Time);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        sql += " and report_date < ?";
        sqlParams.push(Time);
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY brand_name";
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [];
        for (var j = 0; j < rows.length; j++) {
            dataArray.push([rows[j].brand_name, rows[j].news_count]);
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取新闻和微博舆情饼状分布图
exports.GetNewsAndWeiBoSentimentPie = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlNews = 'SELECT brand_name,COUNT(0) AS news_count FROM v_b_news_evaluation WHERE 1 = 1';
    var sqlWeiBo = 'SELECT brand_name,COUNT(0) AS news_count FROM v_b_weibo_evaluation WHERE 1 = 1';
    var sqlParamsNews = [];
    var sqlParamsWeiBo = [];
    if (clientInfo != null && clientInfo != false) {
        sqlNews += " and customer_name = ?";
        sqlWeiBo += " and customer_name = ?";
        sqlParamsNews.push(clientInfo.CustomName);
        sqlParamsWeiBo.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sqlNews += " and field_name = ?";
        sqlWeiBo += " and field_name = ?";
        sqlParamsNews.push(query.field_name);
        sqlParamsWeiBo.push(query.field_name);
    }
    if (utility.isValidData(query.start_date)) {
        sqlNews += " and report_date >= ?";
        sqlWeiBo += " and created_date >= ?";
        var Time = moment(query.start_date).format();
        sqlParamsNews.push(Time);
        sqlParamsWeiBo.push(Time);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        sqlNews += " and report_date < ?";
        sqlWeiBo += " and created_date < ?";
        sqlParamsNews.push(Time);
        sqlParamsWeiBo.push(Time);
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sqlNews += " and score > " + BasicSettings.positiveValue;
            sqlWeiBo += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sqlNews += " and score >= " + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
            sqlWeiBo += " and score >= " + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sqlNews += " and score < " + BasicSettings.negativeValue;
            sqlWeiBo += " and score < " + BasicSettings.negativeValue;
        }
    }
    sqlNews += " GROUP BY brand_name";
    sqlWeiBo += " GROUP BY brand_name";

    var sql = "select brand_name,sum(news_count) as news_count from(" + sqlNews + " UNION ALL " + sqlWeiBo + ") as a group by a.brand_name";
    var sqlParams = sqlParamsNews.concat(sqlParamsWeiBo);
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [];
        for (var j = 0; j < rows.length; j++) {
            dataArray.push([rows[j].brand_name, rows[j].news_count]);
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取舆情饼状分布图
exports.GetSentimentPie = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlNews = "SELECT brand_name,COUNT(0) AS news_count FROM v_b_news_evaluation WHERE (classification_name = '政府舆情' or classification_name is null)";
    var sqlWeiBo = "SELECT brand_name,COUNT(0) AS news_count FROM v_b_weibo_evaluation WHERE (classification_name = '政府舆情' or classification_name is null)";
    var sqlWeiXin = "SELECT brand_name,COUNT(0) AS news_count FROM v_b_weixin_evaluation WHERE (classification_name = '政府舆情' or classification_name is null)";
    var sqlParamsNews = [];
    var sqlParamsWeiBo = [];
    var sqlParamsWeiXin = [];
    if (clientInfo != null && clientInfo != false) {
        sqlNews += " and customer_name = ?";
        sqlWeiBo += " and customer_name = ?";
        sqlWeiXin += " and customer_name = ?";
        sqlParamsNews.push(clientInfo.CustomName);
        sqlParamsWeiBo.push(clientInfo.CustomName);
        sqlParamsWeiXin.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sqlNews += " and field_name = ?";
        sqlWeiBo += " and field_name = ?";
        sqlWeiXin += " and field_name = ?";
        sqlParamsNews.push(query.field_name);
        sqlParamsWeiBo.push(query.field_name);
        sqlParamsWeiXin.push(query.field_name);
    }
    if (utility.isValidData(query.start_date)) {
        sqlNews += " and report_date >= ?";
        sqlWeiBo += " and created_date >= ?";
        sqlWeiXin += " and post_date >= ?";
        var Time = moment(query.start_date).format();
        sqlParamsNews.push(Time);
        sqlParamsWeiBo.push(Time);
        sqlParamsWeiXin.push(Time);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        sqlNews += " and report_date < ?";
        sqlWeiBo += " and created_date < ?";
        sqlWeiXin += " and post_date < ?";
        sqlParamsNews.push(Time);
        sqlParamsWeiBo.push(Time);
        sqlParamsWeiXin.push(Time);
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sqlNews += " and score > " + BasicSettings.positiveValue;
            sqlWeiBo += " and score > " + BasicSettings.positiveValue;
            sqlWeiXin += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sqlNews += " and score >= " + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
            sqlWeiBo += " and score >= " + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
            sqlWeiXin += " and score >= " + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sqlNews += " and score < " + BasicSettings.negativeValue;
            sqlWeiBo += " and score < " + BasicSettings.negativeValue;
            sqlWeiXin += " and score < " + BasicSettings.negativeValue;
        }
    }
    sqlNews += " GROUP BY brand_name";
    sqlWeiBo += " GROUP BY brand_name";
    sqlWeiXin += " GROUP BY brand_name";
    async.parallel({
            news: function (cb) {
                pool.ExecuteQuery(sqlNews, sqlParamsNews, cb);
            },
            weibo: function (cb) {
                pool.ExecuteQuery(sqlWeiBo, sqlParamsWeiBo, cb);
            },
            weixin: function (cb) {
                pool.ExecuteQuery(sqlWeiXin, sqlParamsWeiXin, cb);
            }
        },
        function (err, result) {
            var obj = {};
            var dataArray = [];
            if (result.news) {
                for (var j = 0; j < result.news.length; j++) {
                    obj[result.news[j].brand_name] = result.news[j].news_count;
                }
            }
            if (result.weibo) {
                for (var j = 0; j < result.weibo.length; j++) {
                    if (!obj.hasOwnProperty(result.weibo[j].brand_name)) {
                        obj[result.weibo[j].brand_name] = result.weibo[j].news_count;
                    }
                    else {
                        obj[result.weibo[j].brand_name] += result.weibo[j].news_count;
                    }
                }
            }
            if (result.weixin) {
                for (var j = 0; j < result.weixin.length; j++) {
                    if (!obj.hasOwnProperty(result.weixin[j].brand_name)) {
                        obj[result.weixin[j].brand_name] = result.weixin[j].news_count;
                    }
                    else {
                        obj[result.weixin[j].brand_name] += result.weixin[j].news_count;
                    }
                }
            }

            for (var prop in obj) {
                dataArray.push([prop, obj[prop]]);
            }
            var resData = {
                success: true,
                data: dataArray
            };
            res.send(resData);
        });
    //});
};

//获取新闻舆情月度分布图
exports.GetNewsSentimentMonth = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = "SELECT DATE_FORMAT(report_date,'%m') months,COUNT(0) AS news_count FROM v_b_news_evaluation_customer where 1 = 1";
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
//    if (utility.isValidData(query.field_name)) {
//        sql += " and field_name = ?";
//        sqlParams.push(query.field_name);
//    }
//    if (utility.isValidData(query.brand_name)) {
//        sql += " and brand_name = ?";
//        sqlParams.push(query.brand_name)
//    }
    if (utility.isValidData(query.start_date)) {
        sql += " and report_date >= ?";
        sqlParams.push(moment(query.start_date).format());
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and report_date <= ?";
        sqlParams.push(moment(query.end_date).format());
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY DATE_FORMAT(report_date,'%m')";
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < rows.length; j++) {
            //dataArray.push([rows[j].months,rows[j].news_count]);
            dataArray[parseInt(rows[j].months) - 1] = rows[j].news_count;
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取新闻舆情每日分布图
exports.GetNewsSentimentDay = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var sqlQuery = parserSentimentDaySql(clientInfo, params, "v_b_news_evaluation_customer", "report_date");
    sentimentDayExecute(sqlQuery, res);
    //});
};

//获取新闻舆情小时，分钟，秒力度分布图
exports.GetNewsSentiment = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var timeType = req.params.TimeType;
    var sqlQuery = parserSentimentCountSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", req, timeType);
    sentimentExecute(sqlQuery, res, timeType);
    //});
};

//获取微博舆情饼状分布图
exports.GetWeiBoSentimentPie = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'SELECT brand_name,COUNT(0) AS weibo_count FROM v_b_weibo_evaluation WHERE 1 = 1';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ?";
        sqlParams.push(query.field_name);
    }
    if (utility.isValidData(query.start_date)) {
        sql += " and created_date >= ?";
        sqlParams.push(moment(query.start_date).format());
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and created_date <= ?";
        var localTime = moment(query.end_date).add(1, 'days').format();
        sqlParams.push(localTime);
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY brand_name";
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [];
        for (var j = 0; j < rows.length; j++) {
            dataArray.push([rows[j].brand_name, rows[j].weibo_count]);
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取微博舆情月度分布图
exports.GetWeiBoSentimentMonth = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = "SELECT DATE_FORMAT(created_date,'%m') months,COUNT(0) AS weibo_count FROM v_b_weibo_evaluation_customer where 1 = 1";
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
//    if (utility.isValidData(query.field_name)) {
//        sql += " and field_name = ?";
//        sqlParams.push(query.field_name);
//    }
//    if (utility.isValidData(query.brand_name)) {
//        sql += " and brand_name = ?";
//        sqlParams.push(query.brand_name)
//    }
    if (utility.isValidData(query.start_date)) {
        sql += " and created_date >= ?";
        sqlParams.push(moment(query.start_date).format());
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and created_date <= ?";
        sqlParams.push(moment(query.end_date).format());
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY DATE_FORMAT(created_date,'%m')";
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < rows.length; j++) {
            dataArray[parseInt(rows[j].months) - 1] = rows[j].weibo_count;
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取微信舆情月度分布图
exports.GetWeiXinSentimentMonth = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = "SELECT DATE_FORMAT(post_date,'%m') months,COUNT(0) AS weixin_count FROM v_b_weixin_evaluation_customer where 1 = 1";
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
//    if (utility.isValidData(query.field_name)) {
//        sql += " and field_name = ?";
//        sqlParams.push(query.field_name);
//    }
//    if (utility.isValidData(query.brand_name)) {
//        sql += " and brand_name = ?";
//        sqlParams.push(query.brand_name)
//    }
    if (utility.isValidData(query.start_date)) {
        sql += " and post_date >= ?";
        sqlParams.push(moment(query.start_date).format());
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and post_date <= ?";
        sqlParams.push(moment(query.end_date).format());
    }
    //正负极性
    if (query.level != undefined) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY DATE_FORMAT(post_date,'%m')";
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        var dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < rows.length; j++) {
            dataArray[parseInt(rows[j].months) - 1] = rows[j].weixin_count;
        }
        //console.log(dataArray);
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
    //});
};

//获取微博舆情每日分布图
exports.GetWeiBoSentimentDay = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var sqlQuery = parserSentimentDaySql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date");

    sentimentDayExecute(sqlQuery, res);
    //});
};

//获取微博舆情小时，分钟，秒分布图
exports.GetWeiBoSentiment = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var timeType = req.params.TimeType;
    var sqlQuery = parserSentimentCountSql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", req, timeType);

    sentimentExecute(sqlQuery, res, timeType)
    //});
};

//获取微博舆情和新闻每日分布图
exports.GetWeiBoAndNewsSentimentDay = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var weiboQuery = parserSentimentDaySql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", req),
        newsQuery = parserSentimentDaySql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", req);

    var sqlQuery = 'SELECT days,sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') ) tb GROUP BY days'

    sentimentDayExecute(sqlQuery, res)
    //});
};

//获取微博舆情和新闻每日分布图 ,添加微信内容。
//--New 2014-9-25
exports.GetSentimentDay = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var tableFlag = "_customer";
    if (params.query && params.query.brand_name && params.query.brand_name != "") {
        tableFlag = "";
    }
    var weiboQuery = parserSentimentDaySql(clientInfo, params, "v_b_weibo_evaluation" + tableFlag, "created_date", req),
        newsQuery = parserSentimentDaySql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", req),
        weixinQuery = parserSentimentDaySql(clientInfo, params, "v_b_weixin_evaluation" + tableFlag, "post_date", req);


    var sqlQuery = 'SELECT days,sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') UNION ALL (' + weixinQuery + ') ) tb GROUP BY days'

    sentimentDayExecute(sqlQuery, res);
    //});
};

//获取微博舆情和新闻小时，分钟，秒分布图，添加微信内容
////--New 2014-9-25
exports.GetSentiment = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var timeType = req.params.TimeType;
    var tableFlag = "_customer";
    if (params.query && params.query.brand_name && params.query.brand_name != "") {
        tableFlag = "";
    }
    var weiboQuery = parserSentimentCountSql(clientInfo, params, "v_b_weibo_evaluation" + tableFlag, "created_date", req, timeType),
        newsQuery = parserSentimentCountSql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", req, timeType),
        weixinQuery = parserSentimentCountSql(clientInfo, params, "v_b_weixin_evaluation" + tableFlag, "post_date", req, timeType);

    var sqlQuery = 'SELECT ' + timeType + ',sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') UNION ALL (' + weixinQuery + ') ) tb GROUP BY ' + timeType + '';

    sentimentExecute(sqlQuery, res, timeType)
    //});
};

//获取微博舆情和新闻小时，分钟，秒分布图
exports.GetWeiBoAndNewsSentiment = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var timeType = req.params.TimeType;
    var weiboQuery = parserSentimentCountSql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", req, timeType),
        newsQuery = parserSentimentCountSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", req, timeType);

    var sqlQuery = 'SELECT ' + timeType + ',sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') ) tb GROUP BY ' + timeType + '';

    sentimentExecute(sqlQuery, res, timeType)
    //});
};

//获取微博舆情和新闻每日分布图
exports.GetWeiBoAndNewsSentimentScoreDay = function (req, res) {
    var params = utility.ParamsParse(req.body.params);
    var weiboQuery = parserSentimentScoreDaySql(params, "v_b_weibo_evaluation_customer", "created_date"),
        newsQuery = parserSentimentScoreDaySql(params, "v_b_news_evaluation_customer", "report_date");

    var sqlQuery = 'SELECT score1 as score,sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') ) tb GROUP BY score'

    pool.ExecuteQuery(sqlQuery, function (err, rows) {
        if (err) {

            //console.log(err);
            res.send(500, err);
            return;
        }
        //(sqlQuery);
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
};

//获取微博舆情和新闻每日分布图
//--New 2014-9-25
exports.GetSentimentScoreDay = function (req, res) {
    var params = utility.ParamsParse(req.body.params);
    var weiboQuery = parserSentimentScoreDaySql(params, "v_b_weibo_evaluation_customer", "created_date"),
        newsQuery = parserSentimentScoreDaySql(params, "v_b_news_evaluation_customer", "report_date"),
        weixinQuery = parserSentimentScoreDaySql(params, "v_b_weixin_evaluation_customer", "post_date");

    var sqlQuery = 'SELECT score1 as score,sum(cnt) cnt FROM ((' + weiboQuery + ') UNION ALL (' + newsQuery + ') UNION ALL (' + weixinQuery + ') ) tb GROUP BY score'

    pool.ExecuteQuery(sqlQuery, function (err, rows) {
        if (err) {

            //console.log(err);
            res.send(500, err);
            return;
        }
        //(sqlQuery);
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
};

//获取新闻舆情监听
exports.GetNewsSentimentMonitor = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var sql = 'select news_title,report_date,news_url,score,report_sites as source,summary from v_b_news_evaluation_customer where report_date <= now()';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ? and (classification_name = '政府舆情' or classification_name is null)";
        sqlParams.push(query.field_name);
        sql = sql.replace('v_b_news_evaluation_customer', 'v_b_news_evaluation');
    }
    if (utility.isValidData(query.brand_name)) {
        if (query.brand_name == '海外') {
            sql += " and search_engine = 'bing_news_api_en'";
        }
        sql += " and brand_name = ? and (classification_name = '政府舆情' or classification_name is null)";
        sql = sql.replace('v_b_news_evaluation_customer', 'v_b_news_evaluation');
        sqlParams.push(query.brand_name);
    }
    if (utility.isValidData(query.start_date)) {
        sql += " and report_date >= ?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and report_date <= ?";
        sqlParams.push(query.end_date);
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " order by report_date desc ";
    if (utility.isValidData(query.topn) && !isNaN(query.topn)) {
        sql += " limit ?";
        sqlParams.push(parseInt(query.topn));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(err);
            return;
        }
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
    //});
};

//获取微博舆情监听
exports.GetWeiBoSentimentMonitor = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'select status_text as news_title,created_date as report_date, url as news_url,score,user_name as source, search_engine from v_b_weibo_evaluation_customer where created_date<= now()';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ? and (classification_name = '政府舆情' or classification_name is null)";
        sqlParams.push(query.field_name);
        sql = sql.replace('v_b_weibo_evaluation_customer', 'v_b_weibo_evaluation');
    }
    if (utility.isValidData(query.brand_name)) {
        if (query.brand_name == '海外') {//屏蔽海外标签贴的不准确的bug，目前没有海外微博来源。后期加入海外微博 如Twitter 可以用搜索引擎来判断
            return res.send({success: true, data: []});
        }
        sql += " and brand_name = ? and (classification_name = '政府舆情' or classification_name is null)";
        sqlParams.push(query.brand_name);
        sql = sql.replace('v_b_weibo_evaluation_customer', 'v_b_weibo_evaluation');
    }
    if (utility.isValidData(query.start_date)) {
        sql += " and created_date >= ?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and created_date <= ?";
        sqlParams.push(query.end_date);
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " order by created_date desc ";
    if (utility.isValidData(query.topn) && !isNaN(query.topn)) {
        sql += " limit ?";
        sqlParams.push(parseInt(query.topn));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(err);
            return;
        }
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
//});
};

//获取微博舆情发布
exports.GetWeiBoSentimentPublish = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'select status_text as news_title,created_date as report_date, url as news_url,comments_count,reposts_count from v_b_weibo_evaluation_customer where created_date <= now()';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
//    if (utility.isValidData(query.field_name)) {
//        sql += " and field_name = ?";
//        sqlParams.push(query.field_name);
//    }
//    if (utility.isValidData(query.brand_name)) {
//        sql += " and brand_name = ?";
//        sqlParams.push(query.brand_name)
//    }
    if (utility.isValidData(query.start_date)) {
        sql += " and created_date >= ?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and created_date <= ?";
        sqlParams.push(query.end_date);
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " order by created_date desc ";
    if (utility.isValidData(query.topn) && !isNaN(query.topn)) {
        sql += " limit ?";
        sqlParams.push(parseInt(query.topn));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(err);
            return;
        }
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
    //});
};

//获取微博舆情转发TopN
exports.GetWeiBoHot = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sql = 'select status_text as news_title,created_date as report_date, url as news_url,comments_count,reposts_count,score,user_name as source from v_b_weibo_evaluation_customer where 1 = 1';
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
//    if (utility.isValidData(query.field_name)) {
//        sql += " and field_name = ?";
//        sqlParams.push(query.field_name);
//    }
//    if (utility.isValidData(query.brand_name)) {
//        sql += " and brand_name = ?";
//        sqlParams.push(query.brand_name)
//    }
    if (utility.isValidData(query.start_date)) {
        sql += " and created_date >= ?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        sql += " and created_date <= ?";
        sqlParams.push(query.end_date);
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " order by reposts_count desc ";
    if (utility.isValidData(query.topn) && !isNaN(query.topn)) {
        sql += " limit ?";
        sqlParams.push(parseInt(query.topn));
    }
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(err);
            return;
        }
        var result = {
            success: true,
            data: rows
        };
        res.send(result);
    });
    //});
};

//获取微信列表
exports.GetWeiXinList = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = 'select * from v_b_weixin_evaluation_customer where post_date <= now()';
    var currentToken = null;
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name = ?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and post_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and post_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.article_title)) {
        sql += " and article_title like '%\\" + query.article_title + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }

    async.parallel([function (callback) {
       pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            if (err) {
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, result);
        });
    }],function (err, results) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        if (results.length > 0) {
                var data = {
                    success: true,
                    totalcount: results[1][0].count,
                    rows: results[0]
                };
            res.send(data);
        }
    });

    //pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
    //    if (err) {
    //        //console.error(err);
    //        res.send(utility.jsonResult(err));
    //        return;
    //    }
    //    var data = {
    //        success: true,
    //        totalcount: 0,
    //        rows: rows
    //    };
    //    //if(rows.length>0)
    //    pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
    //        //console.log('查询到微信总行数：' + result[0].count);
    //        if (err) {
    //            res.send(utility.jsonResult(err));
    //        }
    //        else {
    //            data.totalcount = result[0].count;
    //            res.send(data);
    //        }
    //    });
    //});
    //});
};
//获取微信列表
exports.GetWeiXinListByBrand = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    var sql = 'select * from b_weixin_evaluation where 1 = 1';
    var currentToken = null;
    if (clientInfo != null && clientInfo != false) {
        //sql += " and customer_name = ?";
        //sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.start_date)) {
        var localTime = moment(query.start_date).format();
        sql += " and post_date >= ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        sql += " and post_date < ?";
        sqlParams.push(localTime);
    }
    if (utility.isValidData(query.article_title)) {
        sql += " and article_title like '%\\" + query.article_title + "%'";
    }
    if (utility.isValidData(query.status)) {
        sql += " and status = ?";
        sqlParams.push(query.status);
    }
    if (utility.isValidData(query.is_sensitive)) {
        sql += " and is_sensitive = ?";
        sqlParams.push(query.is_sensitive);
    }
    if (utility.isValidData(query.level)) {//预警等级
        if (query.level == '1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount == 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    if (pagination.pagesize != undefined && pagination.pageindex != undefined && !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
        sql += " limit ?,?";
        sqlParams.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
        sqlParams.push(parseInt(pagination.pagesize));
    }
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        var data = {
            success: true,
            totalcount: 0,
            rows: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, result) {
            //console.log('查询到微信总行数：' + result[0].count);
            if (err) {
                res.send(utility.jsonResult(err));
            }
            else {
                data.totalcount = result[0].count;
                res.send(data);
            }
        });
    });
    //});
};

//编辑微信
exports.EditWeiXinByID = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    if (!utility.isValidData(query.b_id)) {
        res.send(utility.jsonResult('缺少必须参数微信ID'));
        return;
    }
    var checkIsExistsSql = "select count(0) as counts,IFNULL(status,0) as status from b_weixin_evaluation_handle where b_id = " + query.b_id;
    pool.ExecuteQueryNoCache(checkIsExistsSql, function (err, result) {
        if (err) {
            res.send(utility.jsonResult(err));
        }
        else {
            if (result[0].counts > 0) {//已经存在，则修改
                if (result[0].status && utility.isValidData(query.status)) {
                    return  res.send(utility.jsonResult("此微信已经处理过"));
                }
                var sql = 'update b_weixin_evaluation_handle set updated_date= now()';
                var sqlParams = [];
                if (utility.isValidData(query.status)) {
                    sql += " ,status = ?";
                    sqlParams.push(query.status);
                    if (clientInfo != null && clientInfo != false) {
                        sql += " ,handle_user = ?";
                        sqlParams.push(clientInfo.UserID);
                        sql += " ,handle_date = now()";
                    }
                }
                if (query.is_sensitive != undefined) {
                    sql += " ,is_sensitive = ?";
                    sqlParams.push(query.is_sensitive);
                }
                if (query.handle_id != undefined) {
                    sql += " ,handle_id = ?";
                    sqlParams.push(query.handle_id);
                }
                if (query.handle_type != undefined) {
                    sql += " ,handle_type = ?";
                    sqlParams.push(query.handle_type);
                }
                if (query.handle_remark != undefined) {
                    sql += " ,handle_remark = ?";
                    sqlParams.push(query.handle_remark);
                }
                if (clientInfo != null && clientInfo != false) {
                    sql += " ,updated_by = ?";
                    sqlParams.push(clientInfo.UserID);
                }
                sql += " where b_id = ?";
                if (query.status) {
                    sql += " and IFNULL(STATUS,0)!=1";
                }
                sqlParams.push(query.b_id);
                pool.ExecuteQuery(sql, sqlParams, function (err, result) {
                    if (err) {
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_weixin_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败'));
                        }

                    }
                });
            }
            else {//不存在记录，则插入新数据
                var insertSql = "insert into `b_weixin_evaluation_handle`(`b_id`,`STATUS`,`is_sensitive`,`updated_by`,`updated_date`,`handle_id`,`handle_type`,`handle_remark`,`handle_date`,`handle_user`,tenant_id)";
                insertSql += "values (?,?,?,?,?,?,?,?,?,?,?)";
                var obj = new Handler();
                obj.b_id = query.b_id;
                obj.status = query.status || 0;
                obj.is_sensitive = query.is_sensitive || 0;
                obj.updated_by = clientInfo.UserID;
                obj.updated_date = new Date();
                obj.handle_id = query.handle_id;
                obj.handle_type = query.handle_type;
                obj.handle_remark = query.handle_remark;
                obj.handle_date = new Date();
                obj.handle_user = clientInfo.UserID;
                obj.tenant_id = clientInfo.TenantID;
                var insertSqlParams = [obj.b_id, obj.status, obj.is_sensitive, obj.updated_by, obj.updated_date, obj.handle_id, obj.handle_type, obj.handle_remark, obj.handle_date, obj.handle_user, obj.tenant_id];
                pool.ExecuteQuery(insertSql, insertSqlParams, function (err, result) {
                    if (err) {
                        res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            redisHelper.cleanKey("v_b_weixin_evaluation_customer");
                            res.send(utility.jsonResult(null, '修改成功'));
                        }
                        else {
                            res.send(utility.jsonResult('修改失败'));
                        }

                    }
                });
            }
        }
    });
    //});
};

/*
 * 舆情结果汇总，添加微信内容
 * 2014-09-25
 */
exports.GetSentimentReport = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
//    redisHelper.cleanKey("v_b_news_evaluation_customer");
//    redisHelper.cleanKey("v_b_news_evaluation");
//
//    redisHelper.cleanKey("v_b_weibo_evaluation_customer");
//    redisHelper.cleanKey("v_b_weibo_evaluation");
//
//    redisHelper.cleanKey("v_b_weixin_evaluation_customer");
//    redisHelper.cleanKey("v_b_weixin_evaluation_evaluation");

    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var tableFlag = "_customer";
    if (params.query && params.query.brand_name && params.query.brand_name != "") {
        tableFlag = "";
    }
    var weiboQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation" + tableFlag, "created_date", "COUNT(1)", "", "", req, []),
        newsQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", "COUNT(1)", "", "", req, [], " and search_engine<>'bing_news_api_en' "),
        newsEnQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", "COUNT(1)", "", "", req, [], " and search_engine='bing_news_api_en' "),
        weixinQuery = parserSentimentReportSql(clientInfo, params, "v_b_weixin_evaluation" + tableFlag, "post_date", "COUNT(1)", "", "", req, []);

    var countQuery = "SELECT (" + newsQuery + ") AS count_news,(" + weiboQuery + ") AS count_weibo,(" + newsEnQuery + ") AS count_newsen, (" + weixinQuery + ") AS  count_weixin";

    var scoreQuery = "SELECT (" + weiboQuery + " AND score>" + BasicSettings.positiveValue + ")+(" + newsQuery + "  AND score>" + BasicSettings.positiveValue + ")+(" + weixinQuery + " AND score>" + BasicSettings.positiveValue + ") AS POSCount,(" + weiboQuery + " AND score<" + BasicSettings.negativeValue + ")+(" + newsQuery + " AND score<" + BasicSettings.negativeValue + ")+(" + weixinQuery + " AND score<" + BasicSettings.negativeValue + ") AS NegCount";

    var scoreFiled = "sourcetype,report_sites,totalScore, reportCount, url",
        scoreFiledXinWen = "'新闻' AS sourcetype, report_sites, SUM(negative_count) AS totalScore,SUM(1) reportCount,  MIN(news_url) AS url",
        scoreFiledWeiBo = "'微博' AS sourcetype, user_name AS report_sites, SUM(negative_count) AS totalScore,SUM(1) reportCount,  MIN(url) AS url",
        scoreFiledWeiXin = "'微信' AS sourcetype, post_user AS report_sites, SUM(negative_count) AS totalScore,SUM(1) reportCount,  MIN(article_url) AS url",
        scoreGroupOrder = " GROUP BY report_sites ORDER BY totalScore DESC LIMIT 10 ",
        scoreCondition = " AND score<" + BasicSettings.negativeValue;
    var weiboScoreQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation" + tableFlag, "created_date", scoreFiledWeiBo, scoreCondition, scoreGroupOrder, req, ["user_name"]),
        newsScoreQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", scoreFiledXinWen, scoreCondition, scoreGroupOrder, req, ["report_sites"]),
        weixinScoreQuery = parserSentimentReportSql(clientInfo, params, "v_b_weixin_evaluation" + tableFlag, "post_date", scoreFiledWeiXin, scoreCondition, scoreGroupOrder, req, ["post_user"]);

    var mediaQuery = "SELECT " + scoreFiled + " FROM (" + newsScoreQuery + ") a UNION ALL SELECT " + scoreFiled + " FROM (" + weiboScoreQuery + ") a UNION ALL SELECT " + scoreFiled + " FROM (" + weixinScoreQuery + ") a";

    var sensitiveField = "sourcetype,report_date,report_sites,title, content, url",
        sensitiveFieldXinWen = "'新闻' AS sourcetype,report_date, report_sites,news_title AS title,summary AS content,news_url AS url",
        sensitiveFieldWeiBo = "'微博' AS sourcetype, created_date AS report_date,user_name AS report_sites, '' AS title,status_text AS content ,url",
        sensitiveFieldWeiXin = "'微信' AS sourcetype, post_date AS report_date,post_user AS report_sites, article_title AS title,content AS content ,article_url AS url",
        sensitiveCondition = " AND is_sensitive = 1 ",
        sensitiveGroupOrderWb = " ORDER BY created_date DESC LIMIT 50 ",
        sensitiveGroupOrderNew = " ORDER BY report_date DESC LIMIT 50 ",
        sensitiveGroupOrderWx = " ORDER BY post_date DESC LIMIT 50 ";

    var weiboSensitiveQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation" + tableFlag, "created_date", sensitiveFieldWeiBo, sensitiveCondition, sensitiveGroupOrderWb, req, []),
        newsSensitiveQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation" + tableFlag, "report_date", sensitiveFieldXinWen, sensitiveCondition, sensitiveGroupOrderNew, req, []),
        weixinSensitiveQuery = parserSentimentReportSql(clientInfo, params, "v_b_weixin_evaluation" + tableFlag, "post_date", sensitiveFieldWeiXin, sensitiveCondition, sensitiveGroupOrderWx, req, []);

    var sensitiveQuery = "SELECT " + sensitiveField + " FROM (" + newsSensitiveQuery + ") a UNION ALL SELECT " + sensitiveField + " FROM (" + weiboSensitiveQuery + ") a UNION ALL SELECT " + sensitiveField + " FROM (" + weixinSensitiveQuery + ") a";

    async.series({
            count: function (cb) {
                pool.ExecuteQuery(countQuery, cb);
            },
            score: function (cb) {
                pool.ExecuteQuery(scoreQuery, cb);
            },
            media: function (cb) {
                pool.ExecuteQuery(mediaQuery, cb);
            },
            sensitive: function (cb) {
                pool.ExecuteQuery(sensitiveQuery, cb);
            }
        },
        function (err, result) {
            var resultObj = utility.jsonResult(err, {count: result.count, score: result.score, media: result.media, sensitive: result.sensitive});
            res.json(resultObj);
        }
    );
    //});
};
//新闻，海外，微博，微信，数量
exports.GetSentimentReportByCategory = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var tableFlag = "_customer";
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    if (utility.isValidData(query.brand_name)) {
        tableFlag = ""
    }
    var newsQuery = "SELECT COUNT(*) FROM v_b_news_evaluation" + tableFlag + " where 1=1 and search_engine<>'bing_news_api_en'";//新闻
    var newsEnQuery = "SELECT COUNT(*) FROM v_b_news_evaluation" + tableFlag + " where 1=1 and search_engine='bing_news_api_en'";//海外
    var weiboQuery = "SELECT COUNT(*) FROM v_b_weibo_evaluation" + tableFlag + " where 1=1";//微博
    var weixinQuery = "SELECT COUNT(*) FROM v_b_weixin_evaluation" + tableFlag + " where 1=1";//微信

    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date>='"+query.start_date+"'";
        newsEnQuery += " and report_date>='"+query.start_date+"'";
        weiboQuery += " and created_date>='"+query.start_date+"'";
        weixinQuery += " and post_date >='"+query.start_date+"'";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        newsQuery += " and report_date<='"+Time+"'";
        newsEnQuery += " and report_date<='"+Time+"'";
        weiboQuery += " and created_date<='"+Time+"'";
        weixinQuery += " and post_date<='"+Time+"'";
        sqlParams.push(Time);
    }
    if (utility.isValidData(query.brand_name)) {
        newsQuery += " and brand_name='" + query.brand_name + "'";
        newsEnQuery += " and brand_name='" + query.brand_name + "'";
        weiboQuery += " and brand_name='" + query.brand_name + "'";
        weixinQuery += " and brand_name='" + query.brand_name + "'";
        sqlParams.push(query.brand_name);
    } else {
        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name='" + clientInfo.CustomName + "'";
            newsEnQuery += " and customer_name='" + clientInfo.CustomName + "'";
            weiboQuery += " and customer_name='" + clientInfo.CustomName + "'";
            weixinQuery += " and customer_name='" + clientInfo.CustomName + "'";
            sqlParams.push(clientInfo.CustomName);
        }
    }

    var countQuery = "SELECT (" + newsQuery + ")as count_news,(" + newsEnQuery + ")as count_newsen,(" + weiboQuery + ")as count_weibo,(" + weixinQuery + ") as count_weixin";
    pool.ExecuteQuery(countQuery, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        res.send(utility.jsonResult(null, rows));
    });
};
//统计正面，负面，中性数量
exports.GetSentimentReportBySide = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var tableFlag = "_customer";
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    if (utility.isValidData(query.brand_name)) {
        tableFlag = ""
    }
    var newsQuery = "SELECT COUNT(*) FROM v_b_news_evaluation" + tableFlag + " where 1=1";//新闻
    var weiboQuery = "SELECT COUNT(*) FROM v_b_weibo_evaluation" + tableFlag + " where 1=1";//微博
    var weixinQuery = "SELECT COUNT(*) FROM v_b_weixin_evaluation" + tableFlag + " where 1=1";//微信

    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date>='"+query.start_date+"'";
        weiboQuery += " and created_date>='"+query.start_date+"'";
        weixinQuery += " and post_date>='"+query.start_date+"'";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        newsQuery += " and report_date<='"+Time+"'";
        weiboQuery += " and created_date<='"+Time+"'";
        weixinQuery += " and post_date<='"+Time+"'";
        sqlParams.push(Time);
    }
    if (utility.isValidData(query.brand_name)) {
        newsQuery += " and brand_name='" + query.brand_name + "'";
        weiboQuery += " and brand_name='" + query.brand_name + "'";
        weixinQuery += " and brand_name='" + query.brand_name + "'";
        sqlParams.push(query.brand_name);
    } else {
        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name='" + clientInfo.CustomName + "'";
            weiboQuery += " and customer_name='" + clientInfo.CustomName + "'";
            weixinQuery += " and customer_name='" + clientInfo.CustomName + "'";
            sqlParams.push(clientInfo.CustomName);
        }
    }

    var countQuery = "SELECT (" + newsQuery + ")+(" + weiboQuery + ")+(" + weixinQuery + ") as sumCount,(" + newsQuery + " and score>" + BasicSettings.positiveValue + ")+(" + weiboQuery + " and score>" + BasicSettings.positiveValue + ")+(" + weixinQuery + " and score>" + BasicSettings.positiveValue + ")as POSCount,(" + newsQuery + " and score<" + BasicSettings.negativeValue + ")+(" + weiboQuery + " and score<" + BasicSettings.negativeValue + ")+(" + weixinQuery + " and score<" + BasicSettings.negativeValue + ")as NegCount";
    pool.ExecuteQuery(countQuery, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        res.send(utility.jsonResult(null, rows));
    });
};
//统计报道来源
exports.GetSentimentReportBySource = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var condition = '[]';
    var returnResult = [];
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    var newsQuery = "SELECT '新闻' AS sourcetype,report_sites,SUM(negative_count) AS totalScore,COUNT(report_sites)reportCount,MIN(news_url) AS url FROM v_b_news_evaluation_customer WHERE 1 = 1";
    var weiBoQuery = "SELECT '微博' AS sourcetype,user_name as report_sites,SUM(negative_count) AS totalScore,COUNT(source)reportCount,MIN(url) AS url FROM v_b_weibo_evaluation_customer WHERE 1 = 1";
    var weiXinQuery = "SELECT '微信' AS sourcetype,post_user as report_sites,SUM(negative_count) AS totalScore,COUNT(post_user)reportCount,MIN(article_url) AS url FROM v_b_weixin_evaluation_customer WHERE 1 = 1";
    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date >=?";
        weiBoQuery += " and created_date >=?";
        weiXinQuery += " and post_date >=?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        newsQuery += " and report_date <=?"
        weiBoQuery += " and created_date <=?";
        weiXinQuery += " and post_date <=?";
        sqlParams.push(Time);
    }
    if (clientInfo && clientInfo.CustomName) {
        newsQuery += " and customer_name='" + clientInfo.CustomName + "'";
        weiBoQuery += " and customer_name='" + clientInfo.CustomName + "'";
        weiXinQuery += " and customer_name='" + clientInfo.CustomName + "'";
        sqlParams.push(clientInfo.CustomName);
    }
    if (BasicSettings.negativeValue) {
        newsQuery += " and score<" + BasicSettings.negativeValue;
        weiBoQuery += " and score<" + BasicSettings.negativeValue;
        weiXinQuery += " and score<" + BasicSettings.negativeValue;
        sqlParams.push(BasicSettings.negativeValue);
    }
    newsQuery += " and report_sites <>'" + condition + "' GROUP BY report_sites limit 10";
    weiBoQuery += " and user_name <>'" + condition + "' GROUP BY source limit 10";
    weiXinQuery += " and post_user <>'" + condition + "' GROUP BY post_user limit 10";
    async.parallel([function (callback) {
        pool.ExecuteQuery(newsQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(weiBoQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(weiXinQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }], function (err, results) {
        if (err) {
            //console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                for (var j = 0; j < results[i].length; j++) {
                    returnResult.push(results[i][j]);
                }

            }
        }
        res.send(utility.jsonResult(null, returnResult));
    });
}
//统计敏感报道
exports.GetSentimentReportBySensitive = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var sensitive = 1;//铭感
    var returnResult = [];
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    var newsQuery = "SELECT '新闻' AS sourcetype,report_date, report_sites,news_title AS title,summary AS content,news_url AS url FROM v_b_news_evaluation_customer WHERE 1 = 1";
    var weiBoQuery = "SELECT '微博' AS sourcetype, created_date AS report_date,user_name AS report_sites, '' AS title,status_text AS content ,url FROM v_b_weibo_evaluation_customer WHERE 1 = 1";
    var weiXinQuery = "SELECT '微信' AS sourcetype, post_date AS report_date,post_user AS report_sites, article_title AS title,content AS content ,article_url AS url FROM v_b_weixin_evaluation_customer WHERE 1 = 1";
    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date>=?"
        weiBoQuery += " and created_date>=?";
        weiXinQuery += " and post_date>=?";
        sqlParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        var Time = moment(query.end_date).add(1, 'days').format();
        newsQuery += " and report_date <=?"
        weiBoQuery += " and created_date <=?";
        weiXinQuery += " and post_date <= ?";
        sqlParams.push(Time);
    }
    if (clientInfo && clientInfo.CustomName) {
        newsQuery += " and customer_name='" + clientInfo.CustomName + "'";
        weiBoQuery += " and customer_name='" + clientInfo.CustomName + "'";
        weiXinQuery += " and customer_name='" + clientInfo.CustomName + "'";
        sqlParams.push(clientInfo.CustomName);
    }
    newsQuery += " and is_sensitive=" + sensitive + " ORDER BY report_date DESC LIMIT 10";
    weiBoQuery += " and is_sensitive=" + sensitive + " ORDER BY created_date DESC LIMIT 10";
    weiXinQuery += " and is_sensitive=" + sensitive + " ORDER BY post_date DESC LIMIT 10";
    async.parallel([function (callback) {
        pool.ExecuteQuery(newsQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(weiBoQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }, function (callback) {
        pool.ExecuteQuery(weiXinQuery, sqlParams, function (err, rows) {
            if (err) {
                //console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null, rows);
        });
    }], function (err, results) {
        if (err) {
            //console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                for (var j = 0; j < results[i].length; j++) {
                    returnResult.push(results[i][j]);
                }
            }
        }
        res.send(utility.jsonResult(null, returnResult));
    });
};
/*
 * 舆情当日报表
 * */
exports.GetSentimentDailyReport2 = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var sqlPosParams=[];
    var sqlNegParams=[];
    var tableFlag = "_customer";
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    if (utility.isValidData(query.brand_name)) {
        tableFlag = ""
    }
    var newsQuery = "SELECT COUNT(*)sumcount FROM v_b_news_evaluation" + tableFlag + " where 1=1";//新闻
    var weiboQuery = "SELECT COUNT(*)sumcount FROM v_b_weibo_evaluation" + tableFlag + " where 1=1";//微博
    var weixinQuery = "SELECT COUNT(*)sumcount FROM v_b_weixin_evaluation" + tableFlag + " where 1=1";//微信
    var newsposQuery="";
    var weiboposQuery="";
    var weixinposQuery="";
    var newsnegQuery="";
    var weibonegQuery="";
    var weixinnegQuery="";
    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        weiboQuery += " and created_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        weixinQuery += " and post_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        sqlParams.push(query.start_date);
        sqlPosParams.push(query.start_date);
        sqlNegParams.push(query.start_date);
    }
    if (utility.isValidData(query.end_date)) {
        var localTime = moment(query.end_date).add(1, 'days').format();
        newsQuery += " and report_date<=DATE_FORMAT(?,'%Y-%m-%d')";
        weiboQuery += " and created_date<=DATE_FORMAT(?,'%Y-%m-%d')";
        weixinQuery += " and post_date<=DATE_FORMAT(?,'%Y-%m-%d')";
        sqlParams.push(localTime);
        sqlPosParams.push(localTime);
        sqlNegParams.push(localTime);
    }
    if (utility.isValidData(query.brand_name)) {
        newsQuery += " and brand_name=?";
        weiboQuery += " and brand_name=?";
        weixinQuery += " and brand_name=?";
        sqlParams.push(query.brand_name);
        sqlPosParams.push(query.brand_name);
        sqlNegParams.push(query.brand_name);
        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name=?";
            weiboQuery += " and customer_name=?";
            weixinQuery += " and customer_name=?";
            sqlParams.push(clientInfo.CustomName);
            sqlPosParams.push(clientInfo.CustomName);
            sqlNegParams.push(clientInfo.CustomName);
        }
    } else {
        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name=?";
            weiboQuery += " and customer_name=?";
            weixinQuery += " and customer_name=?";
            sqlParams.push(clientInfo.CustomName);
            sqlPosParams.push(clientInfo.CustomName);
            sqlNegParams.push(clientInfo.CustomName);
        }
    }
    sqlPosParams.push(BasicSettings.positiveValue);
    sqlNegParams.push(BasicSettings.negativeValue);
    newsposQuery=newsQuery+" and score>?";
    weiboposQuery=weiboQuery+" and score>?";
    weixinposQuery=weixinQuery+" and score>?";
    newsnegQuery=newsQuery+" and score<?";
    weibonegQuery=weiboQuery+" and score<?";
    weixinnegQuery=weixinQuery+" and score<?";
    //var countQuery = "SELECT (" + newsQuery + ")+(" + weiboQuery + ")+(" + weixinQuery + ") as sumCount,(" + newsQuery + " and score>" + BasicSettings.positiveValue + ")+(" + weiboQuery + " and score>" + BasicSettings.positiveValue + ")+(" + weixinQuery + " and score>" + BasicSettings.positiveValue + ")as POSCount,(" + newsQuery + " and score<" + BasicSettings.negativeValue + ")+(" + weiboQuery + " and score<" + BasicSettings.negativeValue + ")+(" + weixinQuery + " and score<" + BasicSettings.negativeValue + ")as NegCount";
    async.parallel({newsCount:function(callback){
        pool.ExecuteQuery(newsQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
           callback(null,rows);
        });
    },weiboCount:function(callback){
        pool.ExecuteQuery(weiboQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weixinCount:function(callback){
        pool.ExecuteQuery(weixinQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },newsposCount:function(callback){
        pool.ExecuteQuery(newsposQuery,sqlPosParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weiboposCount:function(callback){
        pool.ExecuteQuery(weiboposQuery,sqlPosParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weixinposCount:function(callback){
        pool.ExecuteQuery(weixinposQuery,sqlPosParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },newsnegCount:function(callback){
        pool.ExecuteQuery(newsnegQuery,sqlNegParams, function (err, rows) {
            if (err) {
               console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weibonegCount:function(callback){
        pool.ExecuteQuery(weibonegQuery,sqlNegParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weixinnegCount:function(callback){
        pool.ExecuteQuery(weixinnegQuery,sqlNegParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    }},function(err,result){
        var returnResult=[{sumCount:0,POSCount:0,NegCount:0}];
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        if(result){
         var newsCount=result.newsCount[0].sumcount||0;
         var weiboCount=result.weiboCount[0].sumcount||0;
         var weixinCount=result.weixinCount[0].sumcount||0;
            returnResult[0].sumCount=parseInt(newsCount)+parseInt(weiboCount)+parseInt(weixinCount);
         var newsposCount=result.newsposCount[0].sumcount||0;
         var weiboposCount=result.weiboposCount[0].sumcount||0;
         var weixinposCount=result.weixinposCount[0].sumcount||0;
            returnResult[0].POSCount=parseInt(newsposCount)+parseInt(weiboposCount)+parseInt(weixinposCount);
         var newsnegCount=result.newsnegCount[0].sumcount||0;
         var weibonegCount=result.weibonegCount[0].sumcount||0;
         var weixinnegCount=result.weixinnegCount[0].sumcount||0;
            returnResult[0].NegCount=parseInt(newsnegCount)+parseInt(weibonegCount)+parseInt(weixinnegCount);
        }
        return res.send(utility.jsonResult(null,returnResult));
    });
//    pool.ExecuteQuery(countQuery, sqlParams, function (err, rows) {
//        if (err) {
//            //console.error(err);
//            res.send(utility.jsonResult(err));
//            return;
//        }
//        res.send(utility.jsonResult(null, rows));
//    });
}
exports.GetSentimentDailyReport=function(req,res){
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //查询参数
    var sqlParams = [];
    var tableFlag = "_customer";
    if (!utility.isValidData(params)) {
        res.send('缺少必须参数');
        return;
    }
    if (utility.isValidData(query.brand_name)) {
        tableFlag = ""
    }
    var newsQuery = "SELECT SUM(CASE WHEN score>3 THEN 1 END)poscount,SUM(CASE WHEN score<-3 THEN 1 END)negcount,SUM(1)sumcount FROM v_b_news_evaluation" + tableFlag + " where 1=1";//新闻
    var weiboQuery = "SELECT SUM(CASE WHEN score>3 THEN 1 END)poscount,SUM(CASE WHEN score<-3 THEN 1 END)negcount,SUM(1)sumcount FROM v_b_weibo_evaluation" + tableFlag + " where 1=1";//微博
    var weixinQuery = "SELECT SUM(CASE WHEN score>3 THEN 1 END)poscount,SUM(CASE WHEN score<-3 THEN 1 END)negcount,SUM(1)sumcount FROM v_b_weixin_evaluation" + tableFlag + " where 1=1";//微信
    if (utility.isValidData(query.start_date)) {
        newsQuery += " and report_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        weiboQuery += " and created_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        weixinQuery += " and post_date>=DATE_FORMAT(?,'%Y-%m-%d')";
        sqlParams.push(query.start_date);
    }
//    if (utility.isValidData(query.end_date)) {
//        var localTime = moment(query.end_date).add(1, 'days').format();
//        newsQuery += " and report_date<=DATE_FORMAT(?,'%Y-%m-%d')";
//        weiboQuery += " and created_date<=DATE_FORMAT(?,'%Y-%m-%d')";
//        weixinQuery += " and post_date<=DATE_FORMAT(?,'%Y-%m-%d')";
//        sqlParams.push(localTime);
//    }
    if (utility.isValidData(query.brand_name)) {
        newsQuery += " and brand_name=?";
        weiboQuery += " and brand_name=?";
        weixinQuery += " and brand_name=?";
        sqlParams.push(query.brand_name);

        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name=?";
            weiboQuery += " and customer_name=?";
            weixinQuery += " and customer_name=?";
            sqlParams.push(clientInfo.CustomName);
        }
    } else {
        if (clientInfo && clientInfo.CustomName) {
            newsQuery += " and customer_name=?";
            weiboQuery += " and customer_name=?";
            weixinQuery += " and customer_name=?";
            sqlParams.push(clientInfo.CustomName);
        }
    }
    async.parallel({news:function(callback){
        pool.ExecuteQuery(newsQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weibo:function(callback){
        pool.ExecuteQuery(weiboQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    },weixin:function(callback){
        pool.ExecuteQuery(weixinQuery,sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            callback(null,rows);
        });
    }},function(err,result){
        var returnResult=[{sumCount:0,POSCount:0,NegCount:0}];
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        if(result){
            var newsCount=result.news[0].sumcount||0;
            var weiboCount=result.weibo[0].sumcount||0;
            var weixinCount=result.weixin[0].sumcount||0;
            var newsPosCount=result.news[0].poscount||0;
            var weiboPosCount=result.weibo[0].poscount||0;
            var weixinPosCount=result.weixin[0].poscount||0;
            var newsNegCount=result.news[0].negcount||0;
            var weiboNegCount=result.weibo[0].negcount||0;
            var weixinNegCount=result.weixin[0].negcount||0;


            returnResult[0].POSCount=parseInt(newsPosCount)+parseInt(weiboPosCount)+parseInt(weixinPosCount);

            returnResult[0].NegCount=parseInt(newsNegCount)+parseInt(weiboNegCount)+parseInt(weixinNegCount);
            returnResult[0].sumCount=parseInt(newsCount)+parseInt(weiboCount)+parseInt(weixinCount);
        }
        return res.send(utility.jsonResult(null,returnResult));
    });
}
/*
 * 舆情结果汇总
 */
exports.GetWeiBoAndNewsSentimentReport = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var weiboQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", "COUNT(1)", "", "", req, []),
        newsQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", "COUNT(1)", "", "", req, [], " and search_engine<>'bing_news_api_en' "),
        newsEnQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", "COUNT(1)", "", "", req, [], " and search_engine='bing_news_api_en' ");

    var countQuery = "SELECT (" + newsQuery + ") AS count_news,(" + weiboQuery + ") AS count_weibo,(" + newsEnQuery + ") AS count_newsen";

    var scoreQuery = "SELECT (" + weiboQuery + " AND score>" + BasicSettings.positiveValue + ")+(" + newsQuery + "  AND score>" + BasicSettings.positiveValue + ") AS POSCount,(" + weiboQuery + " AND score<" + BasicSettings.negativeValue + ")+(" + newsQuery + " AND score<" + BasicSettings.negativeValue + ") AS NegCount";

    var scoreFiled = "sourcetype,report_sites,totalScore, reportCount, url",
        scoreFiledXW = "'新闻' AS sourcetype, report_sites, SUM(negative_count) AS totalScore,SUM(1) reportCount,  MIN(news_url) AS url",
        scoreFiledWB = "'微博' AS sourcetype, user_name AS report_sites, SUM(negative_count) AS totalScore,SUM(1) reportCount,  MIN(url) AS url",
        scoreGroupOrder = " GROUP BY report_sites ORDER BY totalScore DESC LIMIT 10 ",
        scoreCondition = " AND score<" + BasicSettings.negativeValue;
    var weiboScoreQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", scoreFiledWB, scoreCondition, scoreGroupOrder, req, ["user_name"]),
        newsScoreQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", scoreFiledXW, scoreCondition, scoreGroupOrder, req, ["report_sites"]);

    var mediaQuery = "SELECT " + scoreFiled + " FROM (" + newsScoreQuery + ") a UNION ALL SELECT " + scoreFiled + " FROM (" + weiboScoreQuery + ") a";

    var sensitiveField = "sourcetype,report_date,report_sites,title, content, url",
        sensitiveFieldXW = "'新闻' AS sourcetype,report_date, report_sites,news_title AS title,summary AS content,news_url AS url",
        sensitiveFieldWB = "'微博' AS sourcetype, created_date AS report_date,user_name AS report_sites, '' AS title,status_text AS content ,url",
        sensitiveCondition = " AND is_sensitive = 1 ",
        sensitiveGroupOrderWb = " ORDER BY created_date DESC LIMIT 50 ",
        sensitiveGroupOrderNew = " ORDER BY report_date DESC LIMIT 50 ";

    var weiboSensitiveQuery = parserSentimentReportSql(clientInfo, params, "v_b_weibo_evaluation_customer", "created_date", sensitiveFieldWB, sensitiveCondition, sensitiveGroupOrderWb, req, []),
        newsSensitiveQuery = parserSentimentReportSql(clientInfo, params, "v_b_news_evaluation_customer", "report_date", sensitiveFieldXW, sensitiveCondition, sensitiveGroupOrderNew, req, []);

    var sensitiveQuery = "SELECT " + sensitiveField + " FROM (" + newsSensitiveQuery + ") a UNION ALL SELECT " + sensitiveField + " FROM (" + weiboSensitiveQuery + ") a";

    async.series({
            count: function (cb) {
                pool.ExecuteQuery(countQuery, cb);
            },
            score: function (cb) {
                pool.ExecuteQuery(scoreQuery, cb);
            },
            media: function (cb) {
                pool.ExecuteQuery(mediaQuery, cb);
            },
            sensitive: function (cb) {
                pool.ExecuteQuery(sensitiveQuery, cb);
            }
        },
        function (err, result) {
            var resultObj = utility.jsonResult(err, {count: result.count, score: result.score, media: result.media, sensitive: result.sensitive});
            res.json(resultObj);
        }
    );
    //});
};
//修改新闻，微博，微信极性
exports.EditNews = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_news_evaluation set last_modified=now()';
    var sqlParams = [];
    if (utility.isValidData(query.id)) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (utility.isValidData(query.title)) {
        sql += " ,news_title = ?";
        sqlParams.push(query.title);
    }
    if (utility.isValidData(query.url)) {
        sql += " ,news_url = ?";
        sqlParams.push(query.url);
    }
    if (utility.isValidData(query.score)) {
        sql += " ,score = ?";
        sqlParams.push(query.score);
    }
    sql += " where b_id = ?";
    sqlParams.push(query.id);
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("v_b_news_evaluation");
                redisHelper.cleanKey("v_b_news_evaluation_customer");
                res.send(utility.jsonResult(null, '修改成功！'));
            }
            else {
                res.send(utility.jsonResult('修改失败！'));
            }
        }
    });
};
exports.EditWeiBo = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weibo_evaluation set last_modified=now()';
    var sqlParams = [];
    if (utility.isValidData(query.id)) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (utility.isValidData(query.url)) {
        sql += " ,url = ?";
        sqlParams.push(query.url);
    }
    if (utility.isValidData(query.title)) {
        sql += " ,status_text = ?";
        sqlParams.push(query.title);
    }
    if (utility.isValidData(query.score)) {
        sql += " ,score = ?";
        sqlParams.push(query.score);
    }
    sql += " where b_id = ?";
    sqlParams.push(query.id);
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("v_b_weibo_evaluation");
                redisHelper.cleanKey("v_b_weibo_evaluation_customer");
                res.send(utility.jsonResult(null, '修改成功！'));
            }
            else {
                res.send(utility.jsonResult('修改失败！'));
            }
        }
    });
};
exports.EditWeiXin = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weixin_evaluation set last_modified=now()';
    var sqlParams = [];
    if (utility.isValidData(query.id)) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (utility.isValidData(query.title)) {
        sql += " ,article_title = ?";
        sqlParams.push(query.title);
    }
    if (utility.isValidData(query.url)) {
        sql += " ,article_url = ?";
        sqlParams.push(query.url);
    }
    if (utility.isValidData(query.score)) {
        sql += " ,score = ?";
        sqlParams.push(query.score);
    }
    sql += " where b_id = ?";
    sqlParams.push(query.id);
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("v_b_weixin_evaluation");
                redisHelper.cleanKey("v_b_weixin_evaluation_customer");
                res.send(utility.jsonResult(null, '修改成功！'));
            }
            else {
                res.send(utility.jsonResult('修改失败！'));
            }
        }
    });
};
//批量删除新闻，微博，微信
exports.DeleteNews = function (req, res) {//{params:{query:{ids:[1,2,3,4]}}}
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_news_evaluation set last_modified=now()';
    if (utility.isValidData(query.ids) && typeof query.ids == "Array") {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (query.ids && query.ids.length > 0) {
        var ids = "";
        for (var i = 0; i < query.ids.length; i++) {
            if (ids == "") {

                ids += query.ids[i];
            } else {
                ids += "," + query.ids[i];
            }
        }
        sql += " ,is_deleted=1 where b_id in(" + ids + ")";
    }
    pool.ExecuteQueryNoCache(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("b_news_evaluation");
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
};
exports.DeleteWeiBo = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weibo_evaluation set last_modified=now()';
    if (utility.isValidData(query.ids) && typeof query.ids == "Array") {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (query.ids && query.ids.length > 0) {
        var ids = "";
        for (var i = 0; i < query.ids.length; i++) {
            if (ids == "") {

                ids += query.ids[i];
            } else {
                ids += "," + query.ids[i];
            }
        }
        sql += " , is_deleted=1 where b_id in(" + ids + ")";
    }
    pool.ExecuteQueryNoCache(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("b_weibo_evaluation");
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
};
exports.DeleteWeiXin = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weixin_evaluation set last_modified=now()';
    if (utility.isValidData(query.ids) && typeof query.ids == "Array") {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    if (query.ids && query.ids.length > 0) {
        var ids = "";
        for (var i = 0; i < query.ids.length; i++) {
            if (ids == "") {

                ids += query.ids[i];
            } else {
                ids += "," + query.ids[i];
            }
        }
        sql += " , is_deleted=1 where b_id in(" + ids + ")";
    }
    pool.ExecuteQueryNoCache(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                redisHelper.cleanKey("b_weixin_evaluation");
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
};
//批量修改新闻，微博，微信
exports.EditNewsOfBatch = function (req, res) {//{params:{query:[{id:"",title:"",score:""}]}}
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_news_evaluation set last_modified=now()';
    var sqlParams = [];
    var flag = 0;
    if (query && query.length <= 0) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    for (var i = 0; i < query.length; i++) {
        sql = 'update b_news_evaluation set last_modified=now()';
        sqlParams = [];
        if (utility.isValidData(query[i].title)) {
            sql += " ,news_title = ?";
            sqlParams.push(query[i].title);
        }
        if (utility.isValidData(query[i].url)) {
            sql += " ,news_url = ?";
            sqlParams.push(query[i].url);
        }
        if (utility.isValidData(query[i].score)) {
            sql += " ,score = ?";
            sqlParams.push(query[i].score);
        }
        sql += " where b_id = ?";
        sqlParams.push(query[i].id);
        pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
            }
            else {
                if (result.affectedRows > 0) {
                    ++flag;
                    redisHelper.cleanKey("b_news_evaluation");
                    if (flag == query.length) {
                        res.send(utility.jsonResult(null, '修改成功！'));
                    }
                }
                else {
                    res.send(utility.jsonResult('修改失败！'));
                }
            }
        });
    }
};
exports.EditWeiBoOfBatch = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weibo_evaluation set last_modified=now()';
    var sqlParams = [];
    var flag = 0;
    if (query && query.length <= 0) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    for (var i = 0; i < query.length; i++) {
        sql = 'update b_weibo_evaluation set last_modified=now()';
        sqlParams = [];
        if (utility.isValidData(query[i].title)) {
            sql += " ,status_text = ?";
            sqlParams.push(query[i].title);
        }
        if (utility.isValidData(query[i].url)) {
            sql += " ,url = ?";
            sqlParams.push(query[i].url);
        }
        if (utility.isValidData(query[i].score)) {
            sql += " ,score = ?";
            sqlParams.push(query[i].score);
        }
        sql += " where b_id = ?";
        sqlParams.push(query[i].id);
        pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
            }
            else {
                if (result.affectedRows > 0) {
                    ++flag;
                    redisHelper.cleanKey("b_weibo_evaluation");
                    if (flag == query.length) {
                        res.send(utility.jsonResult(null, '修改成功！'));
                    }
                }
                else {
                    res.send(utility.jsonResult('修改失败！'));
                }
            }
        });
    }
};
exports.EditWeiXinOfBatch = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sql = 'update b_weixin_evaluation set last_modified=now()';
    var sqlParams = [];
    var flag = 0;
    if (query && query.length <= 0) {
        res.send(utility.jsonResult('缺少必须参数ID'));
        return;
    }
    for (var i = 0; i < query.length; i++) {
        sql = 'update b_weixin_evaluation set last_modified=now()';
        sqlParams = [];
        if (utility.isValidData(query[i].title)) {
            sql += " ,article_title = ?";
            sqlParams.push(query[i].title);
        }
        if (utility.isValidData(query[i].url)) {
            sql += " ,article_url = ?";
            sqlParams.push(query[i].url);
        }
        if (utility.isValidData(query[i].score)) {
            sql += " ,score = ?";
            sqlParams.push(query[i].score);
        }
        sql += " where b_id = ?";
        sqlParams.push(query[i].id);
        pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
            }
            else {
                if (result.affectedRows > 0) {
                    ++flag;
                    redisHelper.cleanKey("b_weixin_evaluation");
                    if (flag == query.length) {
                        res.send(utility.jsonResult(null, '修改成功！'));
                    }
                }
                else {
                    res.send(utility.jsonResult('修改失败！'));
                }
            }
        });
    }
};
//获取新闻，微博，微信处理处理日志
exports.GetNewsHandleLog = function (req, res) {//{params:{query:{b_id:""}}}
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sqlParams = [];
    var sql = "SELECT n.status,n.is_sensitive,n.handle_type,n.create_record_time,IFNULL(n.handle_remark,'')handle_remark,e.title FROM (SELECT * FROM b_news_evaluation_handle WHERE b_id=?)AS n LEFT JOIN  b_emergency_plan e ON n.handle_id=e.id";
    if (query.b_id && utility.isValidData(query.b_id)) {
        sqlParams.push(query.b_id);
    } else {
        sqlParams.push(0);
    }
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        return res.send(utility.jsonResult(err, rows));
    });
};
exports.GetWeiBoHandleLog = function (req, res) {//{params:{query:{b_id:""}}}
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sqlParams = [];
    var sql = "SELECT n.status,n.is_sensitive,n.handle_type,n.create_record_time,IFNULL(n.handle_remark,'')handle_remark,e.title FROM (SELECT * FROM b_weibo_evaluation_handle WHERE b_id=?)AS n LEFT JOIN  b_emergency_plan e ON n.handle_id=e.id";
    if (query.b_id && utility.isValidData(query.b_id)) {
        sqlParams.push(query.b_id);
    } else {
        sqlParams.push(0);
    }
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        return res.send(utility.jsonResult(err, rows));
    });
};
exports.GetWeiXinHandleLog = function (req, res) {//{params:{query:{b_id:""}}}
    var params = utility.ParamsParse(req.body.params);
    var query = params.query; //参数
    var sqlParams = [];
    var sql = "SELECT n.status,n.is_sensitive,n.handle_type,n.create_record_time,IFNULL(n.handle_remark,'')handle_remark,e.title FROM (SELECT * FROM b_weixin_evaluation_handle WHERE b_id=?)AS n LEFT JOIN  b_emergency_plan e ON n.handle_id=e.id";
    if (query.b_id && utility.isValidData(query.b_id)) {
        sqlParams.push(query.b_id);
    } else {
        sqlParams.push(0);
    }
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, rows) {
        if (err) {
            console.error(err);
            res.send(utility.jsonResult(err));
            return;
        }
        return res.send(utility.jsonResult(err, rows));
    });
};

exports.GetCityInfoSummary2 = function (req, res) {
    var sql = "select * from v_cityinfo;";
    pool.ExecuteQuery(sql, [], function (err, rows) {
        if (err) {
            console.error('GetCityInfoSummary error:' + err);
            return;
        }
        //构造城市数据
        var YanCheng = new CityInfo('江苏省', 1, '盐城市', 0, 0, 0, 0);
        var NanTong = new CityInfo('江苏省', 1, '南通市', 0, 0, 0, 0);
        var WuXi = new CityInfo('江苏省', 1, '无锡市', 0, 0, 0, 0);
        var KunShan = new CityInfo('江苏省', 1, '昆山市', 0, 0, 0, 0);
        var HongZe = new CityInfo('江苏省', 1, '洪泽县', 0, 0, 0, 0);
        var HaErBin = new CityInfo('黑龙江', 2, '哈尔滨', 0, 0, 0, 0);
        var FoShan = new CityInfo('广东省', 3, '佛山市', 0, 0, 0, 0);
        var DongGuan = new CityInfo('广东省', 3, '东莞市', 0, 0, 0, 0);
        var YanTai = new CityInfo('山东省', 4, '烟台市', 0, 0, 0, 0);
        var JiNing=new CityInfo('山东省', 4, '济宁市', 0, 0, 0, 0);
        var BeiJing = new CityInfo('北京市', 5, '北京市', 0, 0, 0, 0);
        for (var i = 0; i < rows.length; i++) {
            var item = rows[i];
            switch (item.customer_name) {
                case '盐城':
                    SumCityScore(YanCheng, item);
                    break;
                case '南通':
                    SumCityScore(NanTong, item);
                    break;
                case '无锡':
                    SumCityScore(WuXi, item);
                    break;
                case '昆山':
                    SumCityScore(KunShan, item);
                    break;
                case '洪泽':
                    SumCityScore(HongZe, item);
                    break;
                case '哈尔滨':
                    SumCityScore(HaErBin, item);
                    break;
                case '佛山':
                    SumCityScore(FoShan, item);
                    break;
                case '烟台':
                    SumCityScore(YanTai, item);
                    break;
                case '济宁':
                    SumCityScore(JiNing, item);
                    break;
                case '北京':
                    SumCityScore(BeiJing, item);
                    break;
                case '东莞':
                    SumCityScore(DongGuan, item);
                    break;
            }
        }
        var result = {
            success: true,
            data: [YanCheng, NanTong, WuXi, KunShan, HongZe, FoShan, YanTai, BeiJing, DongGuan,JiNing]
        };
        res.send(result);
    });

};
//优化后
exports.GetCityInfoSummary=function(req,res){
    var sql="SELECT tenant.province_id AS PROID,tenant.name AS City,tenant.province AS PRO,IFNULL(b.pos_count,0) AS POSCount,IFNULL(b.neg_count,0) AS NegCount,IFNULL(b.neu_count,0) AS MinCount,IFNULL((b.pos_count+b.neg_count+b.neu_count),0)AS TotalCount FROM  tenants_tenants tenant "+
        "LEFT JOIN (SELECT customer_name,SUM(pos_count)pos_count,SUM(neg_count)neg_count,SUM(neu_count)neu_count FROM biz_sentiment WHERE report_date=DATE_FORMAT(NOW(),'%Y-%m-%d') GROUP BY customer_name)b "+
        "ON b.customer_name=tenant.name WHERE tenant.province IS NOT NULL  ORDER BY TotalCount DESC";
    pool.ExecuteQuery(sql,function(err,rows){
        var result = {
            success: true,
            data:[]
      };
        if(rows){
            result.data=rows;
        }
        res.send(result);
    });
}

exports.GetLastAppFile = function (req, res) {
    var version = req.body.versionCode;
    var appPath = path.normalize(__dirname + '/..') + '\\app\\android';
    var domainUrl = req.get("Host");
    if (domainUrl && domainUrl.indexOf("http：//") < 0) {
        domainUrl = "http://" + domainUrl;
    }
    utility.GetLastAppFile(appPath, version, domainUrl, function (err, result) {
        //console.log(result);
        res.json(result);
    });
};

function CityInfo(province, provinceId, city, totalCount, posCount, negCount, minCount) {
    this.PRO = province;
    this.PROID = provinceId;
    this.City = city;
    this.TotalCount = totalCount;
    this.POSCount = posCount;
    this.NegCount = negCount;
    this.MinCount = minCount;
}
function SumCityScore(_city, _it) {
    if (_it.xscore > 3) {
        _city.POSCount += _it.xcount;//微博积极数
    } else if (_it.xscore < -3) {
        _city.NegCount += _it.xcount;//微博消极数
    }
    else {
        _city.MinCount += _it.xcount;//微博消极数
    }
    _city.TotalCount += _it.xcount;//舆情总数
}

function parserSentimentReportSql(clientInfo, params, table, createdate, filed, condition, groupby, req, notNullFieldArray, search_engine) {
    var query = params.query; //查询参数
    var sql = "SELECT " + filed + " FROM " + table + " where 1 = 1";

    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name =" + pool.mysql.escape(clientInfo.CustomName);
    }
    if (params.query && params.query.brand_name && params.query.brand_name != "") {
        sql += " and brand_name=" + pool.mysql.escape(params.query.brand_name);
    }
    if (notNullFieldArray) {
        for (var item in notNullFieldArray) {
            sql += " and " + notNullFieldArray[item] + "<>'[]' ";
        }
    }

    if (search_engine) {
        sql += search_engine;
    }
    //sql += " and  customer_name='昆山'";

    if (query.start_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d') >=DATE_FORMAT(" + pool.mysql.escape(query.start_date) + ",'%Y-%m-%d')";
    }
    if (query.end_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d')<=DATE_FORMAT(" + pool.mysql.escape(query.end_date) + ",'%Y-%m-%d')";
    }
    sql += condition + groupby;

    return sql;
}

function parserSentimentDaySql(clientInfo, params, table, createdate, req) {
    var query = params.query; //查询参数
    var sql = "SELECT DATE_FORMAT(" + createdate + ",'%Y-%m-%d') days,COUNT(0) AS cnt FROM " + table + " where 1 = 1";
    var sqlParams = [];
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name =" + pool.mysql.escape(clientInfo.CustomName);
    }
    if (query.field_name && query.field_name != undefined) {
        sql += " and field_name =" + pool.mysql.escape(query.field_name);
    }
    if (query.brand_name && query.brand_name != undefined && query.brand_name != "") {
        sql += " and brand_name =" + pool.mysql.escape(query.brand_name);
    }
    if (query.start_date && query.start_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d') >=DATE_FORMAT(" + pool.mysql.escape(query.start_date) + ",'%Y-%m-%d')";
    }
    if (query.end_date && query.end_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d') <=DATE_FORMAT(" + pool.mysql.escape(query.end_date) + ",'%Y-%m-%d')";
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY DATE_FORMAT(" + createdate + ",'%Y-%m-%d')";

    return sql;
}

//小时，分钟和秒力度
function parserSentimentCountSql(clientInfo, params, table, createdate, req, timeType) {
    var query = params.query; //查询参数
    var dFormat = "%Y-%m-%d-%H"; //小时
    switch (timeType) {
        case "hour":
            dFormat = "%Y-%m-%d-%H";
            break;
        case "minute":
            dFormat = "%Y-%m-%d-%H-%i";
            break;
        case "second":
            dFormat = "%Y-%m-%d-%H-%i-%s";
            break;
        case "day":
            dFormat = "%Y-%m-%d";
            break;
        case "month":
            dFormat = "%Y-%m";
            break;
        case "year":
            dFormat = "%Y";
            break;
        default:
            break;
    }

    var sql = "SELECT DATE_FORMAT(" + createdate + ",'" + dFormat + "') " + timeType + ",COUNT(0) AS cnt FROM " + table + " where 1 = 1";
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name =" + pool.mysql.escape(clientInfo.CustomName);
    }
    if (query.field_name && query.field_name != undefined) {
        sql += " and field_name =" + pool.mysql.escape(query.field_name);
    }
    if (query.brand_name && query.brand_name != undefined && query.brand_name != "") {
        sql += " and brand_name =" + pool.mysql.escape(query.brand_name);
    }
    if (query.start_date && query.start_date != undefined) {
        var start_date = moment(query.start_date).format();
        sql += " and DATE_FORMAT(" + createdate + ",'" + dFormat + "') >=DATE_FORMAT(" + pool.mysql.escape(start_date) + ",'" + dFormat + "')";
    }
    if (query.end_date && query.end_date != undefined) {
        var end_date = moment(query.end_date).format();
        sql += " and DATE_FORMAT(" + createdate + ",'" + dFormat + "') <=DATE_FORMAT(" + pool.mysql.escape(end_date) + ",'" + dFormat + "')";
    }
    //正负极性
    if (utility.isValidData(query.level)) {
        if (query.level == '1') {
            sql += " and score > " + BasicSettings.positiveValue;
        }
        else if (query.level == '0') {
            sql += " and score >=" + BasicSettings.negativeValue + " and score <= " + BasicSettings.positiveValue;
        }
        else if (query.level == '-1') {
            sql += " and score < " + BasicSettings.negativeValue;
        }
    }
    sql += " GROUP BY DATE_FORMAT(" + createdate + ",'" + dFormat + "')";

    return sql;
}

function parserSentimentScoreDaySql(params, table, createdate) {
    var query = params.query; //查询参数
    var sql = "SELECT if(score > 0,1,(if(score = 0, 0, - 1))) score1,COUNT(0) AS cnt FROM " + table + " where 1 = 1";

    if (query.customer_name && query.customer_name != undefined) {
        sql += " and customer_name =" + pool.mysql.escape(query.customer_name);
    }
    if (query.start_date && query.start_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d') >=DATE_FORMAT(" + pool.mysql.escape(query.start_date) + ",'%Y-%m-%d')";
    }
    if (query.end_date && query.end_date != undefined) {
        sql += " and DATE_FORMAT(" + createdate + ",'%Y-%m-%d') <=DATE_FORMAT(" + pool.mysql.escape(query.end_date) + ",'%Y-%m-%d')";
    }

    sql += " GROUP BY score1";

    return sql;
}

function sentimentDayExecute(sqlQuery, res) {
    //console.log(sqlQuery);
    pool.ExecuteQuery(sqlQuery, function (err, rows) {
        if (err) {
            //console.log(err);
            res.send(500, err);
            return;
        }
        else {
            var dataArray = [];
            for (var j = 0; j < rows.length; j++) {
                var time = rows[j].days.split('-');
                var year = time[0];
                var month = time[1] - 1;
                var day = time[2];

                dataArray.push([Date.UTC(year, month, day), rows[j].cnt]);
            }

            var result = {
                success: true,
                data: dataArray
            };
            res.send(result);
        }
    });
}

function sentimentExecute(sqlQuery, res, timeType) {
    //console.log(sqlQuery);
    pool.ExecuteQuery(sqlQuery, function (err, rows) {
        if (err) {
            //console.log(err);
            res.send(500, err);
            return;
        }

        var dataArray = [];
        for (var j = 0; j < rows.length; j++) {
            var time = rows[j][timeType].split('-');
            var year = time[0];
            var month = time[1] - 1;
            var day = time[2];
            var hour = 0,
                minute = 0,
                second = 0;
            switch (timeType) {
                case "hour":
                    hour = time[3];
                    break;
                case "minute":
                    hour = time[3];
                    minute = time[4];
                    break;
                case "second":
                    hour = time[3];
                    minute = time[4];
                    second = time[5];
                    break;
                default:
                    break;
            }
            var date = new Date(year + '-' + (month + 1) + '-' + day + ' ' + hour + ':' + minute + ':' + second);
            dataArray.push([Date.parse(date), rows[j].cnt]);
        }
        var result = {
            success: true,
            data: dataArray
        };
        res.send(result);
    });
}

//function GetTokenInformation(req, next) {
//    var clientInfo = req.cookies.clienttoken //点击了记住我
//        //|| req.session.AuthenticationToken//未点击记住我
//        || req.headers.authentication;//来自Mobile
//
//    if (typeof(clientInfo) == 'object') {
//        next(clientInfo);
//    }
//    else if (typeof (clientInfo) == "string") {
//        TokenVerification.GetUserInformationByToken(clientInfo, function (isFetch, clientInfo) {
//            if (isFetch) {
//                next(clientInfo);
//            }
//        });
//    }
//}