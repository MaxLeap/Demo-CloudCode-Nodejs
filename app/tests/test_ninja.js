'use strict';
var ML = require('mlcloudcode');
var expect = require('expect.js'),
    should = require('should'),
    fs = require('fs'),
    request = require('supertest'),
    assert = require('assert');

require('../function/ninja.js');

var appId = '56273907169e7d0001bd5c92';
var appkey = 'TXV4MFB2SFFQdVpPSjJKYnFtSVdlUQ';
ML.initialize(appId, appkey);
ML.useCNServer();

describe('function', function(){
    it('helloNinja',function(done){
      ML.Cloud.callFuction('helloNinja',{'name':'test'},function(res){
         assert(res.body, 'test_new');
      }, done);
  });
});
