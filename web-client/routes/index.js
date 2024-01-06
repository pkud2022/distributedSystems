var express = require('express');
var router = express.Router();
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// proto file loading:
const protoPath = __dirname + '/../protos/';

//package loader loads 3 proto, excessive, could be simplified
var packageDefinition = protoLoader.loadSync(
  [protoPath + 'lights.proto'],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);
//proto needs to be "unpackaged" from the protoloader, possibly can be simplified
var chatProto = grpc.loadPackageDefinition(packageDefinition).chat;
var lightProto = grpc.loadPackageDefinition(packageDefinition).lightcontrol;
var subscriptionProto = grpc.loadPackageDefinition(packageDefinition).subscription;


var client = new lightProto.LightControlService("localhost:8079", grpc.credentials.createInsecure()); 

// GET home page - form for controlling and checking light status. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Light Control', result: null });
});

// POST request to control light 
router.post('/control-light', function(req, res) {
  var roomID = req.body.roomID;
  var turnOn = req.body.turnOn === 'true';

  client.ControlLight({ roomID, turnOn }, (error, response) => {
    if (error) {
      console.error("Error in ControlLight:", error); // Log detailed error
      res.render('index', { title: 'Error', result: 'Error controlling light: ' + error.message });
      return;
    }
    res.render('index', { title: 'Light Controlled', result: `Light status in room ${roomID}: ${turnOn ? 'ON' : 'OFF'}` });
  });
});

// POST request to check light status 
router.post('/check-status', function(req, res) {
  var roomID = req.body.roomID;

  client.GetLightStatus({ roomID }, (error, response) => {
    if (error) {
      console.error("Error in GetLightStatus:", error); // Log detailed error
      res.render('index', { title: 'Error', result: 'Error checking status: ' + error.message });
      return;
    }
    res.render('index', { title: 'Light Status', result: `Lights status in room ${roomID}: ${response.isOn ? 'ON' : 'OFF'}` });
  });
});

/* CHAT IS NOT HANDLED BY GRPC
//router.get for chat functionality
router.get('/chat', function(req, res, next) {
  res.render('chat');
});
*/

module.exports = router;
