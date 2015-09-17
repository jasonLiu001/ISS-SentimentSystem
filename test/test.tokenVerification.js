var assert = require('assert');
var request = require('supertest');
request = request("http://127.0.0.1:1337");
var TokenVerification = require('../APIModule/tokenVerification.js');
describe('Token', function(){
    describe('GetUserInformationByToken', function(){
        it('should return userinfomation', function(done){
            TokenVerification.GetUserInformationByToken('a5f9ca086ede0958fffc959e8cec0afa4f742c04',
                function(result){
                    assert.equal(!result,false);
                    done();
            });
        });
    })
});
