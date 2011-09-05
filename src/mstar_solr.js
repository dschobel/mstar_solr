var http = require("http"),
    fs   = require('fs');

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

function start() {
	function onRequest(request, response) {
		console.log("Request received.");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello World");
		response.end();
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;
exports.load_authlist = load_authlist;
exports.auth_list = function(){ return authorized_clients;};
exports.isClientAuthorized = isClientAuthorized;
