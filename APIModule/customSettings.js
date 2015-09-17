/**
 * Created by chunping on 2014/10/10.
 */

var ConfigInfo = require('../Config');
var pool = require('../lib/DbHelper');
//var pool = new DbHelper();
var utility = require('../lib/Utility');
var async = require("async");
//分类词库管理API
function CategoryTag() {
}

CategoryTag.prototype.GetCategoryTagList = function (req, res) {
    var clientInfo = req.session.clientInfo;
    //var params = utility.ParamsParse(req.body.params);
    var sqlQuery = "SELECT `classification_name`,`field_name`,`category_name`,`keyword`,`keywords_weight`,`is_default_value` FROM " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " WHERE is_deleted=0 and customer_name=?";
    var sqlParams = [clientInfo.CustomName];
    pool.ExecuteQueryNoCache(sqlQuery, sqlParams, function (err, data) {
        //console.log(sqlQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

CategoryTag.prototype.AddCategoryTag = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (!utility.isValidData(query.field_name) || !utility.isValidData(query.category_name) || !utility.isValidData(clientInfo.CustomName)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var checkSQl = "select * from " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " where field_name = ? and category_name = ? and keyword = ? and customer_name = ?";
    var checkParams = [query.field_name, query.category_name, query.category_name, clientInfo.CustomName];
    pool.ExecuteQueryNoCache(checkSQl, checkParams, function (err, result) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        else {
            if (result.length > 0) {
                if (result[0].is_deleted == 1)//有添加的记录,恢复记录
                {
                    var restoreSQL = "update " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " set is_deleted = 0,last_modified = now() where field_name = ? and category_name = ? and customer_name = ? and is_default_value = 0";
                    var restoreParams = [query.field_name, query.category_name, clientInfo.CustomName];
                    pool.ExecuteQueryNoCache(restoreSQL, restoreParams, function (err, result) {
                        if (err) {
                            return  res.send(utility.jsonResult(err));
                        }
                        else {
                            if (result.affectedRows > 0) {
                                res.send(utility.jsonResult(null, '添加成功！'));
                            }
                            else {
                                res.send(utility.jsonResult('添加失败！'));
                            }
                        }
                    });
                }
                else {//正在使用的有效关键字
                    return res.send(utility.jsonResult("关键词已经存在！"));
                }
            }
            else {
                var insertQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_cfg_sys_information_tag + '(`classification_name`,`field_name`,`category_name`,`keyword`,`keywords_weight`,`last_modified`,`is_deleted`,`customer_name`,`is_default_value`)';
                insertQuery += " VALUES (?,?,?,?,?,NOW(),0,?,0)";
                if (!utility.isValidData(query.classification_name)) {
                    query.classification_name = "缺省分类";
                }
                if (!utility.isValidData(query.keywords_weight)) {
                    query.keywords_weight = 1;
                }

                var insertParams = [query.classification_name, query.field_name, query.category_name, query.category_name, query.keywords_weight, clientInfo.CustomName];
                pool.ExecuteQueryNoCache(insertQuery, insertParams, function (err, result) {
                    if (err) {
                        return  res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            res.send(utility.jsonResult(null, '添加成功！'));
                        }
                        else {
                            res.send(utility.jsonResult('添加失败！'));
                        }
                    }
                });
            }
        }
    });
};

CategoryTag.prototype.SaveCategoryTag = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (query.keywords == undefined || !utility.isValidData(query.field_name) || !utility.isValidData(query.category_name) || !utility.isValidData(clientInfo.CustomName)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var keywords = query.keywords;
    var keyWordsArray = [];
    keywords = keywords.replace(/(^\s+)|(\s+$)/g, "");
    if (keywords.length > 0) {
        originalKeyWordsArray = keywords.split(' ');
        originalKeyWordsArray.forEach(function (item) {
            if (item != '' && keyWordsArray.indexOf(item) < 0) {
                keyWordsArray.push(item);
            }
        });
        var keyWordsWithSingleQuote = [];
        keyWordsArray.forEach(function (item) {
            keyWordsWithSingleQuote.push("'" + item + "'");
        });
        if (keyWordsArray.length > 0) {
            //标记删除
            var markDeleteSQL = "update " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " set is_deleted = 1,last_modified = now() where field_name = ? and category_name = ? and customer_name = ? and is_default_value = 0 and keyword not in(" + keyWordsWithSingleQuote.join(',') + ")";
            var sqlParams = [query.field_name, query.category_name, clientInfo.CustomName];
            pool.ExecuteQueryNoCache(markDeleteSQL, sqlParams, function (err, result) {
                if (err) {
                    return res.json(err);
                }
            });
            var executeArray = [];
            for (var j = 0; j < keyWordsArray.length; j++) {
                (function (i) {
                    executeArray.push(function (callback) {
                        var checkSQl = "select * from " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " where field_name = ? and category_name = ? and keyword = ?";
                        var checkParams = [query.field_name, query.category_name, keyWordsArray[i]];
                        pool.ExecuteQueryNoCache(checkSQl, checkParams, function (err, result) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                var sql = "";
                                var sqlParams = "";
                                if (result && result.length > 0) {//已经存在此标签
                                    if (result[0].is_deleted == 1)//已经存在，但是被逻辑删除了，则恢复标签
                                    {
                                        sql = "update " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " set is_deleted = 0 ,last_modified = now() where field_name = ? and category_name = ? and keyword = ? and customer_name = ?";
                                        sqlParams = [query.field_name, query.category_name, keyWordsArray[i], clientInfo.CustomName];
                                    }
                                }
                                else {//不存在此关键字，插入新的数据行
                                    sql = "insert into " + ConfigInfo.DbTables.db_cfg_sys_information_tag + "(`classification_name`,`field_name`,`category_name`,`keyword`,`keywords_weight`,`last_modified`,`is_deleted`,`customer_name`,`is_default_value`)";
                                    sql += "VALUES (?,?,?,?,1,NOW(),0,?,0)";
                                    if (!utility.isValidData(query.classification_name)) {
                                        query.classification_name = "缺省分类";
                                    }
                                    sqlParams = [query.classification_name, query.field_name, query.category_name, keyWordsArray[i], clientInfo.CustomName];
                                }
                                if (sql.length > 0) {
                                    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
                                        //callback(err, result);
                                        if (err) {
                                            callback(err);
                                        }
                                        else {
                                            if (result.affectedRows > 0) {
                                                callback(null, "保存成功");
                                            }
                                            else {
                                                callback("保存失败");
                                            }
                                        }
                                    });
                                }
                                else {//已存在此关键词,无需修改
                                    callback(null, "保存成功");
                                }
                            }
                        });
                    });
                })(j)
            }
            async.parallel(executeArray, function (err, results) {
                var resultObj = utility.jsonResult(err, results);
                res.json(resultObj);
            });
        }
    }
    else {//如果关键字为空 则全部标记删除
        var markAllDeleteSQL = "update " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " set is_deleted = 1,last_modified = now() where field_name = ? and category_name = ? and customer_name = ? and is_default_value = 0";
        var markAllDeleteSQLParams = [query.field_name, query.category_name, clientInfo.CustomName];
        pool.ExecuteQueryNoCache(markAllDeleteSQL, markAllDeleteSQLParams, function (err, result) {
            if (err) {
                return  res.send(utility.jsonResult(err));
            }
            else {
                if (result.affectedRows > 0) {
                    res.send(utility.jsonResult(null, '保存成功！'));
                }
                else {
                    res.send(utility.jsonResult('保存失败！'));
                }
            }
        });
    }

};
//删除标签
CategoryTag.prototype.DeleteCategoryTag = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    var markDeleteSQL = "update " + ConfigInfo.DbTables.db_cfg_sys_information_tag + " set is_deleted = 1,last_modified = now() where field_name = ? and category_name = ? and customer_name = ? and is_default_value = 0";
    var sqlParams = [query.field_name, query.category_name, clientInfo.CustomName];
    pool.ExecuteQueryNoCache(markDeleteSQL, sqlParams, function (err, result) {
        if (err) {
            return  res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
};
exports.CategoryTag = new CategoryTag();

//话题
function TopicTag() {
}
//获取话题列表
TopicTag.prototype.GetTopicTagList = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var sqlQuery = "SELECT `id`,`customer_name`,`topic_name`,`keyword`,`keywords_weight`,`start_time`,`end_time` FROM " + ConfigInfo.DbTables.db_cfg_sys_topic_tag + " WHERE is_deleted=0 and customer_name=?";
    var sqlParams = [clientInfo.CustomName];
    pool.ExecuteQueryNoCache(sqlQuery, sqlParams, function (err, data) {
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
}
//添加新话题
TopicTag.prototype.AddTopicTag = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (!utility.isValidData(clientInfo.CustomName) || !utility.isValidData(query.topic_name) || !utility.isValidData(query.keyword) || !utility.isValidData(query.start_time) || !utility.isValidData(query.end_time)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var sql = "INSERT INTO `cfg_sys_topic_tag` (`customer_name`,`topic_name`,`keyword`,`keywords_weight`,`start_time`,`end_time`,`last_modified`,`is_deleted`)";
    sql += "VALUES(?,?,?,?,?,?,now(),0)";
    if (!utility.isValidData(query.keywords_weight)) {
        query.keywords_weight = 1;
    }
    var sqlParams = [clientInfo.CustomName, query.topic_name, query.keyword, query.keywords_weight, query.start_time, query.end_time];
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
        if (err) {
            return  res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                res.send(utility.jsonResult(null, '添加成功！'));
            }
            else {
                res.send(utility.jsonResult('添加失败！'));
            }
        }
    });
}
//保存话题
TopicTag.prototype.UpdateTopicTag = function (req, res) {
//是否需要修改功能
}
//删除话题
TopicTag.prototype.DeleteTopicTag = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (!utility.isValidData(clientInfo.CustomName) || !utility.isValidData(query.id)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var markDeleteSQL = "update cfg_sys_topic_tag set is_deleted = 1,last_modified = now() where id= ? and customer_name = ?";
    var sqlParams = [query.id, clientInfo.CustomName];
    pool.ExecuteQueryNoCache(markDeleteSQL, sqlParams, function (err, result) {
        if (err) {
            return  res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
}
exports.TopicTag = new TopicTag();

//搜索关键字配置
function SearchKeywords() {
}
SearchKeywords.prototype.GetSearchKeywordsList = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var sql = "SELECT `id`,`field_name`,`brand_name`,`dict_category`,`keyword`,`search_engine`,`is_search`,`manner`,`language` FROM `cfg_search_keywords` WHERE is_deleted=0 and customer_name=?";
    var sqlParams = [clientInfo.CustomName];
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, data) {
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
}

SearchKeywords.prototype.AddSearchKeywords = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (!utility.isValidData(clientInfo.CustomName) || !utility.isValidData(query.keyword) || !utility.isValidData(query.search_engine) || !utility.isValidData(query.manner)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var checkSQl = "select * from " + ConfigInfo.DbTables.db_cfg_search_keywords + " where keyword = ? and customer_name = ?";
    var checkParams = [query.keyword, clientInfo.CustomName];
    pool.ExecuteQueryNoCache(checkSQl, checkParams, function (err, result) {
        if (err) {
            return res.send(utility.jsonResult(err));
        }
        else {
            if (result.length > 0) {
                if (result[0].is_deleted == 1)//有添加的记录,恢复记录
                {
                    var restoreSQL = "update " + ConfigInfo.DbTables.db_cfg_search_keywords + " set is_deleted = 0,last_modified = now() where customer_name = ?";
                    var restoreParams = [clientInfo.CustomName];
                    pool.ExecuteQueryNoCache(restoreSQL, restoreParams, function (err, result) {
                        if (err) {
                            return  res.send(utility.jsonResult(err));
                        }
                        else {
                            if (result.affectedRows > 0) {
                                res.send(utility.jsonResult(null, '添加成功！'));
                            }
                            else {
                                res.send(utility.jsonResult('添加失败！'));
                            }
                        }
                    });
                }
                else {//正在使用的有效关键字
                    return res.send(utility.jsonResult("关键词已经存在！"));
                }
            }
            else {
                var sql = "INSERT INTO " + ConfigInfo.DbTables.db_cfg_search_keywords + "(`customer_name`,`field_name`,`brand_name`,`dict_category`,`keyword`,`search_engine`,`is_search`,`manner`,`language`,`last_modified`)";
                sql += "VALUES (?,?,?,?,?,?,1,?,?,NOW())";
                if (!utility.isValidData(query.field_name)) {
                    query.field_name = "综合";
                }
                if (!utility.isValidData(query.brand_name)) {
                    query.brand_name = "综合";
                }
                if (!utility.isValidData(query.dict_category)) {
                    query.dict_category = "综合";
                }
                if (!utility.isValidData(query.language)) {
                    query.language = "zh";
                }
                var sqlParams = [clientInfo.CustomName, query.field_name, query.brand_name, query.dict_category, query.keyword, query.search_engine, query.manner, query.language];
                pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
                    if (err) {
                        return  res.send(utility.jsonResult(err));
                    }
                    else {
                        if (result.affectedRows > 0) {
                            res.send(utility.jsonResult(null, '添加成功！'));
                        }
                        else {
                            res.send(utility.jsonResult('添加失败！'));
                        }
                    }
                });
            }
        }
    });
}

