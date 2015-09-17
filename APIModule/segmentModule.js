/**
 * Created by wang on 2014/9/18.
 */

var ConfigInfo = require('../Config');
var async = require("async");
var pool = require('../lib/DbHelper');
//var pool = new DbHelper();
var utility = require('../lib/Utility');
var easypost = require('easypost');
var Segment = require('segment').Segment;
var fs = require('fs');
var path = require('path');
var dictFileName = path.resolve("lib", "dict/", "./grade.txt");
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

//var L = require("_linklist");
var redis = require('redis');

//分词处理
exports.newsSegment = function (req, res) {
    easypost.get(req, res, function (data) {
        var segmentWords = segment.doSegment(data.newsContent);
        res.send(segmentWords);
    });
};

exports.gradeSplit = function (req, res) {
    easypost.get(req, res, function (data) {
        var segmentWords = segment.doSegment(data.newsContent);
        var grade = gradeSplit(segmentWords);
        res.send(grade);
    });
};

//极性划分
function gradeSplit(words) {
    var splitResult = {};
    var totalScore = 0;//总分
    var positiveScore = 0;//正得分
    var negativeScore = 0;//负得分
    var positiveWords = [];//正情感词集合
    var positiveWordsCount = 0;//正得分单词数
    var negativeWordsCount = 0;//负得分单词数
    var negativeWords = [];//负情感词集合
    var noScoreWordsCount = 0;//没有情感倾向词个数

    if (!fs.existsSync(dictFileName)) {
        throw Error('Cannot find dict file "' + dictFileName + '".');

    } else {
        var data = fs.readFileSync(dictFileName, 'utf8');
        data = data.split(/\r?\n/);

        for (var wordIndex in words) {
            var word = words[wordIndex];
            for (var dictIndex in data) {
                var line = data[dictIndex];
                var blocks = line.split('\t');
                if (blocks.length > 2) {
                    var w1 = blocks[0].trim();
                    var w2 = blocks[1].trim();
                    var grade = Number(blocks[2]);

                    if (word.w == w1 || word.w == w2) {//有情感词
                        if (grade > 0) {//正得分
                            positiveScore = positiveScore + grade;//正得分
                            positiveWords.push(word.w + "=" + grade);//正得分集合
                            positiveWordsCount++;//正得分数量
                            break;//查找到则终止循环
                        } else {
                            negativeScore = negativeScore + grade;//负得分
                            negativeWords.push(word.w + "=" + grade);//负得分集合
                            negativeWordsCount++;//负得分数量
                            break;
                        }
                    }
                }
            }
        }

        noScoreWordsCount = words.length - (positiveWordsCount + negativeWordsCount);
        totalScore = positiveScore + negativeScore;

        splitResult.positiveScore = positiveScore;
        splitResult.positiveWords = positiveWords;
        splitResult.positiveWordsCount = positiveWordsCount;
        splitResult.negativeScore = negativeScore;
        splitResult.negativeWords = negativeWords;
        splitResult.negativeWordsCount = negativeWordsCount;
        splitResult.totalScore = totalScore;
        splitResult.noScoreWordsCount = noScoreWordsCount;

        return splitResult;
    }
}

function topKCal(wordArray, cb) {
    var topKList = {};
    var mhashName = "wordCal";
    //L.init(topKList);
    var client = redis.createClient(ConfigInfo.RedisSettings.port, ConfigInfo.RedisSettings.host);
    client.on('error', function (err) {
        console.log("Connection Error:", err);
        return;
    });

//    client.del(mhashName,function(reply){
//        console.log(reply);
//    });

    if (wordArray.length > 0) {
        wordArray.forEach(function (item) {
            //L.append(topKList.item);
            client.hincrby([mhashName, item.w, 1], function (err, reply) {
                //console.log(reply);
                if (typeof (cb) == "function") {
                    cb(err, reply);
                }
            });
        });
        client.quit();
    }
}

