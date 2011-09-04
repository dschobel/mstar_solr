var mstar = require('./mstar_solr.js');


var server = mstar.createServer();
server.load_authlist('./data/auth_list.txt');
server.isAuthorized('foo');

