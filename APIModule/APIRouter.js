/**
 * Created by Administrator on 2014/7/28.
 */
var express = require('express');
var router = express.Router();

var tenant = require("./tenant.js");
var authentication = require("./authentication.js");
var middleware = require("./middleware.js");
var manage = require('./manage.js');
var emergencyPlan=require("../model/EmergencyPlan.js");

var backstageMgt=require('./backstageManagement.js');
var dataSourceMgt=backstageMgt.DataSourceURLManage;
var subDataSourceMgt =backstageMgt.SubDataSourceURLManage;

var segment=require('./segmentModule.js');
var polarity=segment.Polarity,
    wordStatistics=segment.wordStatistics;
var customSettings = require('./customSettings.js');
var categoryTag = customSettings.CategoryTag,
    topicTag = customSettings.TopicTag,
    searchKeywords = customSettings.SearchKeywords;

var quickDeploy=require("./initializer.js");
var reportTools=require('./reportToolsMoudle.js');

router.get('/api/middleware/GetCityInfoSummary', middleware.GetCityInfoSummary);
router.post('/api/middleware/GetVersion',middleware.GetVersion);
router.get('/api/authentication/verification', authentication.GenerateVerificationCode);
router.post('/api/authentication/login', authentication.PostLogin);
router.post('/api/authentication/apiLogin',authentication.ApiLogin);

router.get('/api/authentication/getToken', authentication.GetClientInfo);
router.get('/api/authentication/logout', authentication.Logout);
router.post('/api/authentication/refreshtoken', authentication.RefreshToken);

router.post("/api/tenant/AddTenant", tenant.AddTenant);
router.post('/api/tenant/GetTenantList', tenant.GetTenantList);
router.post('/api/tenant/AddTenantUser', tenant.AddTenantUser);
router.get('/api/tenant/DeleteUserByUserID', tenant.DeleteUserByUserID);
router.get('/api/tenant/GetGroupByTenant', tenant.GetGroupByTenant);
router.get('/api/tenant/GetUserListByTenant', tenant.GetUserListByTenant);
router.get('/api/tenant/GetGroupByTUser', tenant.GetGroupByTUser);
router.get('/api/tenant/GetVerificationCode', tenant.GetVerificationCode);
router.post('/api/tenant/UpdateTenant', tenant.UpdateTenant);
router.get('/api/tenant/GetTenantDetailsById', tenant.GetTenantDetailsById);
router.get('/api/tenant/GetDomainByTenantId', tenant.GetDomainByTenantId);
router.get('/api/tenant/GetDomainByTenantUserId', tenant.GetDomainByTenantUserId);
router.get('/api/tenant/GetTenantByUserId', tenant.GetTenantByUserId);
router.post('/api/tenant/DeleteTenant', tenant.DeleteTenant);

router.post('/api/middleware/GetBrands', middleware.GetBrands);
router.post('/api/middleware/GetNewsList', middleware.GetNewsList);
router.post('/api/middleware/GetNewsListByBrand', middleware.GetNewsListByBrand);
router.post('/api/middleware/GetHandleStatus', middleware.GetHandleStatus);
router.post('/api/middleware/GetWeiBoList', middleware.GetWeiBoList);
router.post('/api/middleware/GetWeiBoListByBrand', middleware.GetWeiBoListByBrand);
router.post('/api/middleware/GetEnNewsList', middleware.GetEnNewsList);
router.post('/api/middleware/GetEnNewsListBrand', middleware.GetEnNewsListByBrand);
router.post('/api/middleware/GetWeiXinList', middleware.GetWeiXinList);
router.post('/api/middleware/GetWeiXinListBrand', middleware.GetWeiXinListByBrand);
router.post('/api/middleware/EditNewsByID', middleware.EditNewsByID);
router.post('/api/middleware/EditWeiBoByID', middleware.EditWeiBoByID);
router.post('/api/middleware/EditWeiXinByID', middleware.EditWeiXinByID);
router.post('/api/middleware/EditNews', middleware.EditNews);
router.post('/api/middleware/EditWeiBo', middleware.EditWeiBo);
router.post('/api/middleware/EditWeiXin', middleware.EditWeiXin);
router.post('/api/middleware/DeleteNews', middleware.DeleteNews);
router.post('/api/middleware/DeleteWeiBo', middleware.DeleteWeiBo);
router.post('/api/middleware/DeleteWeiXin', middleware.DeleteWeiXin);
router.post('/api/middleware/EditNewsOfBatch', middleware.EditNewsOfBatch);
router.post('/api/middleware/EditWeiBoOfBatch', middleware.EditWeiBoOfBatch);
router.post('/api/middleware/EditWeiXinOfBatch', middleware.EditWeiXinOfBatch);
router.post('/api/middleware/GetNewsHandleLog', middleware.GetNewsHandleLog);
router.post('/api/middleware/GetWeiBoHandleLog', middleware.GetWeiBoHandleLog);
router.post('/api/middleware/GetWeiXinHandleLog', middleware.GetWeiXinHandleLog);

