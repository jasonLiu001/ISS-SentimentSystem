var ConfigInfo = require('../Config');
var pool = require('../lib/DbHelper');
var async = require('async');
var utility = require('../lib/Utility');
var crypto = require('crypto');

//-------------------------------Group---------------------------------------
/**
 * function GetGroupForTenant()
 * Get the group list.
 */
exports.GetGroupForTenant = function (req, res) {
    var sqllQuery = "SELECT * FROM " + ConfigInfo.DbTables.db_group + " WHERE categoryid='tenant'";

    pool.ExecuteQuery(sqllQuery, function (err, data) {
        console.log(sqllQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

/**
 * function GetGroupList()
 * Get the group list.
 */
exports.GetGroupList = function (req, res) {
    //GetTokenInformation(req, function (clientInfo) {
    var clientInfo = req.session.clientInfo;
    var userId = clientInfo.UserID,
        tenant = clientInfo.TenantID;

    var queryParams = utility.parserQueryLike(req.body, '', true, ["name"], tenant);
    var selectQuery = 'SELECT * FROM ' + ConfigInfo.DbTables.db_group + queryParams.condition + queryParams.order + queryParams.limit;
    var selectQueryCount = 'SELECT count(0) cnt FROM ' + ConfigInfo.DbTables.db_group + queryParams.condition;
    ParallelExecuteQuery(res, selectQuery, selectQueryCount);
    // });
};

/**
 * function GetGroupByCondition()
 * Get the group list by group name.
 * This function used by search.
 */
exports.GetGroupByCondition = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var queryParams = utility.parserQueryLike(req.body, '', true, ["name"], tenant);
        var selectQuery = 'SELECT * FROM ' + ConfigInfo.DbTables.db_group + queryParams.condition + queryParams.order + queryParams.limit;
        var selectQueryCount = 'SELECT count(0) cnt FROM ' + ConfigInfo.DbTables.db_group + queryParams.condition;
        ParallelExecuteQuery(res, selectQuery, selectQueryCount);
    });
};


/**
 * function GetGroupById()
 * Get the group list by group id.
 * This function used by search.
 */
exports.GetGroupById = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        req.body.params = {query: {id: parameter.id, tenant: tenant}};

        var queryParams = utility.parser(req.body);
        var selectQuery = 'SELECT * FROM ' + ConfigInfo.DbTables.db_group + queryParams.condition + queryParams.order + queryParams.limit;
        GetPermissionById(req, res, selectQuery, 0);
    });
};

/**
 * function AddGroup()
 * Add the group.
 */
exports.AddGroup = function (req, res) {

    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        var param = utility.combineParams(parameter, false, ['permission', 'api']);
        var id = utility.NewGuid();

        var keys = param.keys + "id,tenant,create_by,create_on,last_modified",
            values = param.values + pool.mysql.escape(id) + "," + tenant + ",'',now(),now()";

        var insertGroupQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_group + '(' + keys + ')VALUES(' + values + ')';

        async.parallel({
                api: function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = id;
                    option.permission = parameter.api;
                    InsertApi(option, utility.Group, cb);
                },
                model: function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = id;
                    option.permission = parameter.permission;
                    InsertModel(option, utility.Group, cb);
                },
                group: function (cb) {
                    QueryExecute(insertGroupQuery, cb);
                }
            },
            function (err, result) {
                var resultObj = '';
                if (result.group.Result) {
                    resultObj = utility.jsonResult('', {group: '组入库成功！', model: result.model, api: result.api});
                } else {
                    resultObj = utility.jsonResult(err, {group: result.group, model: result.model, api: result.api});
                }

                res.json(resultObj);
            }
        );
    });
};

/**
 * function DeleteGroupById()
 * Delete the group by group id.
 */
