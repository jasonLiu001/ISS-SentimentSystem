var express = require('express');
var middleware = require("../APIModule/middleware.js");
var emergencyPlan = require("../model/EmergencyPlan.js");
//var androidFilePatch=require("../APIModule/androidFilePatch.js");

var router = express.Router();

router.post('/api/middleware/GetBrands', middleware.GetBrands);
router.post('/api/middleware/GetNewsList', middleware.GetNewsList);
router.post('/api/middleware/GetNewsListByBrand', middleware.GetNewsListByBrand);
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

//舆情汇总报告
router.post('/api/middleware/GetWeiBoAndNewsSentimentReport', middleware.GetWeiBoAndNewsSentimentReport);

router.post('/api/middleware/EmergencyPlan/GetEmergencyPlanByCondition', emergencyPlan.GetEmergencyPlanByCondition);
router.get('/api/middleware/EmergencyPlan/GetEmergencyPlanById', emergencyPlan.GetEmergencyPlanById);
router.post('/api/middleware/EmergencyPlan/AddEmergencyPlan', emergencyPlan.AddEmergencyPlan);
router.get('/api/middleware/EmergencyPlan/DeleteEmergencyPlanByID', emergencyPlan.DeleteEmergencyPlanByID);
router.post('/api/middleware/EmergencyPlan/UpdateEmergencyPlan', emergencyPlan.UpdateEmergencyPlan);

router.post('/api/middleware/GetLastAppFile', middleware.GetLastAppFile);
router.post('/api/middleware/GetVersion', middleware.GetVersion);

router.get('/api/middleware/GetCityInfoSummary', middleware.GetCityInfoSummary);

module.exports = router;