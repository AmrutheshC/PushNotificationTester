/**
 *  Push services settings for Blackberry. You need to register your app to use Blackberry's Push Service. See https://www.blackberry.com/profile/?eventId=8121 for details.
 *  You don't need those value if the app doesn't need to be run on Blackberry.
 */
var bb_push_port = "<PORT NUMBER>";
var bb_push_appId = "<ASSIGNED APP ID>";
var bb_push_serverUrl = "<ASSIGNED SERVER URL>";

$fh.ready({}, function() {
  /**
   *  Receive action has to be called first inside $fh.ready otherwise it may not be able to receive the push message that is passed to the app.
   */
  $fh.push({
    act: 'receive'
  }, function(notification) {
    console.log(notification);
    receive_push(notification);
  }, function(err) {});
});


/**
 *  Callback function when a notificaton message is received.
 *  See http://docs.feedhenry.com/reference-docs/api-reference/push-notification/ for the format of the notification message.
 */
var receive_push = function(notification) {
  var msg = '';
  for (var property in notification) {
    msg += property + ' : ' + notification[property] + '<br>';
  }
  message.innerHTML = 'notification received:<br><br>' + msg;
};

/**
 *  Register the app for push notification service. Based on the platform, the user maybe prompted for the permission to allow the app to use push notification service.
 */
function registerAPN() {
  registerButton.disabled = false;
  result.innerHTML = 'Registering...';

  /**
   *  The "params" can be empty object if the app is not going to run on Blackberry
   */
  $fh.push({
    act: 'register',
    params: {
      //bb:{
      //  port:bb_push_port, 
      //  appId:bb_push_appId, 
      //  serverUrl: bb_push_serverUrl
      //},
      //apid: '88ae3536-b154-4488-921e-8ca04ae2921d'
    }
  }, successCallback, errorCallback);
}

/**
 * Success callback function when the app has registered for push notification on device.
 * A unique id will be returned from the device and it should be send to the server to register the device with Urbanairship.
 */
function successCallback(e) {
  var deviceID= e.deviceToken || e.devicePIN || e.apid;
  result.innerHTML = "Device registered. Device token:<br>" + (deviceID) + '.<br><br>';
  result.innerHTML += "Now registering with UrbanAirship...<br>";
  e.ts = new Date().getTime();

  localStorage.setItem('deviceID',deviceID);
  alert(deviceID);

  $fh.act({
    act: 'registerUA',
    req: e
  }, function(res) {
    if (res.result == 'ok') {
      result.innerHTML += "Registration Finishied.<br>";
    } else {
      result.innerHTML += "Error when registering with UrbanAirship.<br>";
    }
  });
}

/**
 * Error callback function is the app failed to register push notification.
 */
function errorCallback(e) {
  console.log(e);
  result.innerHTML = 'Error during registration: ' + e + '<br>';
  registerButton.disabled = false;
}

/**
 * Call server side function to send a push notification message.
 */
function broadcastMessage() {
  $fh.act({
      act: 'pushMessages',
      req: {
        ts: new Date().getTime()
      }
    },
    function(res) {
      result.innerHTML += "Message sent<br>";
    });
}

/**
 * Call server side function to send a direct push notification message.
 */
function directMessage() {
  var deviceID = localStorage.getItem('deviceID') || '';
  $fh.act({
      act: 'pushDirectMessage',
      req: {
        ts: new Date().getTime(),
        deviceID: deviceID
      }
    },
    function(res) {
      result.innerHTML += "Direct Message sent<br>";
    });
}