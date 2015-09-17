var utility = require('../lib/Utility');
var ConfigInfo = require('../Config');
var pool = require('../lib/DbHelper');
//var pool = new DbHelper();
var redisHelper = require('../lib/RedisHelper.js');

var EmergencyPlan = function () {
    this.id = 0;
    this.name = '';
    this.title = '';
    this.phone = '';
    this.content = '';
    this.url = '';
    this.contacts = '';
    this.createDt = '';
    this.updateBy = '';
    this.updateDt = '';
    this.state = '';
    this.classify = 1;
    this.polarity = 0;
    this.customer_name = '';
    this.field_name = '';
    this.brand_name = '';
};

/*get EmergencyPlan by id API method(get)*/
exports.GetEmergencyPlanById = function (req, res) {
    var clientInfo = req.session.clientInfo;
    if (!utility.isValidData(req.query.id)) {
        var msg = "please pass the emergencyPlan id!";
        //console.error(msg);
        res.send({
            success: false,
            msg: msg
        });
        return;
    }
    var id = req.query.id;
    var sql = "select * from b_emergency_plan where is_deleted=0 and id=? and customer_name=?";
    var sql_params = [id, clientInfo.CustomName];
    pool.ExecuteQuery(sql, sql_params, function (error, result) {
        if (error) {
            //console.log(error);
            res.send({
                success: false,
                msg: error
            });
            return;
        }
        if (result.length == 0) {
            var msg = 'did not find the data';
            //console.log(msg);
            res.send({
                success: false,
                msg: msg
            });
            return;
        } else {
            res.send({
                success: true,
                data: result
            });
        }
    });
};

/*get EmergencyPlan By Condition API method(post)*/
exports.GetEmergencyPlanByCondition = function (req, res) {
    var clientInfo = req.session.clientInfo;
    var params = utility.ParamsParse(req.body.params);
    var orderBy = params.orderby; //排序
    var query = params.query; //查询参数
    var pagination = params.pagination; //分页参数

    var sql = "select * from b_emergency_plan where is_deleted = 0 ";
    var sqlParams = [];
    if (utility.isValidData(query.title)) {
        sql += "and title like('%\\" + query.title + "%') ";
    }
    if (utility.isValidData(query.content)) {
        sql += "and content like('%\\" + query.content + "%') ";
    }
    if (utility.isValidData(query.contacts)) {
        sql += "and contacts like('%\\" + query.contacts + "%') ";
    }
    if (utility.isValidData(query.classify)) {
        sql += "and classify=?";
        sqlParams.push(query.classify);
    }
    if (utility.isValidData(query.polarity)) {
        sql += " and polarity =?";
        sqlParams.push(query.polarity);
    }
    if (clientInfo != null && clientInfo != false) {
        sql += " and customer_name =?";
        sqlParams.push(clientInfo.CustomName);
    }
    if (utility.isValidData(query.field_name)) {
        sql += " and field_name = ?";
        sqlParams.push(query.field_name);
    }
    if (utility.isValidData(query.brand_name)) {
        sql += " and brand_name = ?";
        sqlParams.push(query.brand_name);
    }
    var queryCountSql = sql.replace("*", "count(0) 'count'");
    //排序
    var orderColumnCount = 0;
    sql += " order by ";
    for (var order in orderBy) {
        orderColumnCount++;
        sql += (order + " " + orderBy[order] + ",");
    }
    if (orderColumnCount = 0) {
        sql = sql.replace(" order by ", "");
    } else {
        sql = sql.substring(0, sql.length - 1); //移除最后一个逗号
    }
    sql += " limit " + parseInt(pagination.pagesize) * parseInt(pagination.pageindex) + "," + pagination.pagesize;
    //console.log(sql);
    pool.ExecuteQuery(sql, sqlParams, function (err, rows) {
        if (err) {
            //console.error(err);
            res.send({
                success: false,
                msg: err
            });
            return;
        }
        var data = {
            success: true,
            totalcount: 0,
            rows: rows
        };
        pool.ExecuteQuery(queryCountSql, sqlParams, function (error, result) {
            if (error) {
                //console.log(error);
                res.send({
                    succsss: false,
                    msg: error
                });
                return;
            }
            //console.log(result[0].count);
            data.totalcount = result[0].count;
            res.send(data);
        });
    });
};

