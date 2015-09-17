/**
 * Created by QingWang on 2014/7/24.
 */

//--------------------------------------------
var supertest = require('supertest'),
    api = supertest('http://localhost:1337');
var groupid="";

describe('#Group', function () {

    it('api#AddGroup', function (done) {
        api.post('/api/manage/SaveGroup')
            .send({ tenant:"656565",name : "TestGroupName",removed :"0",permission :'0#;1#;3' })
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

describe('#Group', function () {

    it('api#GetGroupList', function (done) {
        api.post('/api/manage/GetGroupList')
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

describe('#Group', function () {

    it('api#GetGroupByCondition', function (done) {
        api.post('/api/manage/GetGroupByCondition')
            .send({params:{ query:{name:"TestGroupName"}}} )
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    done(err);
                } else {
                    var tx =res.text;
                    var json = JSON.parse(tx);
                    groupid = json.Data[0].id;

                    done();
                }
            });
    });
});

describe('#Group', function () {

    it('api#GetGroupByid', function (done) {
        api.post('/api/manage/GetGroupById')
            .send({id:groupid})
            .expect(200)
            .end(function (err, res) {
                console.log(groupid);
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
});

describe('#Group', function () {

    it('api#UpdateGroup', function (done) {
        api.put('/api/manage/SaveGroup')
            .send({ id : groupid,tenant:"656565",name : "TestGroupNameChanged",removed :"1" })
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


describe('#Group', function () {

    it('api#DeleteGroupById', function (done) {
        api.delete('/api/manage/SaveGroup')
            .send({ id : groupid })
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