exports.DeleteGroupById = function (req, res) {
    var id = req.body.id;

    var param = utility.combineDeleteQuery(req.body, ConfigInfo.DbTables.db_group);
    if (!param.result) {
        var result = utility.jsonResult(param.query, '');
        res.json(result);
    }

    var deleteGroup = param.query;

    async.parallel({
            group: function (cb) {
                pool.ExecuteQuery(deleteGroup, function (err, data) {
                    console.log(deleteGroup);
                    cb(err, data);
                });
            },
            permission: function (cb) {
                DeletePermissionById(id, 0, function (err, data) {
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var resultObj = '';
            if (result.group) {
                resultObj = utility.jsonResult('', '删除成功！');
            } else {
                resultObj = utility.jsonResult(err, result.group);
            }

            res.json(resultObj);
        }
    );
};

/**
 * function UpdateGroup()
 * Update the group.
 */
exports.UpdateGroup = function (req, res) {

    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        var param = utility.combineUpdateParam(parameter, ['id', 'permission', 'api']);
        if (!param.result) {
            var result = utility.jsonResult(param.condition, '');
            res.json(result);
        }

        var condition = param.condition + "last_modified=now() WHERE id=" + pool.mysql.escape(parameter.id);

        var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_group + condition;

        var deleteApiQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_api_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =0';
        var deleteModelQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_model_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =0';

        async.auto({
                updateGroup: function (cb) {
                    QueryExecute(updateQuery, cb);
                },
                deleteApi: function (cb) {
                    QueryExecute(deleteApiQuery, cb);
                },
                deleteModel: function (cb) {
                    QueryExecute(deleteModelQuery, cb);
                },
                addApi: ['deleteApi', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.api;
                    InsertApi(option, utility.Group, cb);
                }],
                addModel: ['deleteModel', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.permission;
                    InsertModel(option, utility.Group, cb);
                }]
            },
            function (err, result) {
                var resultObj = '';
                if (result.updateGroup.Result) {
                    resultObj = utility.jsonResult('', {group: '组更新成功！', model: result.addModel, api: result.addApi});
                } else {
                    resultObj = utility.jsonResult(err, {group: result.group, model: result.addModel, api: result.addApi});
                }

                res.json(resultObj);
            }
        );
    });
};

//------------------------------End Group-----------------------------------

//---------------------------Permission----------------------------------
exports.CheckPermissionByToken = function (req, res, next) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;
        method = req.method,
            url = req.url;
        var api = method.toLowerCase() + " " + url.toLowerCase();

        var selectGroupIdQuery = 'SELECT groupid FROM ' + ConfigInfo.DbTables.db_user_group + ' WHERE userid=' + pool.mysql.escape(userId);
        async.auto({
                group: function (cb) {
                    pool.ExecuteQuery(selectGroupIdQuery, function (err, data) {
                        console.log(selectGroupIdQuery);
                        cb(err, data[0]);
                    });
                },
                model: ['group', function (cb, result) {
                    var gId = result.group.groupid;
                    var selectModelQuery = 'SELECT count(0) cnt FROM ' + ConfigInfo.DbTables.db_api + 'a LEFT JOIN ' + ConfigInfo.DbTables.db_api_subscription + ' s ON a.id=s.api  WHERE (s.id=' + pool.mysql.escape(userId) + ' and s.type=' + utility.User + ') or (s.id=' + pool.mysql.escape(gId) + ' and s.type=' + utility.Group + ') and s.tenant=' + tenant + ' and lower(a.router)=' + pool.mysql.escape(api);
                    pool.ExecuteQuery(selectGroupIdQuery, function (err, data) {
                        console.log(selectGroupIdQuery);
                        cb(err, data[0]);
                    });
                }]
            },
            function (err, result) {
                var resultObj;
                if (result.model && result.model.cnt > 0) {
                    resultObj = utility.jsonResult(err, "验证通过！");
                } else {
                    resultObj = utility.jsonResult(err, "验证未通过！");
                }

                res.json(resultObj);
            }
        );
    });
};

