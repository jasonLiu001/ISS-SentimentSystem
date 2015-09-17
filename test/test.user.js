/**
 * Created by Wanji on 2014/7/23.
 */
var assert = require('assert');
var request = require('supertest');
request = request("http://127.0.0.1:1337");
var userModel = require('../APIModule/authentication');
//describe('User', function(){
//    describe('Login', function(){
//        it('should return 1 when the user login successfully', function(done){
//            var user=new userModel({username:'5100admin',userpwd:'5100admin'});
//            user.Login(function(loginStatus){
//                assert.equal(loginStatus.loginStatus,1,'用户名密码验证失败！');
//                done();
//            });
//        });
//        it('should return -1 when the user is not existing', function(done){
//            var user=new userModel({username:'5100admin1',userpwd:'5100admin'});
//            user.Login(function(loginStatus){
//                assert.equal(loginStatus.loginStatus,-1,'用户名检查失败!');
//                done();
//            });
//        });
//        it('should return 0 when the user has error password', function(done){
//            var user=new userModel({username:'5100admin',userpwd:'errorpwd'});
//            user.Login(function(loginStatus){
//                assert.equal(loginStatus.loginStatus,0,'密码验证失败！');
//                done();
//            });
//        })
//    })
//});
//登录成功提前，关闭token验证
describe('Login', function () {
    describe('POST /api/authentication/login', function () {
        it('should send data successfully', function (done) {
            request.post('/api/authentication/login')
                .send({'userName': '5100admin', 'userPwd': '5100admin',
                    'isRem': 'false', 'verificationCode': null})
                .end(function (err, res) {
                    var result = JSON.parse(res.text);
                    assert.equal(!result, false);
                    done();
                });
        });
    });
});
describe('Login', function () {
    describe('/api/authentication/verification', function () {
        it('should get buffer', function () {
            request.get('/api/authentication/login')
                .end(function (err, res) {
                    assert.equal(res.state, 304);
                });
        });
    });
});
describe('Logout', function () {
    describe('/api/authentication/logout', function () {
        it('should redirect to home page', function () {
            request.get('/api/authentication/logout')
                .end(function (err, res) {
                    assert.equal(res.state, 304);
                });
        });
    });
});
//describe('Login', function () {
//    describe('POST /api/authentication/login', function () {
//        it('should return -1 when the user is not existing', function (done) {
//            request.post('/api/authentication/login')
//                .send({'userName': 'erroruser', 'userPwd': '5100admin', 'isRem': 'false'})
//                .end(function (err, res) {
//                    var result = JSON.parse(res.text);
//                    assert.equal(result.loginStatus, -1);
//                    done();
//                });
//        });
//    });
//});
//
//describe('Login', function () {
//    describe('POST /api/authentication/login', function () {
//        it('should return 0 when the user has error password', function (done) {
//            request.post('/api/authentication/login')
//                .send({'userName': '5100admin', 'userPwd': 'errorpwd', 'isRem': 'false'})
//                .end(function (err, res) {
//                    var result = JSON.parse(res.text);
//                    assert.equal(result.loginStatus, 0);
//                    done();
//                });
//        })
//    });
//});