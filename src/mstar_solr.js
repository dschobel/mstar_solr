var http = require("http"),
    fs   = require('fs'),
    solr = require('solr'),
    express = require('express');

var authorized_clients = []


function load_authlist(filename){
	//console.log('loading application auth list');
	authorized_clients = JSON.parse(fs.readFileSync(filename));
	//console.log('loaded ' + authorized_clients.length + ' authorized clients');
}

function isClientAuthorized(client){
	return authorized_clients.indexOf(client) > -1;
}

function load_whitelist(filename){
	console.log('loading whitelist');
}

function load_blacklist(filename){
	console.log('loading blacklist');
}

function inspect(obj){
	var str = "";
	for(var k in obj){
	    if (obj.hasOwnProperty(k)){
		console.log(k + " = " + obj[k] + "\n");
		}
	}

}

function handleRequest(req, resp){
	console.log("Request received.");
	resp.writeHead(200, {"Content-Type": "text/plain"});
	resp.write("hello from mstar_solr \n");
	resp.write('client: ' + req.params.client + "\n");
	resp.write('query: ' + req.params.query+ "\n");
	resp.end();
}

function start(port) {
	if(port === undefined)
	{
	  port = 8888;
	}

	var app = express.createServer();
	app.get('/lookup/:client/:query', handleRequest);
	app.listen(port, "10.61.200.101");
	console.log("mstar_solr is listening on port " + +port);
}

exports.start = start;
exports.load_authlist = load_authlist;
exports.auth_list = function(){ return authorized_clients;};
exports.isClientAuthorized = isClientAuthorized;
