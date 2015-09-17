/**
 * 舆情后台管理模块
 */
var pool = require('../lib/DbHelper.js');
var ConfigInfo = require('../Config.js');
//var DbHelper = new DbHelperClass(ConfigInfo.BusinessDB);
var utility = require('../lib/Utility');
//var utility = new UtilityLib();
//数据源管理
function DataSourceURLManage() {
}
/*父级数据源URL查找，支持筛选、排序和分页*/
DataSourceURLManage.prototype.GetDataSourceURLs = function (req, res) {
    var paraObject = req.body.params;
    var sqlResource = ExportQueryParameters(paraObject);
    var sqlCommand = "select website_id as 'id',website_name as 'name'," +
        "website as 'url',category as 'kind',website_weight as 'level' "
        + "from sys_website_list "
        + sqlResource.Where
        + sqlResource.OrderBy
        + sqlResource.Limit;
    pool.ExecuteQuery(sqlCommand, sqlResource.SqlParameters, function (err, result) {
        if (err) {
            return console.log('[backstageManagement GetDataSourceURLs] error:' + err.message);
        }
        res.json(result);
    });
};
/*父级数据源URL添加*/
DataSourceURLManage.prototype.AddDataSourceURL = function (req, res) {
    //抽取数据
    var tenant_id = req.body.tenantID;
    var website_name = req.body.webSiteName;
    var website = req.body.webSiteURL;
    var category = req.body.category;
    var region = req.body.region || null;
    var url_keyword = req.body.keyWord || null;
    var website_weight = req.body.webSiteWeight || null;
    var is_confirmed = req.body.isConfirmed || 1;
    var is_merged = req.body.isMerged || 0;
    //已有项检查
    var sqlCommand_CheckExisting = " select website_id,tenant_id,website_name, "
        + " website,category,region,url_keyword,website_weight, "
        + " is_confirmed,is_merged "
        + " from sys_website_list "
        + " where tenant_id=? and website=? and category=? and website_weight=? and "
        + " is_confirmed=1 and is_merged=0; ";
    var sqlParameters_CheckExisting=[tenant_id,website,category,website_weight];
    CheckExistingItem(sqlCommand_CheckExisting,sqlParameters_CheckExisting,function(isExisted,result){
        if(isExisted){
            res.json({ActionResult:0,RelatedItem:result});//发现已有项，返回状态和查找到的重复项
        }
        else{
            var sqlCommand_Adding="INSERT INTO `sys_website_list`"+
                "(`tenant_id`,`website_name`,`website`,`category`,"+
                "`region`,`url_keyword`,`website_weight`,`is_confirmed`,`is_merged`)"+
                "VALUES(?,?,?,?,?,?,?,?,?);";
            var sqlParameters_Adding=[Number(tenant_id),website_name,website,category,
                region,url_keyword,Number(website_weight),Number(is_confirmed),Number(is_merged)];
            pool.ExecuteQuery(sqlCommand_Adding,sqlParameters_Adding,function(err,result){
                if (err) {
                    return console.log('[backstageManagement AddDataSourceURL] error:' + err.message);
                }
                res.json(result);
            });
        }
    });
};
/*父级数据源URL修改*/
DataSourceURLManage.prototype.UpdateDataSourceURL=function(req,res){
    var website_id=req.body.webSiteID;
    var tenant_id = req.body.tenantID;
    var website_name = req.body.webSiteName;
    var website = req.body.webSiteURL;
    var category = req.body.category;
    var region = req.body.region || null;
    var url_keyword = req.body.keyWord || null;
    var website_weight = req.body.webSiteWeight || null;
    var is_confirmed = req.body.isConfirmed || 1;
    var is_merged = req.body.isMerged || 0;

    var sqlCommand="UPDATE `sys_website_list`"+
        "SET `website_name` = ?," +
        "`website` = ?," +
        "`category` = ?," +
        "`region` = ?," +
        "`url_keyword` = ?," +
        "`website_weight` = ?," +
        "`is_confirmed` = ?," +
        "`is_merged` = ?," +
        "WHERE `website_id` = ? AND `tenant_id` = ?;";
    var sqlParameters=[website_name,
        website,
        category,
        region,
        url_keyword,
        Number(website_weight),
        Number(is_confirmed),
        Number(is_merged),
        Number(website_id),Number(tenant_id)];
    pool.ExecuteQuery(sqlCommand,sqlParameters,function(err,result){
        if (err) {
            return console.log('[backstageManagement UpdateDataSourceURL] error:' + err.message);
        }
        res.json({UpdateState:true,UpdateRowCount:result.affectedRows});
    });
};
/*父级数据源URL删除，级联删除即删除父级子级也会被删除*/
DataSourceURLManage.prototype.DeleteDataSourceURLByID=function(req,res){
    var website_id=req.body.webSiteID;
    var sqlCommand="DELETE FROM `sys_website_list` " +
        "WHERE website_id=?; " +
        "SET SQL_SAFE_UPDATES=0; " +
        "DELETE FROM `sys_website_field` " +
        "WHERE website_id=?; ";
    var sqlParameters=[Number(website_id),Number(website_id)];
    pool.ExecuteQuery(sqlCommand,sqlParameters,function(err,result){
        if (err) {
            return console.log('[backstageManagement DeleteDataSourceURLByID] error:' + err.message);
        }
        res.json({DeleteState:true,DeleteRowCount:result.affectedRows});
    });
};
//子数据源管理
function SubDataSourceURLManage() {
}
/*子级数据源URL查找，支持筛选、排序和分页*/
SubDataSourceURLManage.prototype.GetSubDataSourceURLs = function (req, res) {
    var paraObject = req.body.params;
    var sqlResource = ExportQueryParameters(paraObject);
    var sqlCommand = "select subwebsite_id as 'id',tab_name as 'name'," +
        "tab_url as 'url',region,url_keyword as 'keyword',website_weight as 'level'"
        + "from sys_website_field "
        + sqlResource.Where
        + sqlResource.OrderBy
        + sqlResource.Limit;
    pool.ExecuteQuery(sqlCommand, sqlResource.SqlParameters, function (err, result) {
        if (err) {
            return console.log('[backstageManagement SubDataSourceURLManage] error:' + err.message);
        }
        res.json(result);
    });
};
/*子级数据源URL添加*/
SubDataSourceURLManage.prototype.AddSubDataSourceURL = function (req, res) {
    //抽取数据
    var tenant_id = req.body.tenantID;
    var website_id=req.body.webSiteID;
    var tab_name = req.body.subSiteName;
    var tab_url = req.body.subSiteURL;
    var region = req.body.region || null;
    var url_keyword = req.body.keyWord || null;
    var website_weight = req.body.webSiteWeight || null;
    var is_confirmed = req.body.isConfirmed || 1;
    var is_merged = req.body.isMerged || 0;
    //已有项检查
    var sqlCommand_CheckExisting = " select website_id,tenant_id,tab_name, "
        + " tab_url,region,url_keyword,website_weight, "
        + " is_confirmed,is_merged "
        + " from sys_website_field "
        + " where tenant_id=? and tab_url=? and website_weight=? and website_id=? and"
        + " is_confirmed=1 and is_merged=0; ";
    var sqlParameters_CheckExisting=[Number(tenant_id),tab_url,Number(website_weight),Number(website_id)];
    CheckExistingItem(sqlCommand_CheckExisting,sqlParameters_CheckExisting,function(isExisted,result){
        if(isExisted){
            res.json({ActionResult:0,RelatedItem:result});//发现已有项，返回状态和查找到的重复项
        }
        else{
            var sqlCommand_Adding="INSERT INTO `sys_website_field`"+
                "(`tenant_id`,`website_id`,`tab_name`,`tab_url`,"+
                "`region`,`url_keyword`,`website_weight`,`is_confirmed`,`is_merged`)"+
                "VALUES(?,?,?,?,?,?,?,?,?);";
            var sqlParameters_Adding=[Number(tenant_id),Number(website_id),tab_name,tab_url,
                region,url_keyword,Number(website_weight),Number(is_confirmed),Number(is_merged)];
            pool.ExecuteQuery(sqlCommand_Adding,sqlParameters_Adding,function(err,result){
                if (err) {
                    return console.log('[backstageManagement AddDataSourceURL] error:' + err.message);
                }
                res.json(result);
            });
        }
    });
};
/*子级数据源URL修改*/
SubDataSourceURLManage.prototype.UpdateSubDataSourceURL=function(req,res){
    var subwebsite_id=req.body.subWebSiteID;
    var website_id=req.body.webSiteID;
    var tenant_id = req.body.tenantID;
    var tab_name = req.body.subSiteName;
    var tab_url = req.body.subSiteURL;
    var region = req.body.region || null;
    var url_keyword = req.body.keyWord || null;
    var website_weight = req.body.webSiteWeight || null;
    var is_confirmed = req.body.isConfirmed || 1;
    var is_merged = req.body.isMerged || 0;

    var sqlCommand="UPDATE `sys_website_field` "+
        "SET " +
        "`website_id`=?, " +
        "`tab_name` = ?, " +
        "`tab_url` = ?, " +
        "`region` = ?, " +
        "`url_keyword` = ?, " +
        "`website_weight` = ?, " +
        "`is_confirmed` = ?, " +
        "`is_merged` = ?, " +
        "WHERE `subwebsite_id` = ? AND `tenant_id` = ?; ";
    var sqlParameters=[
        website_id,
        tab_name,
        tab_url,
        region,
        url_keyword,
        Number(website_weight),
        Number(is_confirmed),
        Number(is_merged),
        Number(subwebsite_id),Number(tenant_id)];
    pool.ExecuteQuery(sqlCommand,sqlParameters,function(err,result){
        if (err) {
            return console.log('[backstageManagement AddDataSourceURL] error:' + err.message);
        }
        res.json({UpdateState:true,UpdateRowCount:result.affectedRows});
    });
};
/*子级数据源URL删除*/
SubDataSourceURLManage.prototype.DeleteSubDataSourceURLByID=function(req,res){
    var subwebsite_id=req.body.subWebSiteID;
    var sqlCommand=
        "DELETE FROM `sys_website_field` " +
        "WHERE subwebsite_id=?; ";
    var sqlParameters=[Number(subwebsite_id)];
    pool.ExecuteQuery(sqlCommand,sqlParameters,function(err,result){
        if (err) {
            return console.log('[backstageManagement DeleteDataSourceURLByID] error:' + err.message);
        }
        res.json({DeleteState:true,DeleteRowCount:result.affectedRows});
    });
};

