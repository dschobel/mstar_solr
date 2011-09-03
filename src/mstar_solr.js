var http = require("http");

function createServer(){
	console.log('server created');
}

function isAuthorized(clientId){
	console.log('isAuthorized(' + clientId + ')';
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
