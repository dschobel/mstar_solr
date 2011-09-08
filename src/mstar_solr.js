var http = require("http"),
    fs   = require('fs'),
    solr = require('solr'),
    search = require('searchjs'),
    express = require('express');

var authorized_clients = {};
var solr_client = {};
var _client ={};


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

function getAuthorizedClient(name){
    for(var i=0; i<authorized_clients.length; i++) {
        if(name === authorized_clients[i].name)
            return authorized_clients[i];
    }
    return null;
}

function inspect(obj){
    var str = "";
    for(var k in obj){
        if (obj.hasOwnProperty(k)){
            console.log(k + " = " + obj[k] + "\n");
        }
    }

}

var response;

    function handleRequest(req, resp){
        _client = getAuthorizedClient(req.params.client);
        if(_client !== null)
        {
            resp.writeHead(200, {"Content-Type": "text/plain"});
            resp.write('client: ' + req.params.client + "\n");
            resp.write('query: ' + req.params.query+ "\n");
            response = resp;
            solr_client.query(req.params.query, function(err,resp){
                    if(err)
                    {
                        console.log('error querying solr: ' + err);
                        response.end('error');
                        return;
                    }
                    var respObj = JSON.parse(resp);
                    response.write('\n\nwhitelist is :');
                    response.write(JSON.stringify(_client.white_list));
                    response.write('\n\nblacklist is :');
                    response.write(JSON.stringify(_client.black_list));
                    response.write('\n\nnumber of matching documents: ' + respObj.response.numFound + '\n');
                    response.write('original results\n');
                    var docs = respObj.response.docs;
                    response.write(JSON.stringify(docs));


                    var docs = search.matchArray(docs,_client.white_list);
                    response.write('\n\n'+docs.length+' document(s) after applying whitelist:\n');
                    response.write(JSON.stringify(docs));

                    docs = search.matchArray(docs,_client.black_list);
                    response.write('\n\n'+docs.length+' document(s) after applying blacklist:\n');
                    response.end(JSON.stringify(docs));
        
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
exports.inspect = inspect;
exports.load_authlist = load_authlist;
exports.auth_list = function(){ return authorized_clients;};
exports.getAuthorizedClient = getAuthorizedClient;
