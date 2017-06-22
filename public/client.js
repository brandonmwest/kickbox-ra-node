$(function() {
  var email;
  
  //Your Recipient Authentication auth code
  var kickbox_app_code = "xy2Nn_5hAGp2ZFuu88gB";

   $('form').submit(function(event) {
    //only prevent the default submit action if the form is valid
    //otherwise, let it proceed and fail, so we get native HTML5 validation
    if($('form')[0].checkValidity()) {
      event.preventDefault();
    }
    
    //get the provided email address
    email = $('input').val();
    
    //get the fingerprint, call our server-code, display tracker
    Kickbox.fingerprint(
    {
      app: kickbox_app_code, //your kickbox authentication app code
      email: email, // Email address to authenticate
      onSuccess: fingerprintSuccess,
      onError: function(err) {
        alert(err);
      }
    });
  });

var fingerprintSuccess = function(fingerprint) {
  //make a post to our /authenticate route
  $.post( "/authenticate", 
    { 
      email: email, 
      fingerprint: fingerprint, 
      kickbox_app_code: kickbox_app_code 
    }, 
    //handle the response
    function(response){
    //do this if something goes wrong
      if (response.success != true) {
        alert(response.body.message);  
        return;
      }

      //get the tracking token from the API response
      var track_token = response.track_token;        

      //show the kickbox email tracker
      Kickbox.track({
        app: kickbox_app_code,
        token: track_token,
        element: $('#tracker')[0]
      });
    });
  }
})