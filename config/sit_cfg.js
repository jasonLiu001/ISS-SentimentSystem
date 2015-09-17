var ConfigInfo = function(){};

var ConnectionConfig = function (option) {
    this.host = option.host || '127.0.0.1';
    this.user = option.user || 'root';
    this.password = option.password || '1qaz@WSX';
    this.database = option.database || 'digital_marketing_dev';
    this.connectionLimit = option.connectionLimit || 10;
};

ConfigInfo.prototype.StagingDB ={
    connectionLimit: 10,
    host: '115.28.205.176',
    user: 'root',
    password: 'Pass@word1',
    database: 'data_exchange_center_db',
    multipleStatements: true
};

ConfigInfo.prototype.BusinessDB = {
    connectionLimit: 10,
    host: '10.9.100.42',
    user: 'root',
    password: 'Pass@word1',
    database: 'digital_marketing_prod',//'digital_marketing_sit',
    multipleStatements: true
};

ConfigInfo.prototype.DbTables = {
    db_group: 'core_group',
    db_user: 'core_user',
    db_user_group: 'core_user_group',
    db_acl: 'core_acl',
    db_group_subscription: 'core_group_subscription',
    db_model: 'core_model',
    db_api: 'core_api',
    db_model_subscription: 'core_model_subscription',
    db_api_subscription: 'core_api_subscription',
    db_core_usersecurity: 'core_usersecurity',
    db_cfg_dictpolarity: 'cfg_dictpolarity',
    db_cfg_sys_information_tag: 'cfg_sys_information_tag',
    db_cfg_sys_topic_tag: 'cfg_sys_topic_tag'
};

ConfigInfo.prototype.TokenConfig = {
    SkipVerification: ['image',
        'img',
        'js',
        'css',
        'verification',
        'login',
        'apiLogin',
        'GetLastAppFile',
        'GetCityInfoSummary',
        'room14.html',
        'room9.html',
        'map.html',
        'login.html',
        'app',
        'favicon.ico',
        'segment.html',
        'reportHome.html',
        'getReportLog',
        'maintain',
        'GetTenantList',
        'footer.html',
        'GetVersion',
        'indexPage.html',
        'simulateLogin.html',
        'index.html',
        'header.html',
        'footer.html'
    ],
    TokenSaveDays: 7,//用于配置在mySqlDB/Redis中token的过期时间，单位：天
    DefaultRedirectPage: "/login.html"
};

ConfigInfo.prototype.ExpressStaticOption={
    index: "login.html"
}

ConfigInfo.prototype.RedisSettings = {
    host: "127.0.0.1",
    port: 6379,
    dataExpires: 60 * 15, //用于配置在Redis存储的数据过期时间，单位：秒。
    expires: 60 * 60 * 24 * 7//用于配置在Redis存储的数据本身过期时间，单位：秒
};

ConfigInfo.prototype.BasicSettings = {
    positiveValue: 3,//正面
    negativeValue: -3,//负面
    cookieAge: 5 * 60 * 1000,
    sitePort: 8888,
    currentDB:new ConfigInfo().BusinessDB,
    cookieSecret: "iMarketing",
    environment: "SIT", //"PROD" "SIT"，
    innerVersion: "0.5.50.150317.912"//deploy version
};

/**
 *
 * 运维报告工具Job守护进程检查频率
 * */
ConfigInfo.prototype.EmailCheckFrequency={
    timeInterval:'0 */5 * * * *',//默认5分钟检查一次
    restartInterval:'30 03 06,23 * * *',//自动启动
    serviceName:"app.emailsender.js",//监视服务名称
    serveceShellName:"reportservice.sh"//调用监视服务shell脚本
};
/**
 *
 * 运维报告工具V2.0 查询数据接口
 * */
ConfigInfo.prototype.SolrQueryInterface={
    crawlerPlatForm:'http://192.168.100.31:8080/solr/collection1/select?q=',//爬虫平台Solr接口
    crawlerSearchParam:{
        publishDate:'[2015-05-13T00:00:00Z TO 2015-05-13T23:59:59Z]',
        publishDate_start:'T00:00:00Z',
        publishDate_end:'T23:59:59Z',
        mediaType:3
    },
    analyzePlatForm:'http://192.168.100.211:8888/solr/crawler_core/select?q=',//查询运算平台Solr接口
    analyzeSearchParam:{
        publish_time:'[2015-05-13T00:00:00Z TO 2015-05-13T23:59:59Z]',
        publish_time_start:'T00:00:00Z',
        publish_time_end:'T23:59:59Z',
        mediaType:3
    }
};
module.exports = new ConfigInfo();


