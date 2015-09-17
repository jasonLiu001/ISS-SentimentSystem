/**
 * Created by wang on 2014/11/5.
 */
var async = require("async");
var moment = require("moment");
var http=require("http");
var fs = require("fs");
var path = require("path");
var easypost = require('easypost');
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mysql = require("mysql");
var ConfigInfo = require('../Config.js');
var winston=require('winston');
var spawn=require('child_process').spawn;
var httpClient=require("request");
//用户操作日志
var reportLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename:path.resolve(__dirname,'../public/manage/reportLog.log') })
    ]
});
//Job守护进程日志 需要单独在一个文件中记录 因为是不同的进程
var appEmailSenderLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename:path.resolve(__dirname,'../public/manage/appEmailSender.log') })
    ]
});
var defaultPool = new DbHelper();
var keyPart = "Job00_";
//存储所有检查点 及其子任务对象 使用key/value形式
global.scheduleJob = null;
//存储不同检查点的子任务的key值，并按照检查点来分类存储 方便停止单个检查点任务时,按照检查点的key来取其下所有的子任务的key，因为单个检查点可以有多个不同时间段的子任务存在
global.scheduleJobKeys=null;
//业务表
var bussinessTable = {
    b_reportConfig: "report_config"
};

/**
 * *
 * @param {Object} config
 * */
function DbHelper(config) {
    this.config = config ? config : ConfigInfo.BasicSettings.currentDB;
    this.pool = mysql.createPool(this.config);
    this.mysql = mysql;
}

/**
 *
 * @param {String} query
 * @param {Array} params
 * @param {Function} cb
 * */
DbHelper.prototype.ExecuteQueryNoCache = function (query, params, cb) {
    var that = this;
    //console.log('*********************************************************************************');
    //console.log({'SQL': query, 'PARAMETER': params});
    //console.log('*********************************************************************************');
    if (typeof(params) == 'function') {
        cb = params;
        params = null;
    }
    that.pool.query(query, params, function (err, res) {
        cb(err, res);
    });
};

/**
 *
 * @summary sql语句分析 sql中不能包含delete或者update关键字
 * @param {String} sql 需要分析的sql语句
 * */
function sqlStringValidation(sql) {
    if (sql.indexOf('delete') >-1 || sql.indexOf('update') >-1) {//不能执行delete和update语句
            return false;
    }
    return true;
}

exports.executeAction = function (req, res) {
    easypost.get(req, res, function (data) {
        var action = data.executeAction;
        var id = data.rowId;
        switch (action) {
            case "deleteRow"://删除
            {
                deleteRowById(id, function (err, result) {
                    sendResponseData(err,'删除成功！', result, res);
                });
            }
                break;
            case "getDataById"://点击修改时填充控件内容
            {
                getDataById(id, function (err, result) {
                    sendResponseData(err,'',result, res);
                });
            }
                break;
            case "updateById"://修改运维检查点
            {
                var fieldValues = data.values;
                updateById(id, fieldValues, function (err, result) {
                    sendResponseData(err,'配置信息修改成功！',result, res);
                });
            }
                break;
            case "addNew"://添加运维检查点
            {
                var fieldValues = data.values;
                addNewDataRow(fieldValues, function (err, result) {
                    sendResponseData(err,'操作成功！', result, res);
                });
            }
                break;
            case "startScheduleById"://启动一个检查点的自动发送任务
                startScheduleById(id, function(err,result){
                    if(err){
                        sendResponseData(err,'',err.message,res);
                    }else{
                        sendResponseData(err,'当前运维检查点任务已成功启动！',result,res);
                    }
                });
                break;
            case "stopScheduleById"://停止一个检查点的自动发送任务
                stopScheduleById(id, function(err,result){
                    if(err){
                        sendResponseData(err,'',err.message,res);
                    }else{
                        sendResponseData(err,'当前运维检查点任务已成功停止！',result,res);
                    }
                });
                break;
            case "getReportContentById"://单个运维检查点报告内容预览
            {
                getReportContentById(id, function (err, result) {
                    if(err){
                        sendResponseData(err,'', err.message, res);
                    }else{
                        sendResponseData(err,'', result, res);
                    }
                });
            }
                break;
            case "previewEntireReport"://整个运维报告内容预览
            {
                getEntireReportContent(function(err,result){
                    if(err){
                        sendResponseData(err,'', err.message, res);
                    }else{
                        sendResponseData(err,'', result.reportContent, res);
                    }
                });
            }
                break;
            case "startAllSchedule":
            {
                var responseData=new serverResponseData();
                responseData.actionMessage="暂不实现";
                res.send(responseData);
            }
                break;
            case "stopAllCheckPoint":
            {
                var responseData=new serverResponseData();
                responseData.actionMessage="暂不实现";
                res.send(responseData);
            }
                break;
            case "getTopRecord"://获取所有记录的第1行
            {
                getTopRecord(function(err,result){
                    sendResponseData(err,'',result, res);
                });
            }
                break;
        }
    });
};

/**
 *
 * 下载运维工具日志 *
 * */
exports.getReportLog=function(req,res){
    var logFilePath=path.resolve(__dirname,"../public/manage/appEmailSender.log");
    res.download(logFilePath, 'appEmailSender.log');
};

/**
 *
 * 获取数据库中最新添加的一条记录
 * @param {Function} callback 回调函数
 * */
function getTopRecord(callback){
    var sql="select * from "+bussinessTable.b_reportConfig+" order by id asc limit 1";
    defaultPool.ExecuteQueryNoCache(sql, function(err,result){
        callback(err,result);
    });
}

/**
*
*
 * 根据分割符得到数组
 * @param {String} originalString 需要分割的原始字符串
 * @param {String} splitStr 分割符
 * @return {Array} 分割后的字符数组
* */
function getArrayBySplitString(originalString,splitStr){
    var stringArray=[];
    if(originalString!=''){
        if(originalString.indexOf(splitStr)==0)
        {
            //去除字符串开头的|分割符
            originalString=originalString.substr(1,(originalString.length-1));
        }
        if(originalString.lastIndexOf(splitStr)==originalString.length-1)
        {
            //去除字符串最后一个|分割符
            originalString=originalString.substr(0,(originalString.length-1));
        }
        stringArray=originalString.split(splitStr);
    }

    return stringArray;
}

/**
 *
 * 发送整个报告内容
 * @param {Function} callback 回调函数
 * */
function sendEntireReport(callback){
    async.waterfall([
        function(cb){
            getEntireReportContent(function(err,result){
                cb(err,result);
            });
        },
        function (mailArgs, cb) {
            //发送报告内容
            sendEmail(mailArgs, function (err, res) {
                cb(err, res);
            });
        }
    ],function(err,result){
        callback(err,result);
    });
}

/**
 *
 * 获取完整报告内容
 * */
