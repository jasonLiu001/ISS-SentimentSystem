/**
 * Created by QingWang on 2014/7/21.
 * Useage:
 *  var DbConfigInfo            = require('../lib/DbConfigInfo');
 *  var DbHelper                = require('../lib/DbHelper');
 *
 *  var ConfigInfo              = new DbConfigInfo();
 *  var pool                    = new DbHelper(ConfigInfo.LocalDB);
 *  pool.Execute(....);
 *  pool.ExecuteQuery(....);
 *  pool.mysql.escape(field);
 *  and so on.
 *
 */

var mysql = require("mysql");
var redisHelper = require('../lib/RedisHelper.js');
var ConfigInfo = require('../Config.js');
var crypto = require('crypto');

function DbHelper(config) {
    this.config = config ? config : ConfigInfo.BasicSettings.currentDB;
    this.pool = mysql.createPool(this.config);
    this.mysql = mysql;
}

/* This code not used.

 DbHelper.prototype.Execute = function (sqlparameter, callback) {
 var that = this;

 var jsonResult = new JsonResult();
 jsonResult.Result = false;

 that.pool.getConnection(function (err, connection) {
 if (err) {
 jsonResult.Data = err;
 jsonResult.Message = err;
 callback(jsonResult);
 }

 // Use the connection
 connection.query(sqlparameter.Query, function (err, rows) {
 // And done with the connection.

 if (err) {
 jsonResult.Data = err;
 jsonResult.Message = err;
 return callback(jsonResult);
 //throw err;
 }

 jsonResult.Data = rows;
 jsonResult.Message = "";
 jsonResult.Result = true;
 callback(jsonResult);
 connection.release();
 });
 });
 };
 */

DbHelper.prototype.ExecuteQuery = function (query, params, cb) {
    var that = this;
    console.log('*********************************************************************************');
    console.log({'SQL':query,'PARAMETER':params});
    console.log('*********************************************************************************');
    if (typeof(params) == 'function') {
        cb = params;
        params = null;
    }
    if (query.search(/update/i) >= 0 || query.search(/insert/i) >= 0 || query.search(/delete/i) >= 0) {
        that.pool.query(query, params, function (err, res) {
            //result = JSON.stringify(res);
            //redisHelper.set(redisKey, result, ConfigInfo.RedisSettings.dataExpires);
            cb(err, res);
        });
    }
    else {
        var arrTables = query.match(/(from\s+(\`*\w+\`*)\s*)+/gi);
        var tableString = query;
        if (arrTables) {
            tableString = arrTables.join("_").trim().replace(/\`/gi, "").replace(/from/gi, "").replace(/\s/gi, "");
        }

        var redisKey = query;
        if (params) {
            redisKey += params.toString();
        }
        //console.log("Init Key:"+redisKey);
        var sha512 = crypto.createHash('sha1');
        redisKey = sha512.update(redisKey).digest('hex');
        //console.log("Redis Key: "+redisKey);
        redisKey = ConfigInfo.BasicSettings.environment + "_" + tableString + "_" + redisKey;
        redisHelper.get(redisKey, function (value) {
            var result = "";
            if (value != null && value != false) {
                result = JSON.parse(value);
                cb("", result);
            }
            else {
                that.pool.query(query, params, function (err, res) {
                    result = JSON.stringify(res);
                    redisHelper.set(redisKey, result, ConfigInfo.RedisSettings.dataExpires);
                    cb(err, res);
                });
            }
        });
    }
}

DbHelper.prototype.ExecuteQueryNoCache = function (query, params, cb) {
    var that = this;
    console.log('*********************************************************************************');
    console.log({'SQL':query,'PARAMETER':params});
    console.log('*********************************************************************************');
    if (typeof(params) == 'function') {
        cb = params;
        params = null;
    }
    that.pool.query(query, params, function (err, res) {
        cb(err, res);
    });
}

module.exports = new DbHelper();