/**
 * 公有方法
 */
//解析查询参数
function ExportQueryParameters(parameterObject) {
    var _where = " where 1=1 ";
    var _orderby = " order by ";
    var _limit = "";
    var sqlParameters = [];
    //参数Json化
    var parameters = utility.ParamToJson(parameterObject);
    //模糊查询
    if (utility.isValidData(parameters.fuzzayquery)) {
        var fuzzayQuery = parameters.fuzzayquery;
        if (utility.isValidData(fuzzayQuery)) {
            for (var fzcolumn in fuzzayQuery) {
                _where += "and " + fzcolumn + "like '%?%' ";
                sqlParameters.push(fuzzayQuery[fzcolumn]);
            }
        }
    }
    //精确查询
    else {
        var query = parameters.query;
        if (utility.isValidData(query)) {
            for (var column in query) {
                _where += "and " + column + "=? ";
                sqlParameters.push(query[column]);
            }
        }
    }

    //生成排序SQL语句（默认排序id，数据库负责）
    var orderBy = parameters.orderby;
    if (utility.isValidData(orderBy)) {
        for (var order in orderBy) {
            _orderby += (order + " " + orderBy[order] + ",");
        }
        _orderby = _orderby.substr(0, _orderby.length - 1);
        //没有排序列则采用数据默认排序，去除order by命令
    }
    if (_orderby == ' order by '||_orderby == ' order by') {
        _orderby = '';
    }

    //生成分页SQL语句（默认取前10）
    var pagination = parameters.pagination;
    if (utility.isValidData(pagination)) {
        if (utility.isValidData(pagination.pagesize)
            && utility.isValidData(pagination.pageIndex)
            && !isNaN(pagination.pagesize)
            && !isNaN(pagination.pageindex)) {
            _limit = " limit ?,?;";
            sqlParameters.push(parseInt(pagination.pagesize) * parseInt(pagination.pageindex));
            sqlParameters.push(parseInt(pagination.pagesize));
        }
        //默认取前10
        else {
            _limit = " limit ?,?;";
            sqlParameters.push(0);
            sqlParameters.push(10);
        }
    }
    //Where:where条件sql语句
    //OrderBy:order by 条件语句
    //Limit:limit命令sql语句
    //sqlParameters:sql 命令参数数组
    return {Where: _where, OrderBy: _orderby, Limit: _limit, SqlParameters: sqlParameters};
}

function CheckExistingItem(sqlCommand, sqlParameters, callback) {
    pool.ExecuteQuery(sqlCommand, sqlParameters, function (err, result) {
        if (err)
            return console.log('[backstageManagement CheckExistingItem] error:' + err.message);
        if (result.length > 0) {
            callback(true,result);//发现已有项
        }
        else{
            callback(false);//未发现已有项
        }
    });
}

exports.DataSourceURLManage = new DataSourceURLManage();
exports.SubDataSourceURLManage = new SubDataSourceURLManage();