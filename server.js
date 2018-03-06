// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Shortened = require('./shortened');

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

app.get("/new/*", function(req, res) {
  
  const url = req.url.substring('/new/'.length, req.url.length);
  console.log(url);
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
      // must contain at least one .
      if (url.indexOf('.') > url.indexOf('://')) {
        // could overwrite
          const id = Math.round(Math.random() * (9999 - 1000) + 1000);
          Shortened.create({ id, url }, function(err, newShort) {
            if (err) {
              console.error(err);
              return;
            } else {
              console.log(newShort);
              const original_url = newShort.url;
              const short_url = "https://friendly-surfboard.glitch.me/" + newShort.id;
              res.json({
                original_url,
                short_url
              });
            }
          });
      } else {
        res.json({"error":"URL Invalid"});
      }
  } else {
    res.json({"error":"URL Invalid"});
  }

});

app.get("/:id", function(req, res) {
  const {id} = req.params;
  Shortened.findOne({id}).exec(function(err, url) {
    if (err || !url) {
      res.send("<h1>Error...</h1><p>Invalid short URL</p>");
      return;
    }
    res.redirect(url.url);
  });
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});