exports.GetPermissionByGroupId = function (req, res) {

    GetPermissionList(req, utility.Group, function (err, data) {
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

exports.UpdatePermissionForGroup = function (req, res) {
    UpdatePermission(req, res, utility.Group);
};

exports.GetPermissionByUserId = function (req, res) {

    GetPermissionList(req, utility.User, function (err, data) {
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

exports.GetModulePermissionByToken = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var selectGroupIdQuery = 'SELECT groupid FROM ' + ConfigInfo.DbTables.db_user_group + ' WHERE userid=' + pool.mysql.escape(userId);
        async.auto({
                group: function (cb) {
                    pool.ExecuteQuery(selectGroupIdQuery, function (err, data) {
                        console.log(selectGroupIdQuery);
                        cb(err, data[0]);
                    });
                },
                model: ['group', function (cb, result) {
                    var gId = result.group.groupid;
                    var selectModelQuery = 'SELECT distinct a.* FROM ' + ConfigInfo.DbTables.db_model + ' a LEFT JOIN ' + ConfigInfo.DbTables.db_model_subscription + ' s ON a.id=s.model WHERE (s.id=' + pool.mysql.escape(userId) + ' and s.type=' + utility.User + ') or (s.id=' + pool.mysql.escape(gId) + ' and s.type=' + utility.Group + ') and s.tenant=' + tenant;
                    pool.ExecuteQuery(selectModelQuery, function (err, data) {
                        console.log(selectModelQuery);
                        cb(err, data);
                    });
                }]
            },
            function (err, result) {
                    var resultObj = utility.jsonResult(err, result.model);
                res.json(resultObj);
            }
        );
    });
};

exports.UpdatePermissionForUser = function (req, res) {
    UpdatePermission(req, res, utility.User);
};

exports.GetPermission = function (req, res) {

    var selectModelQuery = 'SELECT * FROM ' + ConfigInfo.DbTables.db_model;
    var selectApiQuery = 'SELECT * FROM ' + ConfigInfo.DbTables.db_api;

    async.parallel({
            model: function (cb) {
                pool.ExecuteQuery(selectModelQuery, function (err, data) {
                    console.log(selectModelQuery);
                    cb(err, data);
                });
            },
            api: function (cb) {
                pool.ExecuteQuery(selectApiQuery, function (err, data) {
                    console.log(selectApiQuery);
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var resultObj = utility.jsonResult(err, {model: result.model, api: result.api});
            res.json(resultObj);
        }
    );
};

//---------------------------End Permission-------------------------------

//----------------------------- Model-------------------------------------

/**
 * function GetModelList()
 * Get the model list.
 */
exports.GetModelList = function (req, res) {
    var sql = "select * from " + ConfigInfo.DbTables.db_model + " where 1=1";
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数
    var sqlParams = [];
    if (utility.isValidData(clientInfo.TenantID)) {
        sql += " and tenantid=?";
        sqlParams.push(clientInfo.TenantID);
    }
    if (utility.isValidData(clientInfo.UserID)) {
        sql += " and create_by=?";
        sqlParams.push(clientInfo.UserID);
    }
    if (utility.isValidData(query.name)) {
        sql += " and name=?";
        sqlParams.push(clientInfo.name);
    }
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
    if (pagination.pagesize&& pagination&& !isNaN(pagination.pagesize) && !isNaN(pagination.pageindex)) {
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
            Result: true,
            TotalCount: 0,
            Data: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (err, rows) {
            if (err) {
                console.error(err);
                res.send(utility.jsonResult(err));
                return;
            }
            data.TotalCount = rows[0].count;
            res.send(data);
        });
    });
};

/**
 * function GetModelByName()
 * Get the model by model name.
 * This function used by search.
 */
exports.GetModelByName = function (req, res) {

    var parameter = req.body;
    req.body.params = {query: {name: parameter.name}};

    GetByCondition(req, res, ConfigInfo.DbTables.db_model);
};

/**
 * function GetModelById()
 * Get the model by model  id.
 * This function used by search.
 */
exports.GetModelById = function (req, res) {

    var parameter = req.body;
    req.body.params = {query: {id: parameter.id}};

    GetByCondition(req, res, ConfigInfo.DbTables.db_model);
};

/**
 * function GetModelByParentId()
 * Get the model by model parent id.
 * This function used by search.
 */
exports.GetModelByParentId = function (req, res) {

    var parameter = req.body;
    req.body.params = {query: {parentid: parameter.parentid}};

    GetByCondition(req, res, ConfigInfo.DbTables.db_model);
};

/**
 * function GetModelByCondition()
 * Get the model by model parent id.
 * This function used by search.
 */
exports.GetModelByCondition = function (req, res) {
    GetByCondition(req, res, ConfigInfo.DbTables.db_model);
};

/**
 * function AddModel()
 * Add the Model.
 */
exports.AddModel = function (req, res) {
    var param = utility.combineParams(req.body, true, []);

    var keys = param.keys + "create_by,last_modified",
        values = param.values + "'',now()";

    var insertQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_model + '(' + keys + ')VALUES(' + values + ')';

    QueryExecute(insertQuery, function (err, data) {
        res.json(data);
    });
};

/**
 * function DeleteModelById()
 * Delete the Model by model id.
 */
exports.DeleteModelById = function (req, res) {
    DeleteById(req, res, ConfigInfo.DbTables.db_model);
};

/**
 * function UpdateModel()
 * Update the Model.
 */
exports.UpdateModel = function (req, res) {

    var parameter = req.body;
    var param = utility.combineUpdateParam(parameter, ['id']);

    if (!param.result) {
        var result = utility.jsonResult(param.condition, '');
        res.json(result);
    }

    var condition = param.condition + "last_modified=now() WHERE id=" + pool.mysql.escape(parameter.id);

    var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_model + condition;

    QueryExecute(updateQuery, function (err, data) {
        res.json(data);
    });
};

//---------------------------End Model------------------------------------

//---------------------------User-------------------------------

/**
 * function GetUserList()
 * Get the user list.
 */
exports.GetUserList = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var queryParams = utility.parserQueryLike(req.body, 'user', true, ["username"], tenant);
        var selectQuery = 'SELECT user.*,g.id groupid,g.name groupname FROM ' + ConfigInfo.DbTables.db_user + ' user LEFT JOIN ' + ConfigInfo.DbTables.db_user_group + ' ug ON user.id=ug.userid LEFT JOIN ' + ConfigInfo.DbTables.db_group + ' g ON g.id=ug.groupid ' + queryParams.condition + queryParams.order + queryParams.limit;
        var selectQueryCount = 'SELECT count(0) cnt FROM ' + ConfigInfo.DbTables.db_user + ' user ' + queryParams.condition;
        ParallelExecuteQuery(res, selectQuery, selectQueryCount);
    });
};

/**
 * function GetUserByCondition()
 * Get the group list by user name.
 * This function used by search.
 */
exports.GetUserByCondition = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;


        var queryParams = utility.parserQueryLike(req.body, 'user', true, ["username"], tenant);
        var selectQuery = 'SELECT user.*,g.id groupid,g.name groupname FROM ' + ConfigInfo.DbTables.db_user + ' user LEFT JOIN ' + ConfigInfo.DbTables.db_user_group + ' ug ON user.id=ug.userid LEFT JOIN ' + ConfigInfo.DbTables.db_group + ' g ON g.id=ug.groupid ' + queryParams.condition + queryParams.order + queryParams.limit;
        var selectQueryCount = 'SELECT count(0) cnt FROM ' + ConfigInfo.DbTables.db_user + ' user ' + queryParams.condition;
        ParallelExecuteQuery(res, selectQuery, selectQueryCount);
    });
};