function cleanMyHash(tableName) {
    var client = redis.createClient(ConfigInfo.RedisSettings.port, ConfigInfo.RedisSettings.host);
    client.on('error', function (err) {
        console.log("Connection Error:", err);
        return;
    });

    client.del(tableName, function (reply) {
        console.log(reply);
    });
}

function SortedList(wordArray) {
    var sortedListName = "wordList";
    var client = redis.createClient(config.RedisSettings.port, config.RedisSettings.host);
    client.on('error', function (err) {
        console.log("Connection Error:", err);
        return;
    });
    if (wordArray.length > 0) {
        wordArray.each(function (index, item) {
            client.lpush(sortedListName, item, function (err, reply) {
                console.log(reply);
            });
        });
    }
}

function GetTopNewsTK(days) {
    var sql = "select * from b_news_evaluation where search_engine <> 'bing_news_api_en' and news_title is not null order by report_date desc limit " + days;
    pool.ExecuteQuery(sql, function (err, result) {
        if (result.length > 0) {
            //res.send(result);
            cleanMyHash("wordCal");
            result.forEach(function (item) {
                var tpTitle = item.news_title;
                var tpArray = segment.doSegment(tpTitle);
                topKCal(tpArray);
            });
        }
    });
}

function GetTopNews(req, res) {
    var days = req.param("days");
    var sql = "select * from b_news_evaluation where search_engine <> 'bing_news_api_en' and news_title is not null order by report_date desc limit " + days;
    pool.ExecuteQuery(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500);
            return;
        }
        if (result.length > 0) {
            GetTopNewsTK(days);
            res.send(result);
        }
    });
}

function showAllWordCal(req, res) {
    var isFromDB = req.params.fromdb;
    var mhashName = "wordCal";
    //L.init(topKList);
    if (isFromDB) {
        easypost.get(req, res, function (data) {
            if (data.params) {
                async.series({
                    a: function (cb) {
                        cleanMyHash("wordCal");
                        cb();
                    },
                    b: function (cb) {
                        data.params.forEach(function (item) {
                            //var tpTitle = item.news_title;
                            var tpArray = segment.doSegment(item);
                            topKCal(tpArray, cb);
                        });
                    },
                    c: function (cb) {
                        var client = redis.createClient(ConfigInfo.RedisSettings.port, ConfigInfo.RedisSettings.host);
                        client.on('error', function (err) {
                            console.log("Connection Error:", err);
                            return;
                        });
                        //GetTop30NewsTK();
                        client.hgetall(mhashName, function (err, reply) {
                            res.send(reply);
                            cb();
                        });
                    }
                }, function (err, result) {
                    //console.log(result);
                });
            }
        });
    }
    else {
        var client = redis.createClient(ConfigInfo.RedisSettings.port, ConfigInfo.RedisSettings.host);
        client.on('error', function (err) {
            console.log("Connection Error:", err);
            return;
        });
        //GetTop30NewsTK();
        client.hgetall(mhashName, function (err, reply) {
            res.send(reply);
        });
    }
}

//加载极性词
exports.loadGradeWords = function (req, res) {
    var data = [];
    if (!fs.existsSync(dictFileName)) {
        throw Error('Cannot find dict file "' + dictFileName + '".');

    } else {
        data = fs.readFileSync(dictFileName, 'utf8');
        data = data.split(/\r?\n/);
    }
    res.send(data);
};

//更新极性词值
exports.updateGradeWords = function (req, res) {
    easypost.get(req, res, function (postData) {
        var data = [];
        if (!fs.existsSync(dictFileName)) {
            throw Error('Cannot find dict file "' + dictFileName + '".');

        } else {
            data = fs.readFileSync(dictFileName, 'utf8');
            data = data.split(/\r?\n/);
        }

        var updatedData = [];

        //data是行数组
        for (var lineIndex in data) {
            var line = data[lineIndex];
            var blocks = line.split('\t');//列数组
            if (blocks.length > 2) {
                if (blocks[0] == postData.w1 && blocks[1] == postData.w2) {
                    blocks[2] = postData.grade;
                    line = blocks.join('\t');
                }
            }
            updatedData.push(line);
        }

        //更新后的文件
        var updatedFileString = updatedData.join('\r\n');
        fs.writeFile(dictFileName, updatedFileString, function (err) {
            if (err) {
                console.log(err);
                res.send({success: false});
            } else {
                res.send({success: true});
            }
        });
    });
};