function getEntireReportContent(callback){
    var configInfo = {
        dbConfig: {
            connectionLimit: 10,
            host: '',
            port: '',
            user: '',
            password: '',
            database: '',
            multipleStatements: true
        },
        reportSQL: '',
        reportTitle: '',
        reportTablenames:'',
        reportEntireTitle:'',
        emailConfig: {
            smtp_server: '',
            port: '',
            userpwd: '',
            from: '',
            to: '',
            cc: '',
            times: '',
            report_templatepath: ''
        },
        reportStatus: 0
    };
    async.waterfall([
        function(cb){
            var sql = "select * from " + bussinessTable.b_reportConfig+" order by id asc";
            defaultPool.ExecuteQueryNoCache(sql, function(err,allDataRowArray){
                if(err){
                    cb(err, null);
                }else{
                    var entireReportContent='';
                    var counter=0;
                    if(allDataRowArray.length>0){
                        async.eachSeries(allDataRowArray,function(dataRow,innerCallback){
                            configInfo.reportTitle = dataRow.report_title;//报告主题
                            configInfo.reportSQL=dataRow.report_querysql;
                            configInfo.reportEntireTitle=dataRow.report_entireTitle;//整个大报告的标题
                            configInfo.reportTablenames=dataRow.report_tablenames;
                            configInfo.dbConfig.host = dataRow.db_ip;//数据库ip
                            configInfo.dbConfig.port = dataRow.db_port;//数据库端口
                            configInfo.dbConfig.user = dataRow.db_username;//数据库用户名
                            configInfo.dbConfig.password = dataRow.db_passwd;
                            configInfo.dbConfig.database = dataRow.db_dbname;
                            configInfo.emailConfig.smtp_server = dataRow.email_smtp_server;//SMTP服务器
                            configInfo.emailConfig.port = dataRow.email_port;
                            configInfo.emailConfig.userpwd = dataRow.email_passwd;
                            configInfo.emailConfig.from = dataRow.email_sender;
                            configInfo.emailConfig.to = dataRow.email_reciever;
                            configInfo.emailConfig.cc = dataRow.email_cc;
                            configInfo.reportStatus = dataRow.job_status;//报告状态
                            configInfo.emailConfig.report_templatepath = dataRow.report_templatepath;//报告模板路径
                            configInfo.emailConfig.times = dataRow.email_sendTimes;//发送频率

                            //产生每个检查点的报告内容
                            getReportBodyByConfig(configInfo,function(err,reportContent){
                                if(err){
                                    innerCallback(err);
                                }else{
                                    entireReportContent+=reportContent;//拼接整个报告的内容
                                    counter++;
                                    innerCallback(null);
                                }
                            });
                        },function(err){
                            cb(err, entireReportContent);
                        });
                    }else{
                        cb(null,'');
                    }
                }
            });
        },
        function(mainContent,cb){
            dataValidationOption(configInfo,mainContent,function(err,result){
                if(err){
                    cb(err, null);
                }else{
                    var emailContent='';
                    var currentReportVersion=Number(configInfo.report_version);
                    if(currentReportVersion==1){
                        emailContent=getEmailContent(configInfo,mainContent);
                    }else if(currentReportVersion==2){
                        emailContent=mainContent;//运维报告V2.0 直接取报告内容
                    }
                    var reportConfig = {
                        reportContent: emailContent,
                        manageConfig: configInfo
                    };
                    cb(null,reportConfig);
                }
            });
        }
    ],function(err,result){
        callback(err,result);
    });
}

/**
 *
 * 预览时数据合法性校验
 * @param {Object} configInfo
 * @param {String} reportContent
 * @param {Function} callback
 * */
function dataValidationOption(configInfo,reportContent,callback){
    var report_version=String(configInfo.report_version);
    switch (report_version){
        case "1"://运维报告V1.0
            dataValidationOption_V1(configInfo,reportContent,callback);
            break;
        case "2"://运维报告V2.0
            dataValidationOption_V2(configInfo,reportContent,callback);
            break;
    }
}

/**
 *
 * 预览时数据合法性校验
 * @param {Object} configInfo
 * @param {String} reportContent
 * @param {Function} callback
 * */
function dataValidationOption_V2(configInfo,reportContent,callback){
    var configValidationMessage="检查点配置信息错误，请检查！";
    var reportValidationMessage="没有可显示的内容！";
    if(configInfo.emailConfig.userpwd==''||configInfo.emailConfig.from==''||configInfo.emailConfig.to==''||configInfo.emailConfig.times==''){
        configValidationMessage="检查点邮件相关配置信息不完整,请检查！";
        callback(new Error(configValidationMessage),null);
    }
    else if(reportContent==''||reportContent==null){
        callback(new Error(reportValidationMessage),null);
    }
    else{
        callback(null,null);
    }
}

/**
 *
 * 预览时数据合法性校验
 * @param {Object} configInfo
 * @param {String} reportContent
 * @param {Function} callback
 * */
function dataValidationOption_V1(configInfo,reportContent,callback){
    var configValidationMessage="检查点配置信息错误，请检查！";
    var reportValidationMessage="没有可显示的内容！";
    if(configInfo.dbConfig.host==''||configInfo.dbConfig.port==''||configInfo.dbConfig.user==''||configInfo.dbConfig.password==''||configInfo.dbConfig.database==''){
        configValidationMessage="检查点数据库相关的基础配置信息不完整,请检查！";
        callback(new Error(configValidationMessage),null);
    }else if(configInfo.reportSQL==''||configInfo.reportTablenames==''){
        callback(new Error(configValidationMessage),null);
    }else if(configInfo.emailConfig.userpwd==''||configInfo.emailConfig.from==''||configInfo.emailConfig.to==''||configInfo.emailConfig.times==''){
        configValidationMessage="检查点邮件相关配置信息不完整,请检查！";
        callback(new Error(configValidationMessage),null);
    }
    else if(reportContent==''||reportContent==null){
        callback(new Error(reportValidationMessage),null);
    }
    else{
        callback(null,null);
    }
}

/**
 *
 * 单个检查点报告内容预览入口方法  模板路径../public/manage/reportTemplate.html
 * @param {String} id 配置项id
 * @param {Function} callback  回调方法
 * */
function getReportContentById(id, callback) {
    var manageConfig='';
    async.waterfall([
        function (cb) {
            getConfigInfoById(Number(id), function (err, result) {
                manageConfig=result;
                cb(err, result);
            });
        },
        function (configInfo, cb) {
            getReportBodyByConfig(configInfo, function (err, result) {
                cb(err, result);
            });
        },
        function(report,cb){
            dataValidationOption(manageConfig,report,function(err,result){
                if(err){
                    cb(err,null);
                }else{
                    var emailContent='';
                    var currentReportVersion=Number(manageConfig.report_version);
                    if(currentReportVersion==1){
                        emailContent=getEmailContent(manageConfig,report);
                    }else if(currentReportVersion==2){
                        emailContent=report;
                    }
                    cb(null, emailContent);
                }
            });
        }
    ], function (err, result) {
        callback(err, result);
    });
}

/**
 *
 * @summary 产生邮件中的主体内容
 * @param {Object} checkPointConfigInfo 单个检查点的配置信息
 * @param {String} report 发送邮件中的报告内容
 * */
function getEmailContent(checkPointConfigInfo,report){
    var templatePath = path.resolve(__dirname, "../public" + checkPointConfigInfo.emailConfig.report_templatepath);
    var htmlTemplate = getReportTemplate(templatePath);
    var checkTime = moment().format('YYYY-MM-DD HH:mm:ss');
    htmlTemplate=replaceAll(htmlTemplate,'{reportDataCheckTime}','数据检查时间:'+checkTime);
    htmlTemplate = replaceAll(htmlTemplate, '{reportTitle}', checkPointConfigInfo.reportEntireTitle);
    htmlTemplate=replaceAll(htmlTemplate,'{reportMainContent}',report);
    return htmlTemplate;
}

/**
 *
 * @summary 产生V2.0邮件中的主体内容
 * @param {Object} queryQuantity 保存的需要计算的数值
 * */