/**
 * function GetUserById()
 * Get the user list by user id.
 * This function used by search.
 */
exports.GetUserById = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        req.body.params = {query: {id: userId, tenant: tenant}};

        var queryParams = utility.parser(req.body, 'user');
        var selectQuery = 'SELECT user.*,g.id groupid,g.name groupname FROM ' + ConfigInfo.DbTables.db_user + ' user LEFT JOIN ' + ConfigInfo.DbTables.db_user_group + ' ug ON user.id=ug.userid LEFT JOIN ' + ConfigInfo.DbTables.db_group + ' g ON g.id=ug.groupid ' + queryParams.condition + queryParams.order + queryParams.limit;
        GetPermissionById(req, res, selectQuery, utility.User);
    });
};

exports.GetUserByToken = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        req.body.params = {query: {id: userId, tenant: tenant}};

        var queryParams = utility.parser(req.body, 'user');
        var selectQuery = 'SELECT user.*,g.id groupid,g.name groupname FROM ' + ConfigInfo.DbTables.db_user + ' user LEFT JOIN ' + ConfigInfo.DbTables.db_user_group + ' ug ON user.id=ug.userid LEFT JOIN ' + ConfigInfo.DbTables.db_group + ' g ON g.id=ug.groupid ' + queryParams.condition + queryParams.order + queryParams.limit;
        GetPermissionById(req, res, selectQuery, utility.User);
    });
};

/**
 * function AddUser()
 * Add the user.
 */
