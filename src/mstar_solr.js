var http = require("http"),
    fs   = require('fs'),
    solr = require('solr'),
    search = require('searchjs'),
    express = require('express');

var authorized_clients = {};
var solr_client = {};


function isEmpty(obj){
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function load_authlist(filename){
    authorized_clients = JSON.parse(fs.readFileSync(filename)).clients;
}

function auth_list_size(){ return authorized_clients.length;}

function getAuthorizedClient(name){
    for(var i=0; i<authorized_clients.length; i++) {
        if(name === authorized_clients[i].name)
            return authorized_clients[i];
    }
    return null;
}


function handleRequest(req, resp){
    var _client = getAuthorizedClient(req.params.client);
    if(_client !== null)
    {
        resp.writeHead(200, {"Content-Type": "text/plain"});
        resp.write('client: ' + req.params.client + "\n");
        resp.write('query: ' + req.params.query+ "\n");
        var httpResponse = resp;
        solr_client.query(req.params.query, function(err,resp){
                if(err)
                {
                console.log('error querying solr: ' + err);
                httpResponse.end('error');
                return;
                }
                var respObj = JSON.parse(resp);
                httpResponse.write('\n\nwhitelist is :');
                httpResponse.write(JSON.stringify(_client.white_list));
                httpResponse.write('\n\nblacklist is :');
                httpResponse.write(JSON.stringify(_client.black_list));
                httpResponse.write('\n\nnumber of matching documents: ' + respObj.response.numFound + '\n');
                httpResponse.write('original results\n');
                var docs = respObj.response.docs;
                httpResponse.write(JSON.stringify(docs));


                var docs = search.matchArray(docs,_client.white_list);
                httpResponse.write('\n\n'+docs.length+' document(s) after applying whitelist:\n');
                httpResponse.write(JSON.stringify(docs));

                docs = search.matchArray(docs,_client.black_list);
                httpResponse.write('\n\n'+docs.length+' document(s) after applying blacklist:\n');
                httpResponse.end(JSON.stringify(docs));

        });
    }
    else
    {
        resp.writeHead(401);
        resp.end('nein!');
    }
}


function start(port) {
    if(port === undefined)
    {
        port = 8888;
    }

    solr_client = solr.createClient('ausearchwebdev1','8080','/StockFundUniverse','/ausearch');


    load_authlist('./tests/data/auth_list.json');
    console.log('auth list has ' + authorized_clients.length + ' members');

    var app = express.createServer();
    app.get('/lookup/:client/:query', handleRequest);
    app.listen(port, "10.61.200.101");
    console.log("mstar_solr is listening on port " + +port);
}

exports.start = start;
exports.isEmpty = isEmpty;
exports.load_authlist = load_authlist;
exports.auth_list_size = auth_list_size;
exports.getAuthorizedClient = getAuthorizedClient;