function getEmailContent_V2(queryQuantity){
    //读取模板内容
    var templatePath = path.resolve(__dirname, "../public/manage/reportTemplate_V2.html");
    var htmlTemplate = getReportTemplate(templatePath);
    var checkTime = moment().format('YYYY-MM-DD HH:mm:ss');
    htmlTemplate=replaceAll(htmlTemplate,'{reportDataCheckTime}','数据检查时间:'+checkTime);
    htmlTemplate = replaceAll(htmlTemplate, '{reportTitle}', "舆情运维报告V2.0");

    //替换html标签并计算
    htmlTemplate=replaceAll(htmlTemplate,'{queryPublishTime}',queryQuantity.publish_time);

    //新闻数据可用率
    var data_news_available_template=0;
    var news=queryQuantity.crawler.news.template+queryQuantity.crawler.news.engine;
    if(parseFloat(queryQuantity.crawler.news.template)!=0){
        data_news_available_template=parseFloat(queryQuantity.analyze.news.template)/parseFloat(queryQuantity.crawler.news.template)*100;
        data_news_available_template=data_news_available_template.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_news_stockQuantity_template}',String(queryQuantity.crawler.news.template));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_news_stockQuantity_template}',String(queryQuantity.analyze.news.template));
    htmlTemplate=replaceAll(htmlTemplate,'{data_news_available_template}',String(data_news_available_template));
    var data_news_available_engine=0;
    if(parseFloat(queryQuantity.crawler.news.engine)!=0){
        data_news_available_engine=parseFloat(queryQuantity.analyze.news.engine)/parseFloat(queryQuantity.crawler.news.engine)*100;
        data_news_available_engine=data_news_available_engine.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_news_stockQuantity_engine}',String(queryQuantity.crawler.news.engine));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_news_stockQuantity_engine}',String(queryQuantity.analyze.news.engine));
    htmlTemplate=replaceAll(htmlTemplate,'{data_news_available_engine}',String(data_news_available_engine));
    //论坛
    var data_forum_available=0;
    if(parseFloat(queryQuantity.crawler.forum)!=0){
        data_forum_available=parseFloat(queryQuantity.analyze.forum)/parseFloat(queryQuantity.crawler.forum)*100;
        data_forum_available=data_forum_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_forum_stockQuantity}',String(queryQuantity.crawler.forum));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_forum_stockQuantity}',String(queryQuantity.analyze.forum));
    htmlTemplate=replaceAll(htmlTemplate,'{data_forum_available}',String(data_forum_available));

    //博客
    var data_blog_available=0;
    if(parseFloat(queryQuantity.crawler.blog)!=0){
        data_blog_available=parseFloat(queryQuantity.analyze.blog)/parseFloat(queryQuantity.crawler.blog)*100;
        data_blog_available=data_blog_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_blog_stockQuantity}',String(queryQuantity.crawler.blog));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_blog_stockQuantity}',String(queryQuantity.analyze.blog));
    htmlTemplate=replaceAll(htmlTemplate,'{data_blog_available}',String(data_blog_available));

    //音视频
    var data_media_available=0;
    if(parseFloat(queryQuantity.crawler.media)!=0){
        data_media_available=parseFloat(queryQuantity.analyze.media)/parseFloat(queryQuantity.crawler.media)*100;
        data_media_available=data_media_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_media_stockQuantity}',String(queryQuantity.crawler.media));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_media_stockQuantity}',String(queryQuantity.analyze.media));
    htmlTemplate=replaceAll(htmlTemplate,'{data_media_available}',String(data_media_available));

    //微博
    var data_weibo_available=0;
    if(parseFloat(queryQuantity.crawler.weibo)!=0){
        data_weibo_available=parseFloat(queryQuantity.analyze.weibo)/parseFloat(queryQuantity.crawler.weibo)*100;
        data_weibo_available=data_weibo_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_weibo_stockQuantity}',String(queryQuantity.crawler.weibo));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_weibo_stockQuantity}',String(queryQuantity.analyze.weibo));
    htmlTemplate=replaceAll(htmlTemplate,'{data_weibo_available}',String(data_weibo_available));

    //微信
    var data_weixin_available=0;
    if(parseFloat(queryQuantity.crawler.weixin)!=0){
        data_weixin_available=parseFloat(queryQuantity.analyze.weixin)/parseFloat(queryQuantity.crawler.weixin)*100;
        data_weixin_available=data_weixin_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_weixin_stockQuantity}',String(queryQuantity.crawler.weixin));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_weixin_stockQuantity}',String(queryQuantity.analyze.weixin));
    htmlTemplate=replaceAll(htmlTemplate,'{data_weixin_available}',String(data_weixin_available));
   //商机通
    var data_sjt_available=0;
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_sjt_stockQuantity}',String(queryQuantity.crawler.sjt));
    if(parseFloat(queryQuantity.crawler.sjt)!=0){
        data_sjt_available=(queryQuantity.analyze.zhanhui+queryQuantity.analyze.zhaobiao)/parseFloat(queryQuantity.crawler.sjt)*100;
        data_sjt_available=data_sjt_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_sjt_stockQuantity}',(queryQuantity.analyze.zhanhui+queryQuantity.analyze.zhaobiao));
    htmlTemplate=replaceAll(htmlTemplate,'{data_sjt_available}',String(data_sjt_available));
    //合计
    var totalCrawlStock=queryQuantity.crawler.news.template+queryQuantity.crawler.news.engine+queryQuantity.crawler.blog+queryQuantity.crawler.forum+queryQuantity.crawler.media+queryQuantity.crawler.weibo+queryQuantity.crawler.weixin+queryQuantity.crawler.sjt;
    var totalAnalyzeStock=queryQuantity.analyze.news.template+queryQuantity.analyze.news.engine+queryQuantity.analyze.blog+queryQuantity.analyze.forum+queryQuantity.analyze.media+queryQuantity.analyze.weibo+queryQuantity.analyze.weixin+queryQuantity.analyze.zhanhui+queryQuantity.analyze.zhaobiao;
    htmlTemplate=replaceAll(htmlTemplate,'{crawl_stock_total}',String(totalCrawlStock));
    htmlTemplate=replaceAll(htmlTemplate,'{analyze_stock_total}',String(totalAnalyzeStock));
    var data_total_available=0;
    if(parseFloat(totalCrawlStock)!=0){
        data_total_available=parseFloat(totalAnalyzeStock)/parseFloat(totalCrawlStock)*100;
        data_total_available=data_total_available.toFixed(2);
    }
    htmlTemplate=replaceAll(htmlTemplate,'{data_total_available}',String(data_total_available));

    htmlTemplate=replaceAll(htmlTemplate,'{crawl_fetch_total}',queryQuantity.crawler.fetchNum);
    return htmlTemplate;
}

/**
 *
 * 停止计划任务
 * @param {String} id 检查点id
 * @param {Function} callback 回调函数
 * */
function stopScheduleById(id,callback) {
    async.waterfall([
        function(cb){
            updateJobStatusById(Number(id), 0, function (err, result) {
                cb(err,result);
            });
        },
        function(arg1,cb){
            getConfigInfoById(Number(id),function(err,result){
                reportLogger.info("检查点["+result.reportTitle+"] 操作类型[停止] 时间:["+moment().format('YYYY-MM-DD HH:mm:ss')+"]");
                cb(err, arg1);
            });
        }
    ],function(err,result){
        callback(err,result);
    });
}

/**
 *
 * 启动计划任务
 * @param {String} id 配置项id
 * @param {Function} callback 回调函数
 * */
function startScheduleById(id, callback) {
    async.waterfall([
        function(cb){
            //更新任务状态为运行中
            updateJobStatusById(id, 1, function (err, result) {
                cb(err, result);
            });
        },
        function(arg1,cb){
            getConfigInfoById(Number(id),function(err,result){
                reportLogger.info("检查点["+result.reportTitle+"] 操作类型[启动] 时间:["+moment().format('YYYY-MM-DD HH:mm:ss')+"]");
                cb(err,arg1);
            });
        }
    ],function(err,result){
        callback(err,result);
    });
}

/**
 *
 * 更新计划任务状态
 * @param {Number} id
 * @param {Number} jobStatus
 * @param {Function} callback
 * */
function updateJobStatusById(id, jobStatus, callback) {
    var sql = '';
    switch (jobStatus) {
        case 1:
            sql = "update " + bussinessTable.b_reportConfig + " set job_status=1 where id=?";
            break;
        case 0:
            sql = "update " + bussinessTable.b_reportConfig + " set job_status=0 where id=?";
            break;
    }
    var sqlParams = [];
    sqlParams.push(id);
    defaultPool.ExecuteQueryNoCache(sql, sqlParams, function (err, res) {
        callback(err, res);
    });
}

/**
 *
 * @param {Object} fieldValues
 * @param {Function} callback
 * */