router.post('/api/middleware/GetHotWords', middleware.GetHotWords);
router.post('/api/middleware/GetWeiBoHot', middleware.GetWeiBoHot);

router.post('/api/middleware/GetSentimentLinear', middleware.GetSentimentLinear);
router.post('/api/middleware/GetNewsSentimentPie', middleware.GetNewsSentimentPie);
router.post('/api/middleware/GetWeiBoSentimentPie', middleware.GetWeiBoSentimentPie);
router.post('/api/middleware/GetNewsAndWeiBoSentimentPie', middleware.GetNewsAndWeiBoSentimentPie);
router.post('/api/middleware/GetSentimentPie', middleware.GetSentimentPie);

router.post('/api/middleware/GetNewsSentimentMonth', middleware.GetNewsSentimentMonth);
router.post('/api/middleware/GetWeiXinSentimentMonth', middleware.GetWeiXinSentimentMonth);
router.post('/api/middleware/GetWeiBoSentimentMonth', middleware.GetWeiBoSentimentMonth);

router.post('/api/middleware/GetNewsSentimentMonitor', middleware.GetNewsSentimentMonitor);
router.post('/api/middleware/GetWeiBoSentimentMonitor', middleware.GetWeiBoSentimentMonitor);
router.post('/api/middleware/GetWeiBoSentimentPublish', middleware.GetWeiBoSentimentPublish);

router.post('/api/middleware/GetWeiBoSentimentDay', middleware.GetWeiBoSentimentDay);
router.post('/api/middleware/GetNewsSentimentDay', middleware.GetNewsSentimentDay);
router.post('/api/middleware/GetWeiBoAndNewsSentimentDay', middleware.GetWeiBoAndNewsSentimentDay);
router.post('/api/middleware/GetWeiBoAndNewsSentimentScoreDay', middleware.GetWeiBoAndNewsSentimentScoreDay);

router.post('/api/middleware/GetWeiBoSentiment/:TimeType', middleware.GetWeiBoSentiment);
router.post('/api/middleware/GetNewsSentiment/:TimeType', middleware.GetNewsSentiment);
router.post('/api/middleware/GetWeiBoAndNewsSentiment/:TimeType', middleware.GetWeiBoAndNewsSentiment);