exports.AddUser = function (req, res) {

    var parameter = req.body;
    parameter.firstname = req.body.username;
    parameter.lastname = req.body.username;
    var param = utility.combineParams(parameter, false, ['groupid', 'permission', 'api', 'password']);
    var id = utility.NewGuid();

    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;
        password = '1qaz@WSX';

        if (parameter.password) {
            password = parameter.password;
        }

        var keys = param.keys + "id,tenant,create_by,create_on,last_modified",
            values = param.values + pool.mysql.escape(id) + "," + tenant + ",'',now(),now()";

        var insertUserQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_user + '(' + keys + ')VALUES(' + values + ')';

        var keys = 'userid,groupid,removed,last_modified';
        var values = pool.mysql.escape(id) + "," + pool.mysql.escape(parameter.groupid) + ",0,now()";

        // add the UserGroup
        var insertUserGroupQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_user_group + '(' + keys + ')VALUES(' + values + ')';

        async.parallel({
                api: function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = id;
                    option.permission = parameter.api;
                    InsertApi(option, utility.User, cb);
                },
                model: function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = id;
                    option.permission = parameter.permission;
                    InsertModel(option, utility.User, cb);
                },
                user: function (cb) {
                    QueryExecute(insertUserQuery, cb);
                },
                userSecurity: function (cb) {
                    var sha512 = crypto.createHash('sha512');
                    var passWord = sha512.update(password).digest('hex');
                    console.log(passWord);
                    var sqlAdminPwdSecurity = 'insert into core_usersecurity(tenant,userid,pwdhashsha512) values(' + tenant + ',' + pool.mysql.escape(id) + ',' + pool.mysql.escape(passWord) + ');';
                    QueryExecute(sqlAdminPwdSecurity, cb);
                },
                userGroup: function (cb) {
                    QueryExecute(insertUserGroupQuery, cb);
                }
            },
            function (err, result) {
                var resultObj = '';
                if (result.user.Result && result.userSecurity.Result) {
                    resultObj = utility.jsonResult('', {user: '用户入库成功！', userGroup: result.userGroup});
                } else {
                    resultObj = utility.jsonResult(err, {user: result.user, userGroup: result.userGroup, userSecurity: result.userSecurity});
                }

                res.json(resultObj);
            }
        );
    });
};

/**
 * function DeleteUserById()
 * Delete the user by user id.
 */
exports.DeleteUserById = function (req, res) {
    var id = req.body.id;

    var param = utility.combineDeleteQuery(req.body, ConfigInfo.DbTables.db_user);
    if (!param.result) {
        var result = utility.jsonResult(param.query, '');
        res.json(result);
    }

    var deleteUser = param.query;
    var deleteUserGroup = 'DELETE FROM ' + ConfigInfo.DbTables.db_user_group + ' WHERE userid=' + pool.mysql.escape(id);

    async.parallel({
            user: function (cb) {
                pool.ExecuteQuery(deleteUser, function (err, data) {
                    console.log(deleteUser);
                    cb(err, data);
                });
            },
            userGroup: function (cb) {
                pool.ExecuteQuery(deleteUserGroup, function (err, data) {
                    console.log(deleteUserGroup);
                    cb(err, data);
                });
            },
            permission: function (cb) {
                DeletePermissionById(id, 1, function (err, data) {
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var resultObj = '';
            if (result.user) {
                resultObj = utility.jsonResult('', '删除成功！');
            } else {
                resultObj = utility.jsonResult(err, result.user);
            }

            res.json(resultObj);
        }
    );
};

/**
 * function UpdateUser()
 * Update the user.
 */
exports.UpdateUser = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        var param = utility.combineUpdateParam(parameter, ['id', 'groupid', 'permission', 'api']);
        if (!param.result) {
            var result = utility.jsonResult(param.condition, '');
            res.json(result);
        }

        var condition = param.condition + "last_modified=now() WHERE id=" + pool.mysql.escape(parameter.id);

        var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_user + condition;

        // update the userGroup
        var updateUserGroupQuery = 'UPDATE ' + ConfigInfo.DbTables.db_user_group + " SET groupid=" + pool.mysql.escape(parameter.groupid) + ",last_modified=now() WHERE userid=" + pool.mysql.escape(parameter.id);
        ;
        var insertUserGroupQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_user_group + ' (userid,groupid,removed,last_modified)VALUES(' + pool.mysql.escape(parameter.id) + ',' + pool.mysql.escape(parameter.groupid) + ',0,now())';
        var selectUserGroupQuery = 'SELECT COUNT(*) cnt FROM ' + ConfigInfo.DbTables.db_user_group + ' WHERE userid=' + pool.mysql.escape(parameter.id);

        var deleteApiQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_api_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =1 and tenant=' + tenant;
        var deleteModelQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_model_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =1 and tenant=' + tenant;

        async.auto({
                updateUser: function (cb) {
                    QueryExecute(updateQuery, cb);
                },
                selectUserGroup: function (cb) {
                    QueryExecute(selectUserGroupQuery, cb);
                },
                updateUserGroup: ['selectUserGroup', function (cb, result) {
                    if (result && result.selectUserGroup.Data[0].cnt > 0) {
                        QueryExecute(updateUserGroupQuery, cb);
                    } else {
                        QueryExecute(insertUserGroupQuery, cb);
                    }
                }],
                deleteApi: function (cb) {
                    QueryExecute(deleteApiQuery, cb);
                },
                deleteModel: function (cb) {
                    QueryExecute(deleteModelQuery, cb);
                },
                addApi: ['deleteApi', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.api;
                    InsertApi(option, utility.User, cb);
                }],
                addModel: ['deleteModel', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.permission;
                    InsertModel(option, utility.User, cb);
                }]
            },
            function (err, result) {
                var resultObj = '';
                if (result.updateUser.Result) {
                    resultObj = utility.jsonResult('', {user: '用户更新成功！', model: result.addModel, api: result.addApi});
                } else {
                    resultObj = utility.jsonResult(err, {user: result.updateUser, model: result.addModel, api: result.addApi});
                }

                res.json(resultObj);
            }
        );
    });
};

