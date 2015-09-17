/**
 * Created by wang on 2014/11/26.
 */
var CronJob = require('cron').CronJob;
var ConfigInfo = require("./Config.js");
var moment = require("moment");
var spawn=require('child_process').spawn;
var path = require("path");
var reportMonitor = require("./APIModule/reportToolsMoudle.js");

//按照间隔时间，自动重启监视服务，及时释放资源
var resReleaseJob=new CronJob(ConfigInfo.EmailCheckFrequency.restartInterval, function(){
    restartReportMonitor();
}, null, true, null);

//按照设置的时间，定时启动Job任务
var emailsenderJob=new CronJob(ConfigInfo.EmailCheckFrequency.timeInterval, function(){
    var monitor=new reportMonitor.scheduleJobMonitor();
    monitor.init();
}, null, true, null);
var serverMessage="系统运维工具-守护进程已成功启动！时间:["+moment().format('YYYY-MM-DD HH:mm:ss')+"]";
console.log(serverMessage);

/**
 *
 * 重启报告工具监视服务，及时释放相关资源
 * */
function restartReportMonitor(){
    var emailSenderServicePath=path.resolve(__dirname,ConfigInfo.EmailCheckFrequency.serviceName);
    var serviceShellPath=path.resolve(__dirname,"./lib/report/"+ConfigInfo.EmailCheckFrequency.serveceShellName);
    var reportShell=spawn(serviceShellPath,[emailSenderServicePath,ConfigInfo.EmailCheckFrequency.serviceName]);
    reportShell.on('exit',function(code){
        console.log('Report service auto-restarted successfully!. 时间:['+moment().format('YYYY-MM-DD HH:mm:ss')+']');
    });
}

//××××××××××××××××××××如果环境部署在windows环境时，需要下面的任务进行实时性检查××××××××××××××××
//实时检查已经被人为停止的Job，并从Job列表中及时删除
//var immediateJob=new CronJob('* * * * * *', function(){
//    var monitor=new reportMonitor.scheduleJobMonitor();
//    monitor.stopJobImmediately();
//}, null, true, null);
//××××××××××××××××××××××××××××结束×××××××××××××××××××××××××××××××××××××××××××××××××××××××××