var vows = require('vows'),
	assert = require('assert'),
	mstar = require('../src/mstar-solr.js');



vows.describe('client authorization').addBatch({
	'when an unauthorized client connects': {
		topic: function(){
			var server = mstar.createServer();
			server.load_authlist();
			server.isAuthorized('foo');
		},
		'the request is denied': function(topic){
			assert.equal(topic, false);
		}
	},
	'but when an authorized client connects':{
		topic: function(){
			var server = mstar.createServer();
			server.load_authlist();
			server.isAuthorized('westpac');
		},
		'the request is accepted': function(topic){
			assert.equal(topic, true);
		}
	}
}).run();
			 