//舆情汇总报告，添加微博内容，是一个全新的api，名字有修改。
//修改添加时间：2014-09-25
router.post('/api/middleware/GetSentimentDay', middleware.GetSentimentDay);
router.post('/api/middleware/GetSentimentScoreDay', middleware.GetSentimentScoreDay);
router.post('/api/middleware/GetSentimentReport', middleware.GetSentimentReport);
router.post('/api/middleware/GetSentiment/:TimeType', middleware.GetSentiment);
router.post('/api/middleware/GetSentimentDailyReport', middleware.GetSentimentDailyReport);
router.post('/api/middleware/GetSentimentReportByCategory', middleware.GetSentimentReportByCategory);
router.post('/api/middleware/GetSentimentReportBySide', middleware.GetSentimentReportBySide);
router.post('/api/middleware/GetSentimentReportBySource', middleware.GetSentimentReportBySource);
router.post('/api/middleware/GetSentimentReportBySensitive', middleware.GetSentimentReportBySensitive);
//舆情汇总报告
router.post('/api/middleware/GetWeiBoAndNewsSentimentReport', middleware.GetWeiBoAndNewsSentimentReport);
router.post('/api/middleware/GetEmergencyPlanByCondition', emergencyPlan.GetEmergencyPlanByCondition);
router.get('/api/middleware/GetEmergencyPlanById', emergencyPlan.GetEmergencyPlanById);
router.post('/api/middleware/AddEmergencyPlan', emergencyPlan.AddEmergencyPlan);
router.get('/api/middleware/DeleteEmergencyPlanByID', emergencyPlan.DeleteEmergencyPlanByID);
router.post('/api/middleware/UpdateEmergencyPlan', emergencyPlan.UpdateEmergencyPlan);

// manage : group user permission
//Group model
router.post('/api/manage/GetGroupList', manage.GetGroupList);
router.post('/api/manage/GetGroupByCondition', manage.GetGroupByCondition);
router.post('/api/manage/GetGroupById', manage.GetGroupById);
router.post('/api/manage/SaveGroup', manage.AddGroup);
router.delete('/api/manage/SaveGroup', manage.DeleteGroupById);
router.put('/api/manage/SaveGroup', manage.UpdateGroup);

//Model
router.post('/api/manage/GetModelList', manage.GetModelList);
router.post('/api/manage/GetModelByName', manage.GetModelByName);
router.post('/api/manage/GetModelByCondition', manage.GetModelByCondition);
router.post('/api/manage/GetModelById', manage.GetModelById);
router.post('/api/manage/SaveModel', manage.AddModel);
router.delete('/api/manage/SaveModel', manage.DeleteModelById);
router.put('/api/manage/SaveModel', manage.UpdateModel);
router.get('/api/manage/GetGroupForTenant', manage.GetGroupForTenant);

//User
router.post('/api/manage/GetUserList', manage.GetUserList);
router.post('/api/manage/GetUserById', manage.GetUserById);
router.post('/api/manage/GetUserByCondition', manage.GetUserByCondition);
router.post('/api/manage/SaveUser', manage.AddUser);
router.delete('/api/manage/SaveUser', manage.DeleteUserById);
router.put('/api/manage/SaveUser', manage.UpdateUser);
router.post('/api/manage/UpdateUserInformation', manage.UpdateUserInformation);

//Permission
router.post('/api/manage/GetPermissionByGroupId', manage.GetPermissionByGroupId);
router.post('/api/manage/GetPermissionByUserId', manage.GetPermissionByUserId);
router.post('/api/manage/GetPermission', manage.GetPermission);
router.post('/api/manage/UpdatePermissionForGroup', manage.UpdatePermissionForGroup);
router.post('/api/manage/UpdatePermissionForUser', manage.UpdatePermissionForUser);
router.get('/api/manage/GetModulePermissionByToken', manage.GetModulePermissionByToken);

//api
router.post('/api/manage/GetApiById', manage.GetApiById);
router.post('/api/manage/GetApiByCondition', manage.GetApiByCondition);
router.post('/api/manage/SaveApi', manage.AddApi);
router.delete('/api/manage/SaveApi', manage.DeleteApiById);
router.put('/api/manage/SaveApi', manage.UpdateApi);

//password
router.post('/api/manage/UpdatePassword', manage.UpdatePassword);
router.post('/api/manage/ResetPassword', manage.ResetPassword);

