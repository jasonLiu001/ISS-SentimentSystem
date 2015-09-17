/**
 * Created by QingWang on 2014/7/24.
 */

//--------------------------------------------
var supertest = require('supertest'),
    api = supertest('http://localhost:1337');
var modelid ="";


describe('#Model#AddModel', function () {

    it('api#/api/manage/SaveModel#AddModel', function (done) {
        api.post('/api/manage/SaveModel')
            .send({ parentid : "0",uri:"/",name : "舆情分析报告",value:"100",notes:"舆情分析报告" })
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

describe('#Model#GetModelByName', function () {

    it('api#/api/manage/GetModelByName#GetModelByName', function (done) {
        api.post('/api/manage/GetModelByName')
            .send({name:"舆情分析报告"})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    var tx =res.text;
                    var json = JSON.parse(tx);
                    modelid = json.Data[0].id;
                    done();
                }
            });
    });
});

describe('#Model#GetModelById', function () {

    it('api#/api/manage/GetModelByName#GetModelById', function (done) {
        api.post('/api/manage/GetModelById')
            .send({id:modelid})
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

describe('#Model#UpdateModel', function () {

    it('api#/api/manage/SaveModel#UpdateModel', function (done) {
        api.put('/api/manage/SaveModel')
            .send({id:modelid, parentid : "0",uri:"/",name : "舆情分析报告1",value:"100",notes:"舆情分析报告1" })
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


describe('#Model#DeleteModelById', function () {

    it('api#/api/manage/SaveModel#DeleteModelById', function (done) {
        api.delete('/api/manage/SaveModel')
            .send({id:modelid})
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
