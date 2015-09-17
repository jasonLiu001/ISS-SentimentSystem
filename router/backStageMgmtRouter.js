/**
 * Created by Administrator on 2014/10/14.
 */
var express = require('express');
var router = express.Router();
var backStageMgmt=require('../APIModule/backstageManagement.js');
var dataSourceMgmt=backStageMgmt.DataSourceURLManage;
var subDataSourceMgmt =backStageMgmt.SubDataSourceURLManage;

//DataSource
router.post('/api/manage/GetDataSourceURLs', dataSourceMgmt.GetDataSourceURLs);
router.post('/api/manage/AddDataSourceURL', dataSourceMgmt.AddDataSourceURL);
router.post('/api/manage/UpdateDataSourceURL', dataSourceMgmt.UpdateDataSourceURL);
router.post('/api/manage/DeleteDataSourceURLByID', dataSourceMgmt.DeleteDataSourceURLByID);
//SubDataSource
router.post('/api/manage/GetSubDataSourceURLs', subDataSourceMgmt.GetSubDataSourceURLs);
router.post('/api/manage/AddSubDataSourceURL', subDataSourceMgmt.AddSubDataSourceURL);
router.post('/api/manage/UpdateSubDataSourceURL', subDataSourceMgmt.UpdateSubDataSourceURL);
router.post('/api/manage/DeleteSubDataSourceURLByID', subDataSourceMgmt.DeleteSubDataSourceURLByID);

module.exports=router;