function Polarity() {

}

Polarity.prototype.GetPolarityList = function (req, res) {
    var sqllQuery = "SELECT * FROM " + ConfigInfo.DbTables.db_cfg_dictpolarity + " WHERE is_deleted=0";

    pool.ExecuteQueryNoCache(sqllQuery, function (err, data) {
        //console.log(sqllQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.GetPolarityListByKey = function (req, res) {
    var key = req.body.key;
    var condition = " Where is_deleted=0 ";
    var sqlParams = [];
    if (key) {
        condition += "and (level1=? or level2=? or level3=? or prefix=? or name=?)";
        sqlParams.push(key, key, key, key, key);
    }

    var sqllQuery = "SELECT * FROM " + ConfigInfo.DbTables.db_cfg_dictpolarity + condition;

    pool.ExecuteQueryNoCache(sqllQuery, sqlParams, function (err, data) {
        //console.log(sqllQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.AddPolarityEntity = function (req, res) {
    var parameter = req.body;
    var param = utility.combinParams(parameter, false, []);

    var keys = param.keys + "last_modified",
        values = param.values + "now()";

    var insertGroupQuery = 'INSERT INTO ' + ConfigInfo.DbTables.db_cfg_dictpolarity + '(' + keys + ')VALUES(' + values + ')';
    pool.ExecuteQueryNoCache(insertGroupQuery, function (err, data) {
        //console.log(insertGroupQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.EditPolarityEntity = function (req, res) {
    var parameter = req.body;
    var param = utility.combineUpdateParam(parameter, ['id']);
    if (!param.result) {
        var result = utility.jsonResult(param.condition, '');
        res.json(result);
    }

    var condition = param.condition + "last_modified=now() WHERE id=" + parameter.id;

    var updateQuery = 'UPDATE ' + ConfigInfo.DbTables.db_cfg_dictpolarity + condition;
    pool.ExecuteQueryNoCache(updateQuery, function (err, data) {
        //console.log(updateQuery);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.DeleteBusinessPolarityEntity = function (req, res) {

    var deleteGroup = 'UPDATE ' + ConfigInfo.DbTables.db_cfg_dictpolarity + " SET is_deleted=1 WHERE id=" + req.body.id;
    pool.ExecuteQueryNoCache(deleteGroup, function (err, data) {
        //console.log(deleteGroup);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.DeletePolarityEntity = function (req, res) {

    var param = utility.combinDeleteQuery(req.body, ConfigInfo.DbTables.db_cfg_dictpolarity);
    if (!param.result) {
        var result = utility.jsonResult(param.query, '');
        res.json(result);
    }

    var deleteGroup = param.query;

    pool.ExecuteQueryNoCache(deleteGroup, function (err, data) {
        //console.log(deleteGroup);
        var resultObj = utility.jsonResult(err, data);
        res.json(resultObj);
    });
};

Polarity.prototype.GetTopNews = GetTopNews;

Polarity.prototype.showAllWordCal = showAllWordCal;

exports.Polarity = new Polarity();

//词频统计
function wordStatistics() {
}

/*
 *
 * 统计：1天或1周或1月的新闻信息中的前10个出现频率最高的词
 * */
wordStatistics.prototype.getHighFrequencyWords = function (req, res) {
    easypost.get(req, res, function (data) {
        var timeType = data.timeType;
        var words;
        switch (timeType) {
            case "day":
                //已天为过滤条件查询数据
                break;
            case "week":
                break;
            case "month":
                break;
        }

        var segmentWords = segment.doSegment(words);
        //统计频率 调用相关api
        res.send(null);
    });
};

exports.wordStatistics = new wordStatistics();