function addNewDataRow(fieldValues, callback) {
    var sql = "insert into " + bussinessTable.b_reportConfig + "(db_ip,db_port,db_passwd,report_querysql,report_tablenames," +
        "report_title,report_templatepath,db_dbname,db_username,email_smtp_server,email_port,email_passwd," +
        "email_sender,email_reciever,email_cc,email_sendTimes,report_version) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var sqlParam = [];
    sqlParam.push(fieldValues.db_ip);
    sqlParam.push(fieldValues.db_port);
    sqlParam.push(fieldValues.db_passwd);
    sqlParam.push(fieldValues.report_querysql);
    sqlParam.push(fieldValues.report_tablenames);
    sqlParam.push(fieldValues.report_title);
    sqlParam.push(fieldValues.report_templatepath);
    sqlParam.push(fieldValues.db_dbname);
    sqlParam.push(fieldValues.db_username);
    sqlParam.push(fieldValues.email_smtp_server);
    sqlParam.push(fieldValues.email_port);
    sqlParam.push(fieldValues.email_passwd);
    sqlParam.push(fieldValues.email_sender);
    sqlParam.push(fieldValues.email_reciever);
    sqlParam.push(fieldValues.email_cc);
    sqlParam.push(fieldValues.email_sendTimes);
    sqlParam.push(fieldValues.report_version);
    defaultPool.ExecuteQueryNoCache(sql, sqlParam, function (err, result) {
        reportLogger.info("检查点["+fieldValues.report_title+"]配置信息 操作类型[添加] 时间:["+moment().format('YYYY-MM-DD HH:mm:ss')+"]");
        callback(err, result);
    });
}

/**
 *
 * @param {String} id
 * @param {Object} fieldValues
 * @param {Function} callback
 * */
function updateById(id, fieldValues, callback) {
    var sql = "UPDATE " + bussinessTable.b_reportConfig + " set db_ip=?,db_port=?,db_passwd=?,report_querysql=?,report_tablenames=?," +
        "report_title=?,report_templatepath=?,db_dbname=?,db_username=?,email_smtp_server=?,email_port=?,email_passwd=?," +
        "email_sender=?,email_reciever=?,email_cc=?,email_sendTimes=? where id=?";
    var sqlParam = [];
    sqlParam.push(fieldValues.db_ip);
    sqlParam.push(fieldValues.db_port);
    sqlParam.push(fieldValues.db_passwd);
    sqlParam.push(fieldValues.report_querysql);
    sqlParam.push(fieldValues.report_tablenames);
    sqlParam.push(fieldValues.report_title);
    sqlParam.push(fieldValues.report_templatepath);
    sqlParam.push(fieldValues.db_dbname);
    sqlParam.push(fieldValues.db_username);
    sqlParam.push(fieldValues.email_smtp_server);
    sqlParam.push(fieldValues.email_port);
    sqlParam.push(fieldValues.email_passwd);
    sqlParam.push(fieldValues.email_sender);
    sqlParam.push(fieldValues.email_reciever);
    sqlParam.push(fieldValues.email_cc);
    sqlParam.push(fieldValues.email_sendTimes);
    sqlParam.push(id);
    defaultPool.ExecuteQueryNoCache(sql, sqlParam, function (err, result) {
        reportLogger.info("检查点["+fieldValues.report_title+"]配置信息 操作类型[修改] 时间:["+moment().format('YYYY-MM-DD HH:mm:ss')+"]");
        //重启监视服务
        restartReportMonitor();
        callback(err, result);
    });
}

/**
 *
 * 服务器响应客户端数据类
 * */
function serverResponseData(){
    this.success=false;
    this.data=null;
    this.actionMessage=null;
}

/**
 *
 * 发送响应消息
 * @param {Object} err 错误对象
 * @param {String} actionMessage 操作消息
 * @param {Object} result
 * @param {Object} res
 * */
function sendResponseData(err,actionMessage, result, res) {
    var responseData=new serverResponseData();
    if (err) {
        console.error(err);
        responseData.actionMessage = err.message;
    } else {
        responseData.actionMessage=actionMessage;
        responseData.success = true;
        responseData.data = result;
    }
    res.send(responseData);
}

/**
 *
 *  根据id获取行记录
 *  @param {String} id 行记录id
 *  @param {Function} callback 回调函数
 * */
function getDataById(id, callback) {
    var sql = "SELECT * FROM " + bussinessTable.b_reportConfig + " where id=?";
    var sqlParams = [];
    sqlParams.push(id);
    defaultPool.ExecuteQueryNoCache(sql, sqlParams, function (err, res) {
        callback(err, res);
    });
}

/**
 *
 * @summary 根据id删除行
 * @param {String} id 行id
 * @param {Function} callback 回调函数
 * */
function deleteRowById(id, callback) {
    var delSql = "delete from " + bussinessTable.b_reportConfig + " where id=?";
    var sqlParams = [];
    sqlParams.push(id);
    defaultPool.ExecuteQueryNoCache(delSql, sqlParams, function (err, result) {
        callback(err, result);
    });

}

/**
 *
 * @summary 获取报告列表
 * */
exports.getReportList = function (req, res) {
    var responseData = {
        success: false,
        data: null,
        actionMessage: null,
        total: 0
    };
    easypost.get(req, res, function (data) {
        var start = data.start;
        var count = data.count;

        async.series([
            function (callback) {
                var sql = "select id,report_title,job_status,report_version from " + bussinessTable.b_reportConfig + " order by id asc limit " + ((start - 1) * count) + "," + count;
                defaultPool.ExecuteQueryNoCache(sql, [], function (err, result) {
                    responseData.data = result;
                    callback(err, result);
                });
            },
            function (callback) {
                var sqlTotalCount = "select count(*) as totalCount from " + bussinessTable.b_reportConfig;
                defaultPool.ExecuteQueryNoCache(sqlTotalCount, [], function (err, result) {
                    responseData.total = result[0].totalCount;
                    callback(err, result);
                });
            }
        ], function (err, results) {
            if (err) {
                console.error(err);
                responseData.actionMessage = err.message;
                responseData.data = null;
            } else {
                responseData.actionMessage='';
                responseData.success = true;
            }
            res.send(responseData);
        });
    });
};

/**
 *
 * @summary 发送单个检查点报告入口方法
 * @param {Number} configId 报告列表id
 * @param {Function} callback 回调函数
 * */
