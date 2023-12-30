var readlineSync = require('readline-sync')
//var axios = require('axios')  //not needed in this case, can be NOT loaded to save processing power
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

/*
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
*/

const protoPath = __dirname + "/protos/";

var packageDefinition = protoLoader.loadSync(
  [protoPath + 'chat.proto', protoPath + 'lights.proto', protoPath + 'subscription.proto'],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

var chatProto = grpc.loadPackageDefinition(packageDefinition).chat;
var lightProto = grpc.loadPackageDefinition(packageDefinition).lightcontrol;
var subscriptionProto = grpc.loadPackageDefinition(packageDefinition).subscription;





var lightProto = grpc.loadPackageDefinition(packageDefinition).lightcontrol;
var client = new lightProto.LightControlService("localhost:8079", grpc.credentials.createInsecure());


  /*// Method to control light
  function controlLight(roomID, turnOn) {
    client.ControlLight({ roomID, turnOn === 'true' }, (error, response) => {
      if (!error) {
        console.log('LightControlResponse:', response);
      } else {
        console.error(error);
      }
    });
  }*/

  // Method to control light
function controlLight(roomID, turnOn) {
    // Correcting the object structure here
    client.ControlLight({ roomID, turnOn: turnOn === 'true' }, (error, response) => {
      if (!error) {
        console.log('LightControlResponse:', response);
      } else {
        console.error(error);
      }
    });
  }
  

   // Method for Lights' status query 
   function getLightStatus(roomID) {
    
    client.GetLightStatus({ roomID }, (error, response) => {
      if (!error) {
        console.log('LightStatusResponse:', response);
      } else {
        console.error(error);
      }
    });
  }
  
  // readLineSync command-line takes user's input.
   
  //var userInputCommand = readlineSync.question("Enter command (control/status): ");
 // var roomID = readlineSync.question("Enter roomID: ");
  
while(true){ //lab wk 2 
    var userInputCommand = readlineSync.question(
        "What would you like to do?\n"
        + "\t Type 'status' to get information on lights status in room. \n"
        + "\t Type 'control' if you would like to switch light on/off in a room. \n"
        + "\t Enter roomID\n"
        + "\t Press Q to quit\n"
      );
    if (userInputCommand.toLowerCase() === "q") {
        console.log("Goodbye!");
        break;
    } else if (userInputCommand.toLowerCase() === "status") {
        var roomID = readlineSync.question("Enter roomID: ");
        getLightStatus(roomID);
    } else if (userInputCommand.toLowerCase() === "control") {
        var roomID = readlineSync.question("Enter roomID: ");
        var turnOn = readlineSync.question("Turn on? (true/false): ");
        controlLight(roomID, turnOn);
    } else {
        console.log("Invalid command");
    }
}   