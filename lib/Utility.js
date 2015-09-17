/**
 * Created by QingWang on 2014/8/6.
 */
var mysql = require('mysql');
var JsonResult = require('./JsonResult');
var chance = require('chance');
var fs = require('fs');

function Utility () {
}

/*
 * function parser(obj)
 * [Array] obj : this is a dictionary contains orderby,query,pagination or null
 *
 * This is function is parser the dictionary to sql where condition and return it.
 *
 */
Utility.prototype.parser = function (obj, alias) {

    var params = obj.params;

    if (!params || params == 'undefined') {
        params = {
            orderby: null,
            query: null,
            pagination: null
        };
    }

    //表的别名
    var d = '';
    if (alias) {
        d = alias + '.';
    }

    var orderBy = params.orderby;//排序
    var query = params.query;//查询参数
    var pagination = params.pagination;//分页参数

    //sql where condition
    var condition = " WHERE 1=1 ";

    if (query) {
        for (var item in query) {
            condition += " and " + d + item + "=" + mysql.escape(query[item]);
        }
    }

    //order by
    var orderColumnCount = 0;
    var order = " ";

    if (orderBy) {
        order = " order by ";
        for (var item in orderBy) {
            orderColumnCount++;
            order += (item + " " + orderBy[item] + ",");
        }

        if (orderColumnCount == 0) {
            order = "";
        }
        else {
            order = order.substring(0, order.length - 1);//移除最后一个逗号
        }
    }

    // pagination
    var limit = " ";
    if (pagination) {
        limit = " limit " + parseInt(pagination.pagesize) * parseInt(pagination.pageindex) + "," + pagination.pagesize;
    }

    return {condition: condition, order: order, limit: limit};
};

Utility.prototype.parserQueryLike = function (obj, alias, isLike, includeField, tenant) {

    var params = obj.params;

    if (!params || params == 'undefined') {
        params = {
            orderby: null,
            query: null,
            pagination: null
        };
    }

    //表的别名
    var d = '';
    if (alias != '') {
        d = alias + '.';
    }

    var orderBy = params.orderby;//排序
    var query = params.query;//查询参数
    var pagination = params.pagination;//分页参数

    //sql where condition
    var condition = " WHERE 1=1 ";

    if (query) {
        for (var item in query) {
            if (isLike && this.contains(includeField, item)) {
                condition += " and (lower(" + d + item + ") like '%" + query[item].toLowerCase() + "%')";
            } else {
                condition += " and lower(" + d + item + ")=" + mysql.escape(query[item].toLowerCase());
            }
        }
    }

    if (tenant) {
        condition += " and " + d + "tenant=" + tenant;
    }

    //order by
    var orderColumnCount = 0;
    var order = " ";

    if (orderBy) {
        order = " order by ";
        for (var item in orderBy) {
            orderColumnCount++;
            order += (item + " " + orderBy[item] + ",");
        }

        if (orderColumnCount == 0) {
            order = "";
        }
        else {
            order = order.substring(0, order.length - 1);//移除最后一个逗号
        }
    }

    // pagination
    var limit = " ";
    if (pagination) {
        limit = " limit " + parseInt(pagination.pagesize) * parseInt(pagination.pageindex) + "," + pagination.pagesize;
    }

    return {condition: condition, order: order, limit: limit};
};

/*
 * function combineParams(params,isAddId)
 * [Array] params : this is a dictionary contains request paramters.
 * [boolean] isAddId: this is a boolean type, whether or not create guid.
 * [Array] exceptArray:this is a except parameters array.
 *
 * This is function is combin the insert sql parameters and return it.
 *
 */
Utility.prototype.combineParams = function (params, isAddId, exceptArray) {
    var keys = '',
        values = '';

    if (isAddId) {
        params.id = this.NewGuid();
    }

    for (var item in params) {
        if (this.contains(exceptArray, item)) {
            continue;
        }
        keys += item + ',';
        values += mysql.escape(params[item]) + ",";
    }

    return {keys: keys, values: values};
};

/*
 * function combineDeleteQuery(parameter,dbtable)
 * [Array] parameter : this is a dictionary contains request paramters.
 * [String] dbtable: this is a database table.
 *
 * This is function is combin the delete sql parameters and return it.
 *
 */
