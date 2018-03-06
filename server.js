// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongoose = require('mongoose');

// mongodb://<dbuser>:<dbpassword>@ds257838.mlab.com:57838/fcc-apis
const URL = process.env.MONGOLAB_URI;
mongoose.connect(URL);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/new/:url", function(req, res) {
  const url = req.params.url;
  
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(url)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }

});

app.get('/api/whoami', function(req, res) {
  const {headers} = req;
  
  const ipaddress = headers['x-forwarded-for'].substring(0, headers['x-forwarded-for'].indexOf(','));  
  const language = headers['accept-language'].substring(0, headers['accept-language'].indexOf(','));
  const software = headers['user-agent'].substring(headers['user-agent'].indexOf('(') + 1, headers['user-agent'].indexOf(')'));
  
  res.json({
    ipaddress,
    language,
    software,
  });
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});