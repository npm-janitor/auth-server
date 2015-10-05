var promisify = require('es6-promisify');
var npmJanitor = promisify(require('npm-janitor'));
var low = require('lowdb');
var db = low('db.json')('authTokens');
var url = require('url');
var id = '';
var githubOAuth = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT'],
  githubSecret: process.env['GITHUB_SECRET'],
  baseURL: 'https://npm-janitor.herokuapp.com',
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user,public_repo' // optional, default scope is set to user
});

require('http').createServer(function(req, res) {
   if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
        res.writeHead(200, headers);
        res.end();
  }

  if (req.url.match(/login/)) {
    id = url.parse(req.url, true).query.id;
    return githubOAuth.login(req, res);
  }

  if (req.url.match(/callback/)) {
    return githubOAuth.callback(req, res)
  }

  if (req.url.match(/api/)) {
    return npmJanitor(req.url.split('/')[2])
        .then(function(data) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(data));
        });
  }

  if (req.url.match(/token/)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(db.find(url.parse(req.url, true).query.id)));
  }

}).listen(process.env.PORT || 8080)


githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
});

githubOAuth.on('token', function(token, serverResponse) {
  var tokens = {};
  console.log('here is your shiny new github oauth token', token)
  tokens[id] = token;
  db.push(tokens)
  //serverResponse.end(JSON.stringify(token))
  serverResponse.end("DONE! CHECK YOUR CLI");
});

console.log(process.env.PORT);