Utility.prototype.combineDeleteQuery = function (parameter, dbtable) {
    var condition = '',
        result = false,
        deleteQuery = '';

    if (parameter.id != '') {
        condition = ' WHERE id=' + mysql.escape(parameter.id);
        deleteQuery = 'DELETE FROM ' + dbtable + condition;
        result = true;
    } else {
        deleteQuery = "输入的参数id为空，不能进行删除操作！";
    }

    return {result: result, query: deleteQuery};
};

/*
 * function combineUpdateParam(parameter,exceptArray)
 * [Array] parameter : this is a dictionary contains request paramters.
 * [Array] exceptArray: this is a except parameters array.
 *
 * This is function is combin the update sql parameters condition and return it.
 *
 */
Utility.prototype.combineUpdateParam = function (parameter, exceptArray) {
    var condition = ' SET ',
        result = false;

    for (var item in parameter) {
        result = true;
        if (this.contains(exceptArray, item)) {
            continue;
        }
        condition += item + "=" + mysql.escape(parameter[item]) + ",";
    }

    if (!result) {
        condition = "更新的参数为空，所以不能进行更新！";
    }

    return {result: result, condition: condition};
};

/*
 * function jsonResult(err,data,cnt)
 * [Error] err : error message.
 * [Array] data: the data from the database.
 * [int] cnt: the pagination totalcount.
 *
 * This is function return the json object.
 *
 */
Utility.prototype.jsonResult = function (err, data, cnt) {
    var jsonResult = new JsonResult();
    jsonResult.Result = true;
    jsonResult.Message = '';
    jsonResult.Data = data;

    if (cnt) {
        jsonResult.TotalCount = cnt;
    }

    if (err) {
        jsonResult.Result = false;
        jsonResult.Message = err;
        jsonResult.Data = '';
    }

    return jsonResult;
};

/*
 * function contains(arr,item)
 * [Array] arr : Array.
 * [string] item : item.
 *
 * This is function Array extention.
 *
 */
Utility.prototype.contains = function (arr, item) {
    return RegExp(item).test(arr);
};

Utility.prototype.NewGuid = function () {
    return new chance().guid();
};

Utility.prototype.isValidData = function (data) {
    return data !== undefined && data !== "" && data !== null;
};

Utility.prototype.Group = 0;

Utility.prototype.User = 1;

Utility.prototype.ResetPassword = "123456";

Utility.prototype.ParamToJson = function (tpParam) {
    if (tpParam) {
        var paramsObj = typeof(tpParam) == "object" ? tpParam : JSON.parse(tpParam);
        return paramsObj;
    }

    return tpParam;
};

Utility.prototype.JsonToParamString = function (tpParam) {
    if (tpParam) {
        var paramsStr = typeof(tpParam) == "string" ? tpParam : JSON.stringify(tpParam);
        return paramsStr;
    }

    return tpParam;
};

Utility.prototype.ParamsParse = function (tpParam) {
    var params = this.ParamToJson(tpParam);

    if (!params || params == 'undefined') {
        params = {
            orderby: null,
            query: null,
            pagination: null
        };
    }

    if (!params.orderby) {
        params.orderby = {};
    }
    if (!params.query) {
        params.query = {};
    }
    if (!params.pagination) {
        params.pagination = {};
    }

    return params;
};

Utility.prototype.GetLastAppFile = function (path, versionCode, domainUrl, callback) {
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log('error:\n' + err);
            return callback(err, {success: false, apkurl: ''});
        }
        var success = false;
        var returnVersion = versionCode.replace(/\./g, '');
        var returnFile = '';
        files.forEach(function (file) {
            var res = file.match(/app_(\d+\.(\d+\.)+\d+).apk/); //没有使用g选项
            var version = res[1].replace(/\./g, '');
            if (parseInt(version) > parseInt(returnVersion)) {
                returnVersion = version;
                returnFile = domainUrl + "/android/" + file;
                success = true;
            }
        });

        callback(err, {success: success, apkurl: returnFile});
    });
};

module.exports = new Utility();


