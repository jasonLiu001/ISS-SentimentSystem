/**
 * Created by wang on 2014/7/22.
 */

var request = require('supertest');
var assert = require('assert');
var Chance = require('chance'),
    chance = new Chance();
var async = require('async');
var DbConfigInfo = require('../lib/DbConfigInfo');
var DbHelper = require('../lib/DbHelper');

var ConfigInfo = new DbConfigInfo();
var mysqlHelper = new DbHelper(ConfigInfo.BusinessDB);

request = request("http://127.0.0.1:1337");

describe('tenant api tests', function () {


    //global test variable
    var tenantId = -1;
    var userId = '';
    var tenantIdForAddTenantCase = -1;

    before(function (done) {
        console.log('Adding test data...');
        async.series([
            function (callback) {
                var sqlAddTenant = "insert into tenants_tenants(name,alias,mappeddomain,customer_names,version,language,trusteddomains,trusteddomainsenabled,creationdatetime) values('mochaTest','mochaTest','mochaTest','mochaTest',0,'cn-zh','com',0,now())";
                mysqlHelper.ExecuteQuery(sqlAddTenant, function (err, res) {
                    if(res){
                        //save the inserted tenantId
                        tenantId = res.insertId;
                        userId = chance.guid();
                    }
                    console.log(sqlAddTenant);
                    callback(err, res);
                });
            },
            function (callback) {
                var sqlAddTenantUser = "insert into core_user(id,tenant,username,firstname,lastname,sex,bithdate,status,activation_status,email,workfromdate,terminateddate,phone,removed,create_on,last_modified) " +
                    "values('" + userId + "'," + tenantId + ",'Admin','Admin','Admin',0,now(),0,0,'mochaTestUser@qq.com',now(),now(),'12345678',0,now(),now())";
                mysqlHelper.ExecuteQuery(sqlAddTenantUser, function (err, res) {
                    console.log(sqlAddTenantUser);
                    callback(err, res);
                });
            }
        ], function (err, res) {
            if (err) {
                throw err;
            }
            console.log('Added test data end.');
            done();
        });
    });

    after(function (done) {
        console.log('deleting the test data..');
        async.series([
            function (callback) {
                var sqlDeleteTenant = "delete from tenants_tenants where id in(" + tenantId + "," + tenantIdForAddTenantCase + ")";
                mysqlHelper.ExecuteQuery(sqlDeleteTenant, function (err, res) {
                    console.log(sqlDeleteTenant);
                    callback(err, res);
                });
            },
            function (callback) {
                var sqlDeleteTenantUser = "delete from core_user where tenant in(" + tenantId + "," + tenantIdForAddTenantCase + ")";
                mysqlHelper.ExecuteQuery(sqlDeleteTenantUser, function (err, res) {
                    console.log(sqlDeleteTenantUser);
                    callback(err, res);
                });
            },
            function (callback) {
                var sqlDeleteTenantUserPwd = "delete from core_usersecurity where tenant in(" + tenantId + "," + tenantIdForAddTenantCase + ")";
                mysqlHelper.ExecuteQuery(sqlDeleteTenantUserPwd, function (err, res) {
                    console.log(sqlDeleteTenantUserPwd);
                    callback(err, res);
                });
            }
        ], function (err, res) {
            if (err) {
                throw err;
            }
            console.log('test data deleted success!');
            done();
        });
    });

    /*
     * api method AddTenant unit test.
     */
    describe('POST /api/tenant/AddTenant', function () {
        describe('when send post request', function () {
            it('should responds with success', function (done) {
                request.post('/api/tenant/AddTenant')
                    .send({ tenantName: chance.word({ length: 5 }), admin: 'Admin', adminPwd: 'Admin', alias: chance.word({ length: 5 }), mappedDomain: chance.word({ length: 5 }), customerNames: chance.word({ length: 5 }), email: 'test@qq.com', phone: '444444' })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        //save the tenant id, which needs to delete after the test.
                        tenantIdForAddTenantCase = result.data.tenantId;
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    /*
     * api method GetTenantDetailsById unit test.
     */
    describe('Get /api/tenant/GetTenantDetailsById', function () {
        describe('when send this get request', function () {
            it('should responds with json data', function (done) {
                request.get('/api/tenant/GetTenantDetailsById')
                    .query({ tenantId: tenantId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.name, 'mochaTest');
                        assert.equal(result.alias, 'mochaTest');
                        assert.equal(result.mappeddomain, 'mochaTest');
                        done();
                    });
            });
        });
    });

    /*
     * api method UpdateTenant unit test.
     */
    describe('POST /api/tenant/UpdateTenant', function () {
        describe('when send this post request', function () {
            it('should responds with success', function (done) {
                request.post('/api/tenant/UpdateTenant')
                    .send({ tenantName: 'mochaTest', alias: 'mochaTest', mappedDomain: 'mochaTest', phone: '555555', email: 'mochaTest@qq.com', tenantId: tenantId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    //API method GetTenantList unit test
    describe('GetTenantList', function () {
        describe('POST /api/tenant/GetTenantList', function () {
            it('should success', function (done) {
                request.post('/api/tenant/GetTenantList')
                    .send({params:"{\"query\":{},\"orderby\":{},\"pagination\":{}}"})
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    //API method GetUserListByTenant unit test
    describe('GetUserListByTenant', function () {
        describe('GET /api/tenant/GetUserListByTenant', function () {
            it('should success', function (done) {
                request.get('/api/tenant/GetUserListByTenant')
                    .query({ id: tenantId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    //API method AddTenantUser unit test
    describe('AddTenantUser', function () {
        describe('POST /api/tenant/AddTenantUser', function () {
            it('should success', function (done) {
                request.post('/api/tenant/AddTenantUser')
                    .send({ id: tenantId, username: 'abc', firstname: 'test', lastname: 'test', email: 'abc@qq.com' })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    //API method GetGroupByTenant unit test
    describe('GetGroupByTenant', function () {
        describe('GET /api/tenant/GetGroupByTenant', function () {
            it('should success', function (done) {
                request.get('/api/tenant/GetGroupByTenant')
                    .query({ id: tenantId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    //API method GetGroupByTUser unit test
    describe('GetGroupByTUser', function () {
        describe('GET /api/tenant/GetGroupByTUser', function () {
            it('should success', function (done) {
                request.get('/api/tenant/GetGroupByTUser')
                    .query({ userid: userId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.success, true);
                        done();
                    });
            });
        });
    });

    /*api method GetDomainByTenantId unit test*/
    describe('GET /api/tenant/GetDomainByTenantId', function () {
        describe('when send get request', function () {
            it('should responds with json string', function (done) {
                request.get('/api/tenant/GetDomainByTenantId')
                    .query({ tenantId: tenantId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.data.mappeddomain, 'mochaTest');
                        done();
                    });
            });
        });
    });

    /*api method GetDomainByTenantUserId unit test*/
    describe('GET /api/tenant/GetDomainByTenantUserId', function () {
        describe('when send get request', function () {
            it('should responds with json string', function (done) {
                request.get('/api/tenant/GetDomainByTenantUserId')
                    .query({ userId: userId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.data.mappeddomain, 'mochaTest');
                        done();
                    });
            });
        });
    });

    /*api method GetDomainByTenantUserId unit test*/
    describe('GET /api/tenant/GetTenantByUserId', function () {
        describe('when send get request', function () {
            it('should responds with json string', function (done) {
                request.get('/api/tenant/GetTenantByUserId')
                    .query({ userId: userId })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        var result = JSON.parse(res.text);
                        assert.equal(result.data.name, 'mochaTest');
                        assert.equal(result.data.alias, 'mochaTest');
                        assert.equal(result.data.mappeddomain, 'mochaTest');
                        done();
                    });
            });
        });
    });

});