exports.UpdateUserInformation = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;
        var param = utility.combineUpdateParam(parameter, ['id', 'groupid', 'permission', 'api']);
        if (!param.result) {
            var result = utility.jsonResult(param.condition, '');
            res.json(result);
        }

        var condition = param.condition + "last_modified=now() WHERE id=" + pool.mysql.escape(parameter.id) + " AND tenant=" + tenant;

        var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_user + condition;
        QueryExecute(updateQuery, function (err, data) {
            res.json(data);
        });
    });
};
//---------------------------End User-------------------------------

//---------------------------Start Api-------------------------------
exports.GetApiById = function (req, res) {
    var parameter = req.body;
    req.body.params = {query: {id: parameter.id}};

    GetByCondition(req, res, ConfigInfo.DbTables.db_api);
};

exports.GetApiByCondition = function (req, res) {
    GetByCondition(req, res, ConfigInfo.DbTables.db_api);
};

exports.AddApi = function (req, res) {
    var param = utility.combineParams(req.body, true, []);

    var keys = param.keys + "create_by,last_modified",
        values = param.values + "'',now()";

    var insertQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_api + '(' + keys + ')VALUES(' + values + ')';

    QueryExecute(insertQuery, function (err, result) {
        res.json(result);
    });
};

exports.DeleteApiById = function (req, res) {
    DeleteById(req, res, ConfigInfo.DbTables.db_api);
};

exports.UpdateApi = function (req, res) {
    var parameter = req.body;
    var param = utility.combineUpdateParam(parameter, ['id']);

    if (!param.result) {
        var result = utility.jsonResult(param.condition, '');
        res.json(result);
    }

    var condition = param.condition + "last_modified=now() WHERE id=" + pool.mysql.escape(parameter.id);

    var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_api + condition;

    QueryExecute(updateQuery, function (err, result) {
        res.json(result);
    });
};

//---------------------------End Api---------------------------------

//---------------------------Start Password---------------------------------
exports.UpdatePassword = function (req, res) {
    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var sha512 = crypto.createHash('sha512'),
            password = sha512.update(req.body.password).digest('hex');
        var resha512 = crypto.createHash('sha512'),
            repassword = resha512.update(req.body.repassword).digest('hex');

        async.auto({
                getPassword: function (cb) {
                    var sqlQuery = "SELECT COUNT(0) cnt FROM  core_usersecurity WHERE tenant=" + tenant + " and userid=" + pool.mysql.escape(userId) + " and pwdhashsha512=" + pool.mysql.escape(password);
                    pool.ExecuteQuery(sqlQuery, function (err, data) {
                        console.log(sqlQuery);
                        cb(err, data[0]);
                    });
                },
                userSecurity: ["getPassword", function (cb, result) {
                    if (result.getPassword && result.getPassword.cnt > 0) {
                        var sqlAdminPwdSecurity = 'UPDATE core_usersecurity SET pwdhashsha512=' + pool.mysql.escape(repassword) + ' WHERE userid=' + pool.mysql.escape(userId) + " AND tenant=" + tenant;
                        QueryExecute(sqlAdminPwdSecurity, cb);
                    } else {
                        cb("密码不正确！", "");
                    }
                }]
            },
            function (err, result) {
                var resultObj = '';
                if (result.userSecurity) {
                    resultObj = utility.jsonResult('', "密码修改成功！");
                } else {
                    resultObj = utility.jsonResult(err, result.userSecurity);
                }

                res.json(resultObj);
            }
        );
    });
};

