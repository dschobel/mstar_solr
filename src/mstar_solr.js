var http = require("http"),
    fs   = require('fs'),
    solr = require('solr'),
    express = require('express');

var authorized_clients = {}


function load_authlist(filename){
    authorized_clients = JSON.parse(fs.readFileSync(filename)).clients;
}

function isClientAuthorized(client){
    for(var i=0; i<authorized_clients.length; i++) {
            if(client === authorized_clients[i].client)
                return true;
    }
    return false;
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
        if(isClientAuthorized(req.params.client))
        {
            resp.writeHead(200, {"Content-Type": "text/plain"});
            resp.write("hello from mstar_solr \n");
            resp.write('client: ' + req.params.client + "\n");
            resp.write('query: ' + req.params.query+ "\n");
            resp.write('client is authorized to use this tool, hooray!');
        }
        else
        {
            resp.writeHead(401);
            resp.write('nein!');
        }
        resp.end();
    }

    function start(port) {
        if(port === undefined)
        {
            port = 8888;
        }

        load_authlist('./tests/data/auth_list.json');
        console.log('auth list has ' + authorized_clients.length + ' members');

        var app = express.createServer();
        app.get('/lookup/:client/:query', handleRequest);
        app.listen(port, "10.61.200.101");
        console.log("mstar_solr is listening on port " + +port);
    }

exports.start = start;
exports.load_authlist = load_authlist;
exports.auth_list = function(){ return authorized_clients;};
exports.isClientAuthorized = isClientAuthorized;
