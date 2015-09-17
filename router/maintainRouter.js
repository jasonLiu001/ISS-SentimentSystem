/**
 * Created by Administrator on 2014/10/13.
 */
var express = require('express');
var router = express.Router();

var segment=require('../APIModule/segmentModule.js');
var polarity=segment.Polarity,
    wordStatistics=segment.wordStatistics;

var customSettings = require('../APIModule/customSettings.js');
var categoryTag = customSettings.CategoryTag,
    topicTag = customSettings.TopicTag,
    searchKeywords = customSettings.SearchKeywords;

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

//分类标签管理
router.post('/api/maintain/GetCategoryTagList', categoryTag.GetCategoryTagList);
router.post('/api/maintain/AddCategoryTag', categoryTag.AddCategoryTag);
router.post('/api/maintain/SaveCategoryTag', categoryTag.SaveCategoryTag);
router.post('/api/maintain/DeleteCategoryTag', categoryTag.DeleteCategoryTag);
//话题管理
router.post('/api/maintain/GetTopicTagList', topicTag.GetTopicTagList);
router.post('/api/maintain/AddTopicTag', topicTag.AddTopicTag);
router.post('/api/maintain/UpdateTopicTag', topicTag.UpdateTopicTag);
router.post('/api/maintain/DeleteTopicTag', topicTag.DeleteTopicTag);
//搜索关键字管理
router.post('/api/maintain/GetSearchKeywordsList', searchKeywords.GetSearchKeywordsList);
router.post('/api/maintain/AddSearchKeywords', searchKeywords.AddSearchKeywords);
router.post('/api/maintain/UpdateSearchKeywords', searchKeywords.UpdateSearchKeywords);
router.post('/api/maintain/DeleteSearchKeywords', searchKeywords.DeleteSearchKeywords);

module.exports = router;