function sendCheckPointReportById(configId, callback) {
    var manageConfig = '';
    async.waterfall([
        function (cb) {
            getConfigInfoById(configId, function (err, res) {
                if(err){
                    appEmailSenderLogger.info('开始发送检查点:['+res.reportTitle+']E-mail  发生错误:'+err.message+'  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }else{
                    appEmailSenderLogger.info('开始发送检查点:['+res.reportTitle+']E-mail....  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }
                manageConfig = res;
                cb(err, res);
            });
        },
        function (configInfo, cb) {//将这个结果生成html并邮件发送
            //产生运维报告的html内容
            getReportBodyByConfig(manageConfig, function (err, mainContent) {
                if(err){
                    appEmailSenderLogger.info('生成检查点:['+manageConfig.reportTitle+']报告内容  发生错误:'+err.message+'  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }else{
                    appEmailSenderLogger.info('生成检查点:['+manageConfig.reportTitle+']报告内容....  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }
                cb(err, mainContent);
            });
        },
        function(mainContent,cb){
            dataValidationOption(manageConfig,mainContent,function(err,result){
                if(err){
                    appEmailSenderLogger.info('校验检查点:['+manageConfig.reportTitle+']报告内容完整性 发生错误:'+err.message+'  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                    cb(err, null);
                }else{
                    appEmailSenderLogger.info('校验检查点:['+manageConfig.reportTitle+']报告内容完整性....  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                    var emailContent='';
                    var currentReportVersion=Number(manageConfig.report_version);
                    if(currentReportVersion==1){
                        emailContent=getEmailContent(manageConfig,mainContent);
                    }else if(currentReportVersion==2){
                        emailContent=mainContent;
                    }
                    cb(null,emailContent);
                }
            });
        },
        function (reportContent, cb) {
            var mailArgs = {
                reportContent: reportContent,
                manageConfig: manageConfig
            };
            //发送报告内容
            sendEmail(mailArgs, function (err, res) {
                if(err){
                    appEmailSenderLogger.info('调用检查点:['+manageConfig.reportTitle+']邮件发送接口  发生错误:'+err.message+'  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }else{
                    appEmailSenderLogger.info('调用检查点:['+manageConfig.reportTitle+']邮件发送接口....  时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
                }
                cb(err, res);
            });
        }
    ], function (err, res) {
        callback(err, res);
    });
}

/**
 *
 * 得到单个检查点的报告头内容
 * @param {Object} configInfo 检查点的配置信息
 * */
function getReportHeaderByConfig(configInfo){
    var reportHeaderHtml='';
    reportHeaderHtml+="<div style='clear: both; margin-top: 35px; text-align: center'><h3>" + configInfo.reportTitle + "</h3></div>";
//    reportHeaderHtml+="<div class='aligncenter'><div style='clear: both; text-align: left; margin-top: 18px;'><h4>网络连接</h4></div><table class='gridtable' " +
//        "style='width: 100%;'><tr><td rowspan='2'>系统地址</td><td colspan='5'>结果</td></tr><tr><td>是否可访问</td>" +
//        "<td>登录</td><td>页面显示</td><td>基本功能</td><td>性能</td></tr><tr><td></td><td></td><td></td><td></td><td></td>" +
//        "<td></td></tr></table></div>";
    return reportHeaderHtml;
}

/**
 *
 * @summary 单个检查点的报告体内容
 * @param {Object} configInfo 检查点的配置信息
 * @param {Function} callback 回调函数
 * */
function getReportBodyByConfig(configInfo, callback) {
    var report_version=String(configInfo.report_version);
    switch (report_version){
        case "1"://运维报告V1.0
            getReportBody_V1(configInfo,callback);
            break;
        case "2"://运维报告V2.0
            getReportBody_V2(configInfo,callback);
            break;
    }
}

/**
 *
 * @summary 单个检查点的报告体内容
 * @param {Object} configInfo 检查点的配置信息
 * @param {Function} callback 回调函数
 * */
function getReportBody_V2(configInfo, callback){
    //查询数量
    var queryQuantity = {
        crawler: {
            news: {
             template:0,
             engine:0
            },
            forum: 0,
            blog: 0,
            media: 0,
            weibo: 0,
            weixin: 0,
            sjt:0,
            fetchNum:0
        },
        analyze: {
            news: {
                template:0,
                engine:0
            },
            forum: 0,
            blog: 0,
            media: 0,
            weibo: 0,
            weixin: 0,
            zhanhui:0,
            zhaobiao:0
        },
        data_news_available:0,//数据可用率
        data_forum_available:0,
        data_blog_available:0,
        data_media_available:0,
        data_weibo_available:0,
        data_weixin_available:0,
        data_sjt_availabe:0,
        publish_time:'',
        mediaType:''
    };
    var crawlQueryType="crawl";//爬虫平台查询URL
    var analyzeQueryType="analyze";//分析平台查询URL
    async.waterfall([function(cb){
        //新闻 mediaType=1
        //var crawlNewsUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"1");
        var templateUrl=ConfigInfo.SolrQueryInterface.crawlerPlatForm + "publish_time:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND data_source:1 AND media_type:1&wt=json&indent=true";
        getDataFromSolrSever(templateUrl,queryQuantity,crawlQueryType,"1.1",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        var engineUrl=ConfigInfo.SolrQueryInterface.crawlerPlatForm + "publish_time:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND data_source:2 AND media_type:1&wt=json&indent=true";
        getDataFromSolrSever(engineUrl,queryQuantity,crawlQueryType,"1.2",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //论坛 mediaType=2
        var crawlForumUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"2");
        getDataFromSolrSever(crawlForumUrl,queryQuantity,crawlQueryType,"2",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //博客 mediaType=3
        var crawlBlogUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"3");
        getDataFromSolrSever(crawlBlogUrl,queryQuantity,crawlQueryType,"3",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //音视频 mediaType=4
        var crawlMediaUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"4");
        getDataFromSolrSever(crawlMediaUrl,queryQuantity,crawlQueryType,"4",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //微博 mediaType=5
        var crawlWeiBoUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"5");
        getDataFromSolrSever(crawlWeiBoUrl,queryQuantity,crawlQueryType,"5",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //微信 mediaType=6
        var crawlWeiXinUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"6");
        getDataFromSolrSever(crawlWeiXinUrl,queryQuantity,crawlQueryType,"6",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //商机通 mediaType=6
        var crawlsjtUrl=getSolrQueryUrl(crawlQueryType,queryQuantity,"10");
        getDataFromSolrSever(crawlsjtUrl,queryQuantity,crawlQueryType,"10",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
      var fetchUrl=ConfigInfo.SolrQueryInterface.crawlerPlatForm + "fetch_time:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
          ']+&wt=json&indent=true';
        getDataFromSolrSever(fetchUrl,queryQuantity,crawlQueryType,"11",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //新闻 mediaType=1
        var templateUrl=ConfigInfo.SolrQueryInterface.analyzePlatForm + "publishDate:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND dataSource:1 AND mediaType:1&wt=json&indent=true";
        getDataFromSolrSever(templateUrl,queryQuantity,analyzeQueryType,"1.1",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        var analyzeNewsUrl=ConfigInfo.SolrQueryInterface.analyzePlatForm + "publishDate:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND dataSource:2 AND mediaType:1&wt=json&indent=true";
    getDataFromSolrSever(analyzeNewsUrl,queryQuantity,analyzeQueryType,"1.2",function(err,res){
        cb(err, res);
    });
    },function(arg1,cb){
        //论坛 mediaType=2
        var analyzeForumUrl=getSolrQueryUrl(analyzeQueryType,queryQuantity,"2");
        getDataFromSolrSever(analyzeForumUrl,queryQuantity,analyzeQueryType,"2",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //博客 mediaType=3
        var analyzeBlogUrl=getSolrQueryUrl(analyzeQueryType,queryQuantity,"3");
        getDataFromSolrSever(analyzeBlogUrl,queryQuantity,analyzeQueryType,"3",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //音视频 mediaType=4
        var analyzeMediaUrl=getSolrQueryUrl(analyzeQueryType,queryQuantity,"4");
        getDataFromSolrSever(analyzeMediaUrl,queryQuantity,analyzeQueryType,"4",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //微博 mediaType=5
        var analyzeWeiBoUrl=getSolrQueryUrl(analyzeQueryType,queryQuantity,"5");
        getDataFromSolrSever(analyzeWeiBoUrl,queryQuantity,analyzeQueryType,"5",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //微信 mediaType=6
        var crawlWeiXinUrl=getSolrQueryUrl(analyzeQueryType,queryQuantity,"6");
        getDataFromSolrSever(crawlWeiXinUrl,queryQuantity,analyzeQueryType,"6",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //商机通
       // submedia_type = 206 //展会
        var url=ConfigInfo.SolrQueryInterface.analyzePlatForm + "publishDate:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND subMediaType:206&wt=json&indent=true";
        getDataFromSolrSever(url,queryQuantity,analyzeQueryType,"206",function(err,res){
            cb(err, res);
        });
    },function(arg1,cb){
        //商机通
        // submedia_type = 207 //招标数据
        var url=ConfigInfo.SolrQueryInterface.analyzePlatForm + "publishDate:[" + moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " +  moment().format('YYYY-MM-DD') + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
            "] AND subMediaType:207&wt=json&indent=true";
        getDataFromSolrSever(url,queryQuantity,analyzeQueryType,"207",function(err,res){
            cb(err, res);
        });
    }
    ],function(err,result){
        //产生V2.0发送邮件的内容
        var email_reportContent=getEmailContent_V2(queryQuantity);
        callback(err, email_reportContent);
    });
}



/**
 *
 * 从Solr服务器中查询数据
 * @param {String} queryUrl sorl查询URL
 * @param {Object} queryQuantity 查询的数量
 * @param {String} queryType 查询类型  queryType=crawl|analyze
 * @param {String} mediaType 查询的具体类型
 * @param {Function} callback 回调函数
 * */
function getDataFromSolrSever(queryUrl,queryQuantity,queryType, mediaType,callback){
    httpClient(queryUrl, function (error, response, body) {
        if(!error&& response.statusCode==200){
            var obj=JSON.parse(body);
            switch (queryType){
                case "crawl":
                {
                    switch (mediaType){
                        case "1.1"://新闻
                            //保存查询数量
                            queryQuantity.crawler.news.template=obj.response.numFound;
                            break;
                        case "1.2"://新闻
                            //保存查询数量
                            queryQuantity.crawler.news.engine=obj.response.numFound;
                            break;
                        case "2"://论坛
                            queryQuantity.crawler.forum=obj.response.numFound;
                            break;
                        case "3"://博客
                            queryQuantity.crawler.blog=obj.response.numFound;
                            break;
                        case "4"://音视频
                            queryQuantity.crawler.media=obj.response.numFound;
                            break;
                        case "5"://微博
                            queryQuantity.crawler.weibo=obj.response.numFound;
                            break;
                        case "6"://微信
                            queryQuantity.crawler.weixin=obj.response.numFound;
                            break;
                        case "10"://商机通
                            queryQuantity.crawler.sjt=obj.response.numFound;
                            break;
                        default :
                            queryQuantity.crawler.fetchNum=obj.response.numFound;
                    }
                }
                    break;
                case "analyze":
                {
                    switch (mediaType){
                        case "1.1"://新闻
                            //保存查询数量
                            queryQuantity.analyze.news.template=obj.response.numFound;
                            break;
                        case "1.2"://新闻
                            //保存查询数量
                            queryQuantity.analyze.news.engine=obj.response.numFound;
                            break;
                        case "2"://论坛
                            queryQuantity.analyze.forum=obj.response.numFound;
                            break;
                        case "3"://博客
                            queryQuantity.analyze.blog=obj.response.numFound;
                            break;
                        case "4"://音视频
                            queryQuantity.analyze.media=obj.response.numFound;
                            break;
                        case "5"://微博
                            queryQuantity.analyze.weibo=obj.response.numFound;
                            break;
                        case "6"://微信
                            queryQuantity.analyze.weixin=obj.response.numFound;
                            break;
                        case "206":
                            queryQuantity.analyze.zhanhui=obj.response.numFound;
                            break;
                        case "207":
                            queryQuantity.analyze.zhaobiao=obj.response.numFound;
                            break;
                    }
                }
                    break;
            }
            //console.log(body);
            //保存
            callback(null, body);
        }else{
            callback(new Error("solr服务器返回状态码:"+response.statusCode),null);
        }
    });
}

/**
 *
 * 拼接Solr查询的URL
 * @param {String} queryType 查询类型  queryType=crawl|analyze
 * @param {Object} queryQuantity 保存查询条件和结果
 * @param {String} mediaType 查询的具体类型
 * @return {String} 根据查询平台及查询类型返回查询Url
 * */
function getSolrQueryUrl(queryType,queryQuantity, mediaType) {
    var dateTimeString = moment().format('YYYY-MM-DD');
    var solrQueryUrl = "";
    switch (queryType) {
        case "crawl":
        {
            switch (mediaType) {
                case "1"://新闻
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 1;
                    break;
                case "2"://论坛
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 2;
                    break;
                case "3"://博客
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 3;
                    break;
                case "4"://音视频
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 4;
                    break;
                case "5"://微博
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 5;
                    break;
                case "6"://微信
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 6;
                    break;
                case "10"://商机通
                    ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType = 10;
                    break;


            }
            //这里特别注意Url中的转义符的使用 %5C代表转义字符\   %5C实际代表的是\\
            solrQueryUrl = ConfigInfo.SolrQueryInterface.crawlerPlatForm + "publish_time:[" + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
                '] AND media_type:'+ConfigInfo.SolrQueryInterface.crawlerSearchParam.mediaType+'&wt=json&indent=true';
        }
            break;
        case "analyze":
        {
            switch (mediaType) {
                case "1"://新闻
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 1;
                    break;
                case "2"://论坛
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 2;
                    break;
                case "3"://博客
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 3;
                    break;
                case "4"://音视频
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 4;
                    break;
                case "5"://微博
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 5;
                    break;
                case "6"://微信
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 6;
                    break;
                case "10"://商机通
                    ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType = 10;
                    break;
            }
            solrQueryUrl = ConfigInfo.SolrQueryInterface.analyzePlatForm + "publishDate:[" + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +
                "] AND mediaType:" + ConfigInfo.SolrQueryInterface.analyzeSearchParam.mediaType + "&wt=json&indent=true";
        }
            break;
    }

    //保存查询条件到查询对象
    queryQuantity.publish_time="[" + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_start + " TO " + dateTimeString + ConfigInfo.SolrQueryInterface.crawlerSearchParam.publishDate_end +"]";
    queryQuantity.mediaType=Number(mediaType);

    return solrQueryUrl;
}

/**
 *
 * @summary 单个检查点的报告体内容
 * @param {Object} configInfo 检查点的配置信息
 * @param {Function} callback 回调函数
 * */
function getReportBody_V1(configInfo, callback){
    var htmlResultStr='';
    var reportHeadHtml=getReportHeaderByConfig(configInfo);
    htmlResultStr+=reportHeadHtml;//拼接报告头
    var tableNameArray=[];// 存储table的名称
    var reportTables=configInfo.reportTablenames;
    if(reportTables!=''&&reportTables!=null&&reportTables!=undefined){
        tableNameArray=getArrayBySplitString(reportTables,'|');
    }
    async.waterfall([
        function (cb) {
            //获取生成报告的数据源
            getReportDataSource(configInfo, function (err, dataArray) {
                cb(err, dataArray);
            });
        },
        function(dataArray,cb){
            if (dataArray.length > 0) {
                dataArray.forEach(function (data, pos) {
                    if (data.length > 0) {
                        var tableName='';//表前显示的中文或者英文名称
                        if(tableNameArray[pos]){
                            tableName=tableNameArray[pos];
                        }
                        var tableNameHtml="<div style='clear: both; margin-top: 18px;'><h4>"+tableName+"</h4></div>";
                        var tableStr = "<table class=\"gridtable\">";
                        tableStr=tableNameHtml+tableStr;
                        //***************加载列名*********************************
                        var rowObj = data[0];
                        var headStr = '<thead>';
                        for (var name in rowObj) {
                            headStr = headStr + "<td>" + name + "</td>";
                        }
                        headStr = headStr + "</thead>";
                        //******************加载列名结束***************************

                        //***************加载表体数据*****************************
                        var tBodyStr = '<tbody>';
                        data.forEach(function (item, position) {
                            var trStr = '<tr>';
                            var tdStr = '';
                            for (var name in item) {
                                var fieldValue = item[name];
                                if (Object.prototype.toString.call(fieldValue) == "[object Date]") {
                                    fieldValue = moment(fieldValue).format('YYYY-MM-DD HH:mm:ss');
                                }
                                tdStr = tdStr + "<td>" + fieldValue + "</td>";
                            }
                            trStr = trStr + tdStr + "</tr>";
                            tBodyStr = tBodyStr + trStr;
                            if (position == data.length - 1) {
                                tableStr = tableStr + headStr + tBodyStr + "</tbody></table>";
                                htmlResultStr += tableStr;
                                if (pos == dataArray.length - 1) {
                                    cb(null, htmlResultStr);
                                }
                            }
                        });
                        //**************加载表体数据结束**************************
                    }
                });
            } else {
                cb(new Error('没有内容填充html模板'), null);
            }
        }
    ],function(err,result){
        callback(err,result);
    });
}

/**
 *
 * @summary 发送E-mail邮件给运维人员
 * @param {String} mailArgs 报告内容
 * @param {Function} callback 回调函数
 * */
function sendEmail(mailArgs, callback) {
    var emailConfig = mailArgs.manageConfig.emailConfig;//邮箱的配置信息

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
        host: emailConfig.smtp_server,
        port: emailConfig.port,
        auth: {
            user: emailConfig.from,
            pass: emailConfig.userpwd
        },
        tls: {
            rejectUnauthorized: false
        }
    }));

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: emailConfig.from, // sender address
        to: emailConfig.to, // list of receivers
        cc: emailConfig.cc,
        subject: mailArgs.manageConfig.reportTitle, // Subject line
        html: mailArgs.reportContent // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        callback(error, info);
    });

}

/**
 *
 * @summary 将生成报告的sql 拆分成多条sql和DB逐一对应的形式，每条sql归属一个database
 * @param {String} reportSQL  分割sql语句成单独的小段sql
 * @return {Array} 返回拆分后的所有sql语句的数组
 * */
function getSqlArray(reportSQL){
    var splitedSqlArray = [];
    //将sql按照use数据库拆分成多个部分
    var partern = /\buse\b\s+(.*?);/gi;
    var matchResult = reportSQL.match(partern);
    if(matchResult!=null){
        if (matchResult.length >= 2) {
            for (var i = 0; i < matchResult.length - 1; i++) {
                //查找第一个use语句
                var prevIndex = reportSQL.indexOf(matchResult[i]);
                //先替换掉第一个use语句
                reportSQL=reportSQL.replace(matchResult[i],'{{*-+3h}}');
                //索引发生变化，根据替换字符{{*-+3h}}重新查找第一个use语句的索引值
                prevIndex=reportSQL.indexOf('{{*-+3h}}');
                //查找下一个use语句
                var nextIndex = reportSQL.indexOf(matchResult[i + 1]);
                var splitedSql = '';
                //不是最后的use则取中间字符
                splitedSql = reportSQL.substring(prevIndex, nextIndex);
                //还原sql语句
                splitedSql=splitedSql.replace('{{*-+3h}}',matchResult[i]);
                splitedSqlArray.push(splitedSql);
                //查找结束还原sql语句
                reportSQL=reportSQL.replace('{{*-+3h}}',matchResult[i]);
                //移除之前已经分割并处理完的sql语句
                reportSQL=reportSQL.replace(splitedSql,'');
                if (i == matchResult.length - 2) {//最后一个use的sql部分
                    var lastIndex = reportSQL.indexOf(matchResult[matchResult.length - 1]);
                    splitedSql = reportSQL.substring(lastIndex);//最后的use
                    splitedSqlArray.push(splitedSql);
                }

            }
        } else if (matchResult.length == 1) {
            var splitedSql = '';
            var prevIndex = reportSQL.indexOf(matchResult[0]);
            var splitedSql = reportSQL.substring(prevIndex);//只有一个use的情况
            splitedSqlArray.push(splitedSql);
        }
    }
    return splitedSqlArray;
}

/**
 *
 * @summary 产生报告内容所需数据源
 * @param {Object} configInfo 配置信息
 * @param {Function} callback 回调函数
 * */
function getReportDataSource(configInfo, callback){
    async.waterfall([
        function(cb){
            if(sqlStringValidation(configInfo.reportSQL)){
                var sqlArray=getSqlArray(configInfo.reportSQL);
                cb(null, sqlArray);
            }else{
                cb(new Error('报告sql语句不合法,不能包含delete或update关键字'),null);
            }
        },
        function(sqlArray,cb){
            if(sqlArray.length==0){
                cb(new Error('形成报告的sql语句有错误,无法完成数据查询操作!请仔细检查!'),null);
            }else{
                var resultArray = [];//所有sql执行完成的结果
                var counter=0;
                async.eachSeries(sqlArray,function(currentSql,innerCallback){
                    //移除每句前的use
                    var partern = /\buse\b\s+(.*?);/gi;
                    var matchResult = currentSql.match(partern);
                    var dbConfig = configInfo.dbConfig;
                    var currentDb=matchResult[0].replace(/\buse\b/gi,'');
                    currentDb=replaceAll(currentDb,';','');//当前对应的数据库
                    dbConfig.database = currentDb.trim();//修改当前执行sql对应的数据库名称
                    var pool = new DbHelper(dbConfig);
                    currentSql=replaceAll(currentSql,matchResult[0],'').trim();//去除sql前的use语句
                    pool.ExecuteQueryNoCache(currentSql,function(err,result){
                        if(err){
                            innerCallback(err);
                        }else{
                            counter++;
                            resultArray.push(result);
                            innerCallback(null);
                        }
                    });
                },function(err){
                    if(err){
                        cb(err, null);
                    }else{
                        cb(null, resultArray);
                    }
                });
            }
        }
    ],function(err,result){
        callback(err,result);
    });

}

/**
 *
 * @summary 获取产生报告内容的html模板
 * @param {String} filePath 模板路径 ../public/manage/reportTemplate.html
 * */
function getReportTemplate(filePath) {
    var htmlTemplate = fs.readFileSync(filePath, "utf-8");
    return htmlTemplate;
}

/**
 *
 * @summary 根据id对应检查点的配置信息
 * @param {Number} configId 配置文件id
 * @param {Function} callback 回调函数
 * */
function getConfigInfoById(configId, callback) {
    var configInfo = {
        dbConfig: {
            connectionLimit: 10,
            host: '',
            port: '',
            user: '',
            password: '',
            database: '',
            multipleStatements: true
        },
        reportSQL: '',
        reportTitle: '',
        reportTablenames:'',
        reportEntireTitle:'',
        report_version:'',
        emailConfig: {
            smtp_server: '',
            port: '',
            userpwd: '',
            from: '',
            to: '',
            cc: '',
            times: '',
            report_templatepath: ''
        },
        reportStatus: 0
    };
    var sql = "select * from " + bussinessTable.b_reportConfig + " where id=?";
    var sqlParams = [];
    sqlParams.push(configId);
    defaultPool.ExecuteQueryNoCache(sql, sqlParams, function (err, res) {
        if (res.length > 0) {
            var data = res[0];
            configInfo.reportSQL = data.report_querysql;//生成报告主体的sql语句
            configInfo.reportTitle = data.report_title;//报告主题
            configInfo.reportEntireTitle=data.report_entireTitle;//整个大报告的标题
            configInfo.reportTablenames=data.report_tablenames;//报告内容中对应的表名
            configInfo.report_version=data.report_version;//对应的报告版本
            configInfo.dbConfig.host = data.db_ip;//数据库ip
            configInfo.dbConfig.port = data.db_port;//数据库端口
            configInfo.dbConfig.user = data.db_username;//数据库用户名
            configInfo.dbConfig.password = data.db_passwd;
            configInfo.dbConfig.database = data.db_dbname;
            configInfo.emailConfig.smtp_server = data.email_smtp_server;//SMTP服务器
            configInfo.emailConfig.port = data.email_port;
            configInfo.emailConfig.userpwd = data.email_passwd;
            configInfo.emailConfig.from = data.email_sender;
            configInfo.emailConfig.to = data.email_reciever;
            configInfo.emailConfig.cc = data.email_cc;
            configInfo.reportStatus = data.job_status;//报告状态
            configInfo.emailConfig.report_templatepath = data.report_templatepath;//报告模板路径
            configInfo.emailConfig.times = data.email_sendTimes;//发送频率
        }
        callback(err, configInfo);
    });
}

/**
 *
 * @summary 正则表达式，特殊字符转义
 * @param {String} string
 * */
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 *
 * @summary 替换字符串
 * @param {String} string
 * @param {String} find
 * @param {String} replace
 * */
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 *
 * 定时发送邮件任务监视对象
 * */
function scheduleJobMonitor(){}

scheduleJobMonitor.prototype={
    init:function(){
        var that=this;
        that.startJob();//启动监视
    },
    startJob:function(){
        var that=this;
        async.waterfall([
            function(callback){//查询需要启动的Job
                var sql = "select id from " + bussinessTable.b_reportConfig+" where job_status=1 order by id asc";
                defaultPool.ExecuteQueryNoCache(sql, function(err,result){
                    callback(err,result);
                });
            },
            function(dataRow,callback){
                if(dataRow.length>0){
                    async.eachSeries(dataRow,function(row,innerCallback){
                        var rowId=row["id"];
                        that.startScheduleById(rowId,function(err,result){
                            innerCallback(err);
                        });
                    },function(err){
                        callback(err,dataRow);
                    });
                }else{
                 callback(null, dataRow);
                }
            },
            function(dataRow,callback){//再次确认个别job是否被认为删除了
                if(dataRow.length>0){
                    for(var index in global.scheduleJobKeys){
                        if(!containsKey(dataRow,index)){
                            //根据key取得单个检查点下的所有子任务ID
                            var jobKeys=global.scheduleJobKeys[index];
                            async.eachSeries(jobKeys, function(jobKey,innerCallback){
                                //停止归属当前检查点的子计划任务
                                global.scheduleJob[jobKey].stop();
                                //清空归属当前检查点的子计划任务
                                delete  global.scheduleJob[jobKey];
                                innerCallback(null);//继续执行
                            },function(err){
                                //删除分类中 记录检查点 子任务的值
                                delete global.scheduleJobKeys[index];
                            });
                        }
                    }
                    callback(null,dataRow);
                }else{
                    //没有任务运行时，重置全局对象
                    global.scheduleJob=new Object();
                    global.scheduleJobKeys=new Object();
                    callback(null,dataRow);
                }
            },
            function(arg1,callback){//查询需要停止的job
                var sql = "select id from " + bussinessTable.b_reportConfig+" where job_status=0 order by id asc";
                defaultPool.ExecuteQueryNoCache(sql, function(err,result){
                    callback(err,result);
                });
            },
            function(dataRow,callback){
                if(dataRow.length>0){
                    async.eachSeries(dataRow,function(row,innerCallback){
                        that.stopScheduleById(row["id"],function(err,result){
                            innerCallback(err);
                        });
                    },function(err){
                        callback(err,null);
                    });
                }else{
                    callback(null, null);
                }
            }
        ],function(err,result){});//这里回调函数中不需要任何操作
    },
    startScheduleById:function(id,callback){
        var id = Number(id);
        var key = keyPart + id;

        //服务刚启动时，计划任务对象为null,在执行启动时，需要初始化
        if (global.scheduleJob == null) {
            //初始化计划任务对象
            global.scheduleJob = new Object();
        }
        if( global.scheduleJobKeys==null){
            global.scheduleJobKeys=new Object();
        }

        async.waterfall([
            function (cb) {
                getConfigInfoById(id, function (err, result) {
                    cb(err, result);
                });
            },
            function (configInfo, cb) {
                var emailSendTimes=configInfo.emailConfig.times;
                var timeArray=getArrayBySplitString(emailSendTimes,'|');
                var counter=0;
                var currentScheduleJobs=[];
                if(timeArray.length>0){
                    async.eachSeries(timeArray,function(cronTimeString,innerCallback){
                        counter++;
                        //当前检查点的子任务ID
                        var uniqueScheduleKey=key+"_00"+counter;
                        //当前检查点的子任务ID到数组
                        currentScheduleJobs.push(uniqueScheduleKey);
                        if (!global.scheduleJob[uniqueScheduleKey]) {
                            try{
                                global.scheduleJob[uniqueScheduleKey] = new CronJob(cronTimeString, function () {
                                //if(id==9){
                                    sendCheckPointReportById(id, function (err, result) {
                                        if (err) {
                                            appEmailSenderLogger.info('检查点:['+configInfo.reportTitle+'] 邮件发送失败! 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+"] 错误信息:"+err.message);
                                            console.error(err);
                                        } else {
                                            var successMessage='检查点:['+configInfo.reportTitle+'] 邮件发送成功! 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+"] 发送信息:"+result.response;
                                            appEmailSenderLogger.info(successMessage);
                                        }
                                    });
                               //}
                                }, null, false, null);
                               global.scheduleJob[uniqueScheduleKey].start();
                                innerCallback(null);//成功启动后，执行下一步操作
                            }catch (ex){
                                var invalidCron="cron时间格式不正确！";
                                console.error(new Error(invalidCron));
                                appEmailSenderLogger.info('检查点:['+configInfo.reportTitle+'] 邮件发送失败! 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+"] 错误信息:"+invalidCron);
                                innerCallback(new Error(invalidCron));
                            }
                        }else{
                            innerCallback(null);
                        }
                    },function(err){
                        if(err){
                            cb(err, null);
                        }else{
                            if(!global.scheduleJobKeys[key]){
                                //存储当前检查点中对应的多个子任务
                                global.scheduleJobKeys[key]=currentScheduleJobs;
                            }
                            cb(null,null);
                        }

                    });
                }else{
                    cb(null,null);
                }
            }
        ], function (err, finalResult) {
            callback(err,finalResult);
        });
    },
    stopScheduleById:function(id,callback){
        var key = keyPart + id;
        if(global.scheduleJobKeys!=null){
            if(global.scheduleJobKeys[key]){
                //根据key取得单个检查点下的所有子任务ID
                var jobKeys=global.scheduleJobKeys[key];
                async.eachSeries(jobKeys, function(jobKey,innerCallback){
                    //停止归属当前检查点的子计划任务
                    global.scheduleJob[jobKey].stop();
                    //清空归属当前检查点的子计划任务
                    delete  global.scheduleJob[jobKey];
                    innerCallback(null);//继续执行
                },function(err){
                    //删除分类中 记录检查点 子任务的值
                    delete global.scheduleJobKeys[key];
                    callback(err,null);
                });
            }else{
                callback(null, null);
            }
        }else{
            callback(null, null);//无需删除
        }
    },
    stopJobImmediately:function(){//如果有修改操作需要立即停止执行并清空Job列表中原来的任务，否则之前的存在的Job会永远执行任务
        var that=this;
        async.waterfall([
            function(callback){//查询需要停止的job
                var sql = "select id from " + bussinessTable.b_reportConfig+" where job_status=0 order by id asc";
                defaultPool.ExecuteQueryNoCache(sql, function(err,result){
                    callback(err,result);
                });
            },
            function(dataRow,callback){
                if(dataRow.length>0){
                    async.eachSeries(dataRow,function(row,innerCallback){
                        that.stopScheduleById(row["id"],function(err,result){
                            innerCallback(err);
                        });
                    },function(err){
                        callback(err,null);
                    });
                }else{
                    callback(null, null);
                }
            }
        ],function(err,result){});//回调函数中不需要添加内容
    }
};

/**
 *
 * 判断任务数组中是否包含未清除的计划任务
 * */
function containsKey(dataRow, key) {
    var i = dataRow.length;
    while (i--) {
        var singleRowObj=dataRow[i];
        if ((keyPart+singleRowObj["id"]) == key) {
            return true;
        }
    }
    return false;
}

/**
 *
 * 重启报告工具监视服务，及时释放相关资源
 * */
function restartReportMonitor(){
   var isWin = /^win/.test(process.platform);
   if(!isWin){
       var emailSenderServicePath=path.resolve(__dirname,"../"+ConfigInfo.EmailCheckFrequency.serviceName);
       var serviceShellPath=path.resolve(__dirname,"../lib/report/"+ConfigInfo.EmailCheckFrequency.serveceShellName);
       var reportShell=spawn(serviceShellPath,[emailSenderServicePath,ConfigInfo.EmailCheckFrequency.serviceName]);
       reportShell.on('exit',function(code){
           reportLogger.info('重启邮件服务的shell脚本执行完毕! 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
           console.log('Report service manually-restarted successfully. 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
       });
   }else{
       reportLogger.info('服务器环境为windows，配置信息已发生更改，请手工重启邮件服务 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
       console.log("The platForm is windows. You need to restart the report service manually.");
   }
}

exports.scheduleJobMonitor=scheduleJobMonitor;