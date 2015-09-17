/**
 * Created by wang on 2014/9/3.
 */
var redis = require('../lib/RedisHelper.js');
var config = require("../Config.js");
var spawn = require('child_process').spawn;

exports.webDeploy = function (req, res) {
    var env = req.params.env;
    var ver=req.query.ver;
    if (env) {
        var linuxShell = spawn(config.BasicSettings.linuxShellUrl, [env,ver]);

        linuxShell.on("error", function (err) {
            res.send({success: false, message: err.message});
            res.end();
            return;
        });

        linuxShell.on('exit', function (code) {
            res.send({success: true, message: code});
            res.end();
            return;
        });

        //res.send({success: true, message: "OK"});
    }
};

exports.cleanAllData = function (req, res) {
    redis.cleanAll(function (err) {
        if (!err) {
            res.send({success: true, message: "OK"});
        }
    });
};

exports.cleanRedisData = function (req, res) {
    var env = req.params.env;
    if (env) {
        redis.cleanKey(env.toUpperCase());
        res.send({success: true, message: "OK"});
    }
};