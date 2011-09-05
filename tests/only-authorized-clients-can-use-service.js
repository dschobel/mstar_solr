var vows = require('vows'),
	assert = require('assert'),
	ms = require('../src/mstar_solr');



vows.describe('client authorization').addBatch({
	'when an unauthorized client connects': {
		topic: function(){
			ms.load_authlist('./data/auth_list.json');
			return ms.isClientAuthorized('foo');
		},
		'the request is denied': function(topic){
			assert.equal(topic, false);
		}
	}
,
	'but when an authorized client connects':{
		topic: function(){
			ms.load_authlist('./data/auth_list.json');
			return ms.isClientAuthorized('westpac');
		},
		'the request is accepted': function(topic){
			assert.equal(topic, true);
		}
	}
}).run();
			 
