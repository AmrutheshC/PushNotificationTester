/**
 * Register a device to Urbanairship
 */


exports.registerUA = function(params, callback) {
  //return callback(null, {test: 'test'});
  var deviceId, platfrom;
  if (params.deviceToken) {
    deviceId = params.deviceToken;
    platform = "ios";
  } else if (params.devicePIN) {
    deviceId = params.devicePIN;
    platform = "blackberry";
  } else if (params.apid) {
    deviceId = params.apid;
    platform = "android";
  }
  /**
   * Urbanairship API supports tagging a device.
   * To do that, you can pass an extra parameter called "data" with the content specified in http://urbanairship.com/docs/push.html#registration
   */
  $fh.push({
    'act': 'register',
    'type': 'dev',
    'params': {
      'id': deviceId,
      'platform': platform
    }
  }, function(err, res) {
    if (err) {
      console.log(err.toString());
    } else {
      console.log("status from UA : " + res.status);
      return callback(null, {
        'result': 'ok'
      });
    }
  });
};

// Broadcast message to all registered devices
exports.pushMessages = function(params, callback) {
  console.log("PARAMS broadcast",params);
  var message = "Broadcast Message";
  /**
   * Broadcast a message to all the devices.
   * The format for each platform is different. See http://urbanairship.com/docs/ for API details for each platform.
   */
  var ios_message = {
    'aps': {
      'alert': message
    }
  };
  var android_message = {
    'android': {
      'alert': message
    }
  };
  var blackberry_message = {
    'blackberry': {
      'content-type': 'text/plain',
      'body': message
    }
  };
  var res_ios = $fh.push({
    'act': 'broadcast',
    'type': 'dev',
    'params': ios_message
  });
  var res_android = $fh.push({
    'act': 'broadcast',
    'type': 'dev',
    'params': android_message
  });
  return callback(null, {
    'result': 'ok'
  });
};


// Send direct message to set of registered Devices
exports.pushDirectMessage = function(params, callback) {
  console.log("PARAMS direct",params);
  var message = "direct message";
  var deviceToken = params.deviceID;

  // var ios_message = {
  //   'device_tokens': [deviceToken],
  //   'aps': {
  //     'alert': message
  //   }
  // };

  var android_message = {
    'device_tokens': [deviceToken],
    'android': {
      'alert': message
    }
  };

  $fh.push({
    'act': 'push',
    'type': 'dev',
    'params': android_message
  }, function(err, res) {
    if (err) {
      console.log(err.toString());
    } else {
      console.log("status from UA : " + res.status);
      return callback(null, {
        'result': 'ok'
      });
    }
  });
};