//DataSource
router.post('/api/manage/GetDataSourceURLs', dataSourceMgt.GetDataSourceURLs);
router.post('/api/manage/AddDataSourceURL', dataSourceMgt.AddDataSourceURL);
router.post('/api/manage/UpdateDataSourceURL', dataSourceMgt.UpdateDataSourceURL);
router.post('/api/manage/DeleteDataSourceURLByID', dataSourceMgt.DeleteDataSourceURLByID);
//SubDataSource
router.post('/api/manage/GetSubDataSourceURLs', subDataSourceMgt.GetSubDataSourceURLs);
router.post('/api/manage/AddSubDataSourceURL', subDataSourceMgt.AddSubDataSourceURL);
router.post('/api/manage/UpdateSubDataSourceURL', subDataSourceMgt.UpdateSubDataSourceURL);
router.post('/api/manage/DeleteSubDataSourceURLByID', subDataSourceMgt.DeleteSubDataSourceURLByID);

//分类标签管理
router.post('/api/manage/GetCategoryTagList', categoryTag.GetCategoryTagList);
router.post('/api/manage/AddCategoryTag', categoryTag.AddCategoryTag);
router.post('/api/manage/SaveCategoryTag', categoryTag.SaveCategoryTag);
router.post('/api/manage/DeleteCategoryTag', categoryTag.DeleteCategoryTag);
//话题管理
router.post('/api/manage/GetTopicTagList', topicTag.GetTopicTagList);
router.post('/api/manage/AddTopicTag', topicTag.AddTopicTag);
router.post('/api/manage/UpdateTopicTag', topicTag.UpdateTopicTag);
router.post('/api/manage/DeleteTopicTag', topicTag.DeleteTopicTag);
//搜索关键字管理
router.post('/api/manage/GetSearchKeywordsList', searchKeywords.GetSearchKeywordsList);
router.post('/api/manage/AddSearchKeywords', searchKeywords.AddSearchKeywords);
router.post('/api/manage/UpdateSearchKeywords', searchKeywords.UpdateSearchKeywords);
router.post('/api/manage/DeleteSearchKeywords', searchKeywords.DeleteSearchKeywords);

//segment
router.post("/maintain/newsSegment",segment.newsSegment);
router.post("/maintain/gradeSplit",segment.gradeSplit);
//router.get("/maintain/loadGradeWords",segment.loadGradeWords);
//router.post("/maintain/updateGradeWords",segment.updateGradeWords);

router.get("/maintain/loadGradeWords",polarity.GetPolarityList);
router.post("/maintain/deletePolarityEntity",polarity.DeleteBusinessPolarityEntity);
router.post("/maintain/updateGradeWords",polarity.EditPolarityEntity);
router.post("/maintain/AddPolarityEntity",polarity.AddPolarityEntity);
router.post("/maintain/GetPolarityListByKey",polarity.GetPolarityListByKey);
router.post("/maintain/getHighFrequencyWords",wordStatistics.getHighFrequencyWords);

router.get("/maintain/GetTopNews/:days",polarity.GetTopNews);
router.post("/maintain/showAllWordCal/:fromdb",polarity.showAllWordCal);

router.get("/api/middleware/initializer/Deploy/:env",quickDeploy.webDeploy);
router.get("/api/middleware/initializer/cleanData/:env",quickDeploy.cleanRedisData);
router.post('/api/middleware/GetLastAppFile', middleware.GetLastAppFile);

//reportTools
router.post("/maintain/report/getReportList",reportTools.getReportList);
router.post("/maintain/report/executeAction",reportTools.executeAction);
router.get("/maintain/report/getReportLog",reportTools.getReportLog);
//生成动态路径
tenant.GetTenantListForRouter(function(result){
    if(result){
        for(var i=0;i<result.length;i++){
            var row=result[i];
            router.all('/'+row.alias+'*',authentication.simulatedLogin);
        }
    }
});
router.get("/api/authentication/getLoginInfo",authentication.GetSessionInfo);
module.exports = router;