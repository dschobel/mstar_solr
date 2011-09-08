var vows = require('vows'),
	assert = require('assert'),
	ms = require('../src/mstar_solr');



var suite = vows.describe('client authorization').addBatch({
	'when an the authorization list is loaded': {
		topic: function(){
			ms.load_authlist('./data/auth_list.json');
			return ms.auth_list().length;
		},
		'two companies are loaded': function(topic){
			assert.equal(+topic, 2);
		}
	}
,
	'and when an unauthorized client connects': {
		topic: function(){
			ms.load_authlist('./data/auth_list.json');
			return ms.getAuthorizedClient('foo');
		},
		'the request is denied': function(topic){
			assert.equal(topic, null);
		}
	}
,
	'but when an authorized client connects':{
		topic: function(){
			ms.load_authlist('./data/auth_list.json');
			return ms.getAuthorizedClient('westpac');
		},
		'the request is accepted': function(topic){
			assert.equal(topic===null, false);
		}
	}
});

suite.run();