exports.ResetPassword = function (req, res) {
    var userId = req.body.userId,
        resetPassword = req.body.password || utility.ResetPassword;

    var sha512 = crypto.createHash('sha512'),
        password = sha512.update(resetPassword).digest('hex');

    var sqlAdminPwdSecurity = 'UPDATE core_usersecurity SET pwdhashsha512=' + pool.mysql.escape(password) + ' WHERE userid=' + pool.mysql.escape(userId);
    QueryExecute(sqlAdminPwdSecurity, function (err, result) {
        res.json(result);
    });
};
//---------------------------End Password---------------------------------


//---------------------------Start Common Function-------------------------------
function ParallelExecuteQuery(res, selectQuery, selectQueryCount) {
    async.parallel({
            rowcount: function (cb) {
                pool.ExecuteQuery(selectQueryCount, function (err, data) {
                    console.log(selectQueryCount);
                    cb(err, data[0].cnt);
                });
            },
            data: function (cb) {
                pool.ExecuteQuery(selectQuery, function (err, data) {
                    console.log(selectQuery);
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var resultObj = utility.jsonResult(err, result.data, result.rowcount);
            res.json(resultObj);
        }
    );
}

function GetByCondition(req, res, dbTable) {
    var queryParams = utility.parser(req.body);

    var selectQuery = 'SELECT * FROM ' + dbTable + queryParams.condition + queryParams.order + queryParams.limit;
    var selectQueryCount = 'SELECT count(0) cnt FROM ' + dbTable + queryParams.condition;

    ParallelExecuteQuery(res, selectQuery, selectQueryCount);
}

function GetPermissionById(req, res, selectQuery, type) {
    async.parallel({
            permission: function (cb) {
                GetPermissionList(req, type, cb);
            },
            data: function (cb) {
                pool.ExecuteQuery(selectQuery, function (err, data) {
                    console.log(selectQuery);
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var permission = result.permission;
            var data = result.data;

            if (data && data.length == 1) {
                data[0].permission = permission.model;
                data[0].api = permission.api;
            }

            var resultObj = utility.jsonResult(err, data);
            res.json(resultObj);
        }
    );
}

function DeletePermissionById(id, type, callback) {

    var deleteModelQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_model_subscription + ' WHERE id=' + pool.mysql.escape(id) + ' and type=' + type;
    var deleteApiQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_api_subscription + ' WHERE id=' + pool.mysql.escape(id) + ' and type=' + type;

    async.parallel({
            model: function (cb) {
                pool.ExecuteQuery(deleteModelQuery, function (err, data) {
                    console.log(deleteModelQuery);
                    cb(err, data);
                });
            },
            api: function (cb) {
                pool.ExecuteQuery(deleteApiQuery, function (err, data) {
                    console.log(deleteApiQuery);
                    cb(err, data);
                });
            }
        },
        function (err, result) {
            var resultObj = {model: result.model, api: result.api};
            callback(err, resultObj);
        }
    );
}

function UpdatePermission(req, res, type) {

    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;
        var parameter = req.body;

        var deleteApiQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_api_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =' + type + ' and tenant=' + tenant;
        var deleteModelQuery = 'DELETE FROM ' + ConfigInfo.DbTables.db_model_subscription + ' WHERE id=' + pool.mysql.escape(parameter.id) + ' and type =' + type + ' and tenant=' + tenant;

        async.auto({
                deleteApi: function (cb) {
                    QueryExecute(deleteApiQuery, cb);
                },
                deleteModel: function (cb) {
                    QueryExecute(deleteModelQuery, cb);
                },
                addApi: ['deleteApi', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.api;
                    InsertApi(option, type, cb);
                }],
                addModel: ['deleteModel', function (cb) {
                    var option = {};
                    option.tenant = tenant;
                    option.id = parameter.id;
                    option.permission = parameter.permission;
                    InsertModel(option, type, cb);
                }]
            },
            function (err, result) {
                var resultObj = utility.jsonResult(err, {deletApi: result.deletApi, deleteModel: result.deleteModel, addApi: result.addApi, addModel: result.addModel});
                res.json(resultObj);
            }
        );
    });
}

function DeleteById(req, res, dbTable) {
    var param = utility.combineDeleteQuery(req.body, dbTable);
    if (!param.result) {
        var result = utility.jsonResult(param.query, '');
        res.json(result);
    }
    var deleteQuery = param.query;

    QueryExecute(deleteQuery, function (err, data) {
        res.json(data);
    });
}

function GetPermissionValues(option, type) {
    var permissionString = option.permission,
        json = {result: false, values: ''};

    if (!permissionString || permissionString == "") {
        return json;
    }
    var permissionArray = permissionString.split("#;");

    for (var permission in permissionArray) {
        json.result = true;
        json.values += "(" + pool.mysql.escape(option.tenant) + "," + pool.mysql.escape(option.id) + "," + pool.mysql.escape(permissionArray[permission]) + "," + type + ",now()),";
    }

    json.values = json.values.substr(0, json.values.length - 1);

    return json;
}

function InsertModel(option, type, cb) {
    var modelValues = GetPermissionValues(option, type);
    var insertModelQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_model_subscription + ' VALUES' + modelValues.values + ';';
    if (modelValues.result) {
        QueryExecute(insertModelQuery, cb);
    } else {
        cb('', '模块权限为空，不进行入库操作!');
    }
}

function InsertApi(option, type, cb) {
    var apiValues = GetPermissionValues(option, type);
    var insertApiQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_api_subscription + ' VALUES' + apiValues.values + ';';
    if (apiValues.result) {
        QueryExecute(insertApiQuery, cb);
    } else {
        cb('', 'Api权限为空，不进行入库操作!');
    }
}

function QueryExecute(sqlQuery, cb) {
    pool.ExecuteQuery(sqlQuery, function (err, data) {
        console.log(sqlQuery);
        var re = utility.jsonResult(err, data);
        cb(err, re);
    });
}

function GetPermissionList(req, type, callback) {

    GetTokenInformation(req, function (clientInfo) {
        var userId = clientInfo.UserID,
            tenant = clientInfo.TenantID;

        var parameter = req.body;

        var selectModelQuery = 'SELECT m.* FROM ' + ConfigInfo.DbTables.db_model + ' m LEFT JOIN ' + ConfigInfo.DbTables.db_model_subscription + ' s ON m.id=s.model  WHERE s.id=' + pool.mysql.escape(parameter.id) + ' and s.type=' + type + ' and s.tenant=' + tenant;
        var selectApiQuery = 'SELECT a.* FROM ' + ConfigInfo.DbTables.db_api + ' a LEFT JOIN ' + ConfigInfo.DbTables.db_api_subscription + ' s ON a.id=s.api WHERE s.id=' + pool.mysql.escape(parameter.id) + ' and s.type=' + type + ' and s.tenant=' + tenant;

        async.parallel({
                model: function (cb) {
                    pool.ExecuteQuery(selectModelQuery, function (err, data) {
                        console.log(selectModelQuery);
                        cb(err, data);
                    });
                },
                api: function (cb) {
                    pool.ExecuteQuery(selectApiQuery, function (err, data) {
                        console.log(selectApiQuery);
                        cb(err, data);
                    });
                }
            },
            function (err, result) {
                    var resultObj = {model: result.model, api: result.api};
                callback(err, resultObj);
            }
        );
    });
}

//function GetTokenInformation(req, next) {
//    var clientInfo = req.signedCookies.AuthenticationToken //点击了记住我
//        || req.session.AuthenticationToken//未点击记住我
//        || req.headers.authentication;//来自Mobile
//
//    if (typeof(clientInfo) == 'object') {
//        next(clientInfo);
//    }
//    else {
//        TokenVerification.GetUserInformationByToken(clientInfo, function (isFetch, clientInfo) {
//            if (isFetch) {
//                next(clientInfo);
//            }
//        });
//    }
//}

//---------------------------End Common Function-------------------------------

//---------------------------End Permission-------------------------------

//---------------------------End Permission-------------------------------

//---------------------------End Permission-------------------------------