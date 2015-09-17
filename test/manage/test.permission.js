/**
 * Created by QingWang on 2014/7/31.
 */

var supertest = require('supertest'),
    api = supertest('http://localhost:1337');



describe('#Permission#GetPermissionByUserId', function () {

    it('api#/api/manage/GetPermissionByUserId#GetPermissionByUserId', function (done) {
        api.post('/api/manage/GetPermissionByUserId')
            .send({id:"B336DA23-9771-5E5F-9FED-BDB217A14E42"})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    console.log(res.text);
                    done();
                }
            });
    });
});

describe('#Permission#GetPermissionByGroupId', function () {

    it('api#/api/manage/GetPermissionByGroupId#GetPermissionByGroupId', function (done) {
        api.post('/api/manage/GetPermissionByGroupId')
            .send({id:"B336DA23-9771-5E5F-9FED-BDB217A14E42"})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    console.log(res.text);
                    done();
                }
            });
    });
});


describe('#Permission#GetPermission', function () {

    it('api#/api/manage/GetPermission#GetPermission', function (done) {
        api.post('/api/manage/GetPermission')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    console.log(res.text);
                    done();
                }
            });
    });
});