/*add emergencyPlan API method(post)*/
exports.AddEmergencyPlan = function (req, res) {
    var clientInfo = req.session.clientInfo;

    if (req.body.title == undefined || req.body.title == "" || req.body.title == null) {
        var msg = "title can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    if (req.body.classify == undefined || req.body.classify == "" || req.body.classify == null) {
        var msg = "classify can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    if (req.body.polarity == undefined || req.body.polarity == "" || req.body.polarity == null) {
        var msg = "polarity can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    var obj = new EmergencyPlan();
    obj.title = req.body.title;
    obj.phone = req.body.phone;
    obj.content = req.body.content;
    obj.url = req.body.url;
    obj.contacts = req.body.contacts;
    obj.classify = req.body.classify;
    obj.polarity = req.body.polarity;
    if (utility.isValidData(req.body.field_name)) {
        obj.field_name = req.body.field_name;
    }
    if (utility.isValidData(req.body.brand_name)) {
        obj.brand_name = req.body.brand_name;
    }
    if (clientInfo != null && clientInfo != false) {
        obj.customer_name = clientInfo.CustomName;
    }
    var checkIsExistsSql = "select count(0) as count from b_emergency_plan where title = ? and customer_name = ? and is_deleted = false";
    var checkParams = [obj.title, obj.customer_name];
    pool.ExecuteQuery(checkIsExistsSql, checkParams, function (error, result) {
        if (error) {
            console.error(error);
            res.send(utility.jsonResult(error));
            return;
        }
        if (result[0].count > 0) {
            res.send(utility.jsonResult('已经存在此名称的应急预案!'));
        }
        else {
            var sql = "insert into b_emergency_plan(title,work_phone,content,url,contacts,createDt,classify,polarity,field_name,brand_name,customer_name) values(?,?,?,?,?,now(),?,?,?,?,?);";
            var sql_params = [obj.title, obj.phone, obj.content, obj.url, obj.contacts, obj.classify, obj.polarity, obj.field_name, obj.brand_name, obj.customer_name];
            pool.ExecuteQuery(sql, sql_params, function (error, result) {
                if (error) {
                    console.log(error);
                    res.send(utility.jsonResult(error));
                    return;
                }
                var affectedRows = result.affectedRows;
                if (affectedRows > 0) {
                    redisHelper.cleanKey("b_emergency_plan");
                    res.send(utility.jsonResult(null, '添加成功'));
                }
                else {
                    res.send(utility.jsonResult('添加失败'));
                }
            });
        }
    });
};

/*delete emergencyPlan by id API method(get)*/
exports.DeleteEmergencyPlanByID = function (req, res) {
    var id = req.query.id;
    if (id == undefined || id == null || id == "") {
        var msg = "please chose the emergency_plan which you want to delete";
        //console.log(msg);
        res.send({
            success: false,
            msg: msg
        });
        return;
    }
    var sql = "update b_emergency_plan set is_deleted=1 where id=?";
    var sql_params = id;
    pool.ExecuteQuery(sql, sql_params, function (error, result) {
        if (error) {
            console.log(error);
            res.send({
                success: false,
                msg: error
            });
            return;
        }
        var affectedRows = result.affectedRows;
        if (affectedRows > 0) {
            redisHelper.cleanKey("b_emergency_plan");
            res.send({
                success: true
            });
        }
        else {
            res.send({
                success: false
            });
        }

    });
};

/*update emergencyPlan API method(post)*/
exports.UpdateEmergencyPlan = function (req, res) {
    var clientInfo = req.session.clientInfo;
    if (!utility.isValidData(req.body.id)) {
        var msg = "please chose the update EmergencyPlan id!";
        res.send(utility.jsonResult(msg));
        return;
    }
    if (!utility.isValidData(req.body.title)) {
        var msg = "title can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    if (!utility.isValidData(req.body.classify)) {
        var msg = "classify can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    if (!utility.isValidData(req.body.polarity)) {
        var msg = "polarity can not empty!";
        res.send(utility.jsonResult(msg));
        return;
    }
    var obj = new EmergencyPlan();
    var sqlParams = [];
    obj.id = req.body.id;
    obj.title = req.body.title;
    if (utility.isValidData(req.body.phone)) {
        obj.phone = req.body.phone;
    }
    if (utility.isValidData(req.body.content)) {
        obj.content = req.body.content;
    }
    obj.url = req.body.url;
    obj.contacts = req.body.contacts;
    obj.classify = req.body.classify;
    obj.polarity = req.body.polarity;
    obj.updateBy = clientInfo.CustomName;
    var checkIsExistsSql = "select count(0) as count from b_emergency_plan where title = ? and customer_name = ? and is_deleted = false and id <> ?";
    var checkParams = [obj.title, clientInfo.CustomName, obj.id];
    pool.ExecuteQuery(checkIsExistsSql, checkParams, function (error, result) {
        if (error) {
            res.send(utility.jsonResult(error));
            return;
        }
        if (result[0].count > 0) {
            res.send(utility.jsonResult('已经存在此名称的应急预案!'));
        }
        else {
            var sql = "update b_emergency_plan set title=?,work_phone=?,content=?,url=?,contacts=?,classify=?,polarity=?,updateDt=now(),updateBy=? where is_deleted=0 and id=?";
            var sql_params = [obj.title, obj.phone, obj.content, obj.url, obj.contacts, obj.classify, obj.polarity, obj.updateBy, obj.id ];
            pool.ExecuteQuery(sql, sql_params, function (error, result) {
                if (error) {
                    res.send(utility.jsonResult(error));
                    return;
                }
                var affectedRows = result.affectedRows;
                if (affectedRows > 0) {
                    redisHelper.cleanKey("b_emergency_plan");
                    res.send(utility.jsonResult(null, '修改成功'));
                }
                else {
                    res.send(utility.jsonResult('修改失败'));
                }
            });
        }
    });
}
