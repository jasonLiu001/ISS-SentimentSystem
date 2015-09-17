var express = require('express');
var router = express.Router();
var authentication = require("../APIModule/authentication.js");

router.get('/api/authentication/verification', authentication.GenerateVerificationCode);
router.post('/api/authentication/login', authentication.PostLogin);
router.post('/api/authentication/apiLogin',authentication.ApiLogin);
router.get('/api/authentication/getToken', authentication.GetClientInfo);
router.get('/api/authentication/logout', authentication.Logout);
router.post('/api/authentication/refreshToken', authentication.RefreshToken);

module.exports=router;