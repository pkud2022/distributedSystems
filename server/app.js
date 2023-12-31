var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

//listing proto files that i will load. I am using const as I will not be re-declaring them
// refernce source: https://www.npmjs.com/package/@grpc/proto-loader
const chatProtoPath = __dirname + "/protos/chat.proto";
const lightsProtoPath = __dirname + "/protos/lights.proto";
const subscriptionProtoPath = __dirname + "/protos/subscription.proto";

var packageDefinition = protoLoader.loadSync( //this is the protoloader, as in www.npmjs.com
  [chatProtoPath, lightsProtoPath, subscriptionProtoPath], //array of loaded proto files loaded by loadSync method
  {
    keepCase: true, //for constency with proto files
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

var loadedProtos = grpc.loadPackageDefinition(packageDefinition); //can i change this to const? 
//the following line here needs to extract from the protoLoader - i don't know why
var lightControlService = loadedProtos.lightcontrol.LightControlService;

//CLIENT-SIDE STREAMING - Light Control - lights.proto
var lightsStatus = {};
var dataLights = [ //hardcoded room data
  {
    roomID:1,
    turnOn: false
  },
  {
    roomID:2,
    turnOn: true
  },
  {
    roomID:3,
    turnOn: false
  },
  {
    roomID:4,
    turnOn: false
  },
  {
    roomID:5,
    turnOn: true
  }
]

function controlLight(call, callback){
  var roomID = call.request.roomID;
  var turnOn = call.request.turnOn;

  lightsStatus[roomID] = turnOn;
  
  console.log(`Light status in room ${roomID} set to: ${turnOn ? 'ON' : 'OFF'}`);
  
    callback(null, { status: "success" }); //wk 8 lab
}

function getLightStatus(call, callback) { //see guided lab 7 for call
  var roomID = call.request.roomID;
  
  if (lightsStatus[roomID] == null) {
    // If the roomID is found, return its status
    console.log(`Room ${roomID} status: ${lightsStatus[roomID] ? 'ON' : 'OFF'}`);
  } else {
    console.log(`Room ${roomID} status: error (room not found)`);
  }

  // Since we're just logging to the console, you might want to still send a basic response back
  callback(null, { status: 'Processed request' });
}

//adding service as per guided lab wk 8, but adding 2 services instead, as per: https://grpc.io/docs/languages/node/basics/#starting-the-server

var server = new grpc.Server()
server.addService(lightControlService.service, { 
  ControlLight: controlLight,
  GetLightStatus: getLightStatus
});

//launching the server, please note the port
server.bindAsync('0.0.0.0:8079', grpc.ServerCredentials.createInsecure(), () => {
  console.log("Server running at http://0.0.0.0:8079");
  server.start();
});

//module.exports = app; THIS IS COMMENTED OUT - important in the context of Express


