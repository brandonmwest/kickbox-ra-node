var express = require('express');
var request = require('request-promise');
var bodyParser = require('body-parser');

//we'll use these later
var api_host = "https://api.kickbox.io/v2/";
var app_code = "xy2Nn_5hAGp2ZFuu88gB"; //REPLACE WITH YOUR APP CODE!

var app = express(); //create a new express app

app.use(bodyParser.urlencoded({extended: false})); //use body-parser for JSON

app.use(express.static('public')); //use the 'public' folder for css, js, images... 

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/authenticate", (req, response) => { 
  var email = req.body.email;
  var kickbox_app_code = req.body.kickbox_app_code;
  var fingerprint = req.body.fingerprint;
  
  //once defined, this method will return our API call options
  var kickbox_call = getKickboxCall(req.body.email, req.body.fingerprint, req.body.kickbox_app_code);
  
  // make the call and handle any errors
  // after the request is done, send the API response directly to the client (even if it errors)
  request(kickbox_call).then(function(result){
    response.send(result);
  }).catch(function(err){
    response.send(err.response);
  });
});

var getKickboxCall = function(email, fingerprint, kickbox_app_code)
{
  var kickboxCall = {
    uri: api_host + "authenticate" + "/" + kickbox_app_code,
    method: "POST",
    form: {
      apikey: process.env.KICKBOX_KEY,
      email: email,
      fingerprint: fingerprint
    },
    json: true
  };

  return kickboxCall;
}

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});