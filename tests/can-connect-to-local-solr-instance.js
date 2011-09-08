var vows = require('vows'),
    assert = require('assert'),
    ms = require('../src/mstar_solr');



var suite = vows.describe('client authorization').addBatch({
	'solr client connects on start': {
		topic: function(){
			return true;
		},
		'two companies are loaded': function(topic){
			assert.equal(topic, true);
		}
	}
,
	'some other behaviour': {
		topic: function(){
			return false;
		},
		'the request is denied': function(topic){
			assert.equal(topic, false);
		}
	}
});

suite.run();
