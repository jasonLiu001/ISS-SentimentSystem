var express = require('express');
var router = express.Router();

var manage = require('../APIModule/manage.js');
var tenant = require("../APIModule/tenant.js");

//tenant mgmt
router.post("/api/manage/tenant/AddTenant", tenant.AddTenant);
router.get('/api/manage/tenant/GetTenantList', tenant.GetTenantList);
router.post('/api/manage/tenant/AddTenantUser', tenant.AddTenantUser);
router.get('/api/manage/tenant/DeleteUserByUserID', tenant.DeleteUserByUserID);
router.get('/api/manage/tenant/GetGroupByTenant', tenant.GetGroupByTenant);
router.get('/api/manage/tenant/GetUserListByTenant', tenant.GetUserListByTenant);
router.get('/api/manage/tenant/GetGroupByTUser', tenant.GetGroupByTUser);
router.get('/api/manage/tenant/GetVerificationCode', tenant.GetVerificationCode);
router.post('/api/manage/tenant/UpdateTenant', tenant.UpdateTenant);
router.get('/api/manage/tenant/GetTenantDetailsById', tenant.GetTenantDetailsById);
router.get('/api/manage/tenant/GetDomainByTenantId', tenant.GetDomainByTenantId);
router.get('/api/manage/tenant/GetDomainByTenantUserId', tenant.GetDomainByTenantUserId);
router.get('/api/manage/tenant/GetTenantByUserId', tenant.GetTenantByUserId);
router.post('/api/manage/tenant/DeleteTenant', tenant.DeleteTenant);

// manage : group user permission
//Group model
router.post('/api/manage/group/GetGroupList', manage.GetGroupList);
router.post('/api/manage/group/GetGroupByCondition', manage.GetGroupByCondition);
router.post('/api/manage/group/GetGroupById', manage.GetGroupById);
router.post('/api/manage/group/SaveGroup', manage.AddGroup);
router.delete('/api/manage/group/DeleteGroup', manage.DeleteGroupById);
router.put('/api/manage/group/UpdateGroup', manage.UpdateGroup);

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
router.post('/api/manage/user/GetUserList', manage.GetUserList);
router.post('/api/manage/user/GetUserById', manage.GetUserById);
router.post('/api/manage/user/GetUserByCondition', manage.GetUserByCondition);
router.post('/api/manage/user/SaveUser', manage.AddUser);
router.delete('/api/manage/user/DeleteUser', manage.DeleteUserById);
router.put('/api/manage/user/UpdateUser', manage.UpdateUser);
router.post('/api/manage/user/UpdateUserInformation', manage.UpdateUserInformation);

//Permission
router.post('/api/manage/permission/GetPermissionByGroupId', manage.GetPermissionByGroupId);
router.post('/api/manage/permission/GetPermissionByUserId', manage.GetPermissionByUserId);
router.post('/api/manage/permission/GetPermission', manage.GetPermission);
router.post('/api/manage/permission/UpdatePermissionForGroup', manage.UpdatePermissionForGroup);
router.post('/api/manage/permission/UpdatePermissionForUser', manage.UpdatePermissionForUser);
router.get('/api/manage/permission/GetModulePermissionByToken', manage.GetModulePermissionByToken);

//api
router.post('/api/manage/GetApiById', manage.GetApiById);
router.post('/api/manage/GetApiByCondition', manage.GetApiByCondition);
router.post('/api/manage/SaveApi', manage.AddApi);
router.delete('/api/manage/SaveApi', manage.DeleteApiById);
router.put('/api/manage/SaveApi', manage.UpdateApi);

//password
router.post('/api/manage/UpdatePassword', manage.UpdatePassword);
router.post('/api/manage/ResetPassword', manage.ResetPassword);

module.exports = router;