SearchKeywords.prototype.UpdateSearchKeywords = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    var sql = "update cfg_search_keywords set last_modified = now()";
    var sqlParams = [];
    if (utility.isValidData(query.keyword)) {
        sql += ", keyword = ?";
        sqlParams.push(query.keyword);
    }
    if (utility.isValidData(query.search_engine)) {
        sql += ", search_engine = ?";
        sqlParams.push(query.search_engine);
    }
    if (utility.isValidData(query.is_search)) {
        sql += ", is_search = ?";
        sqlParams.push(query.is_search);
    }
    if (utility.isValidData(query.manner)) {
        sql += ", manner = ?";
        sqlParams.push(query.manner);
    }
    sql += " where id= ? and customer_name = ?";
    //sqlParams.concat([query.id, clientInfo.CustomName]);
    sqlParams.push(query.id);
    sqlParams.push(clientInfo.CustomName);
    pool.ExecuteQueryNoCache(sql, sqlParams, function (err, result) {
        if (err) {
            return  res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                res.send(utility.jsonResult(null, '修改成功！'));
            }
            else {
                res.send(utility.jsonResult('修改失败！'));
            }
        }
    });
}

SearchKeywords.prototype.DeleteSearchKeywords = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var query = params.query;
    if (!utility.isValidData(clientInfo.CustomName) || !utility.isValidData(query.id)) {
        return res.json(utility.jsonResult("缺少必须参数"));
    }
    var markDeleteSQL = "update cfg_search_keywords set is_deleted = 1,last_modified = now() where id= ? and customer_name = ?";
    var sqlParams = [query.id, clientInfo.CustomName];
    pool.ExecuteQueryNoCache(markDeleteSQL, sqlParams, function (err, result) {
        if (err) {
            return  res.send(utility.jsonResult(err));
        }
        else {
            if (result.affectedRows > 0) {
                res.send(utility.jsonResult(null, '删除成功！'));
            }
            else {
                res.send(utility.jsonResult('删除失败！'));
            }
        }
    });
}
exports.SearchKeywords = new SearchKeywords();
