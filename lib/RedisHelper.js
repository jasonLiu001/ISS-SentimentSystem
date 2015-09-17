/**
 * Created by Wanji on 2014/9/11.
 */
var config = require('../Config.js');
//var Configuration = new ConfigInfo();
var redis = require("redis");

function RedisHelper() {
    this.Client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    this.Client.on('error', function (err) {
        console.log("Connection Error:", err);
    });
};

RedisHelper.prototype.set = function (key, value, expires) {
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        return;
    });
    client.set(key, value);
    client.expire(key, expires || config.RedisSettings.expires);
    client.quit();
};

RedisHelper.prototype.get = function (key, callback) {
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        return;
    });
    client.get(key, function (err, value) {
        if (err) {
            client.quit();
            console.log('RedisHelper get error' + err);
            callback(false);
        }
        callback(value);
        client.quit();
    });
};

RedisHelper.prototype.del = function (key) {
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        return;
    });
    client.del(key, function (err, reply) {
        if (err) {
            console.error(err);
        }
        if (reply > 0) {
            console.log('RedisHelper del success')
        }
        else {
            console.log('RedisHelper del error' + err);
        }
        client.quit();
    });
};

RedisHelper.prototype.cleanAll = function (cb) {
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        cb(err);
    });
    client.send_command("flushdb", [], function (err) {
        if (err) {
            console.error(err);
        }
        client.quit();
        cb(err);
    });
};

RedisHelper.prototype.cleanKey = function (key) {
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        return;
    });

    if (key == "PROD" || key == "SIT" || key == "DEV") {
        client.keys(key + "_*", function (err, value) {
            if (value && value.length > 0) {
                value.forEach(function (item) {
                    client.del(item, function (err) {
                        if (err) {
                            client.quit();
                            return;
                        }
                        console.log("clean " + value);
                    });
                });
                client.quit();
            }
        });
    }
    else {
        client.keys(config.BasicSettings.environment + "_" + key + "_*", function (err, value) {
            if (value && value.length > 0) {
                value.forEach(function (item) {
                    client.del(item, function (err) {
                        if (err) {
                            client.quit();
                            return;
                        }
                        console.log("clean " + value);
                    });
                });
            }
            client.quit();
        });
    }
};

module.exports = new RedisHelper();