/**
 * Created by QingWang on 2014/7/31.
 */

var supertest = require('supertest'),
    api = supertest('http://localhost:1337');
var chance =require('chance');
var groupid=new chance().guid();
var userid ="";

var user = {};

user.tenant = 1000;
user.username = "TestUserName";
user.firstname = "TestUser";
user.lastname = "Name";
user.sex = 0;
user.bithdate = "1988-11-11";
user.status = 0;
user.activation_status = 0;
user.email = "aa@gmail.com";
user.workfromdate = "2013-11-11";
user.terminateddate = "2088-11-11";
user.title = "title";
user.department = "cc.cc.cc";
user.culture = "culture";
user.contacts = "contacts";
user.phone = "1001001001";
user.phone_activation = 0;
user.location = "location";
user.notes = "notes";

user.removed = 0;
user.groupid=groupid;



describe('#User#AddUser', function () {

    it('api#/api/manage/SaveUser#AddUser', function (done) {
        api.post('/api/manage/SaveUser')
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});




describe('#User#GetUserList', function () {

    it('api#/api/manage/GetUserList#GetUserList', function (done) {
        api.post('/api/manage/GetUserList')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});

describe('#User#GetUserByCondition', function () {

    it('api#/api/manage/GetUserByCondition#GetUserByCondition', function (done) {
        api.post('/api/manage/GetUserByCondition')
            .send({params:{query:{username:"TestUserName"}}})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    var tx =res.text;
                    var json = JSON.parse(tx);
                    userid = json.Data[0].id;
console.log(userid);
                    done();
                }
            });
    });
});

describe('#User#GetUserById', function () {

    it('api#/api/manage/GetUserById#GetUserById', function (done) {
        api.post('/api/manage/GetUserById')
            .send({id:userid})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});

describe('#User#UpdateUser', function () {

    it('api#/api/manage/SaveUser#UpdateUser', function (done) {

        user.id =userid;
        user.username ="TestUserName1";

        api.put('/api/manage/SaveUser')
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});


describe('#User#DeleteUserById', function () {

    it('api#/api/manage/SaveUser#DeleteUserById', function (done) {


        api.delete('/api/manage/SaveUser')
            .send({id:userid})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});
