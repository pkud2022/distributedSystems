/*var readlineSync = require('readline-sync')
//var axios = require('axios')  //not needed in this case, can be NOT loaded to save processing power
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
*/
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
/*
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
*/

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
  /*
  // Method to control light
  function controlLight(roomID, turnOn) {
    client.ControlLight({ roomID, turnOn: turnOn === 'true' }, (error, response) => {
      if (!error) {
        console.log(`Control Light Response: ${response.status}`);
        console.log(`Lights status in room ${roomID}: ${turnOn === 'true' ? 'ON' : 'OFF'}`);
      } else {
        console.error(`Error: ${error.message}`);
      }
      promptUser(); // Call promptUser again after handling the response
    });
  }
  

   // Method for Lights' status query 
   function getLightStatus(roomID) {
    client.GetLightStatus({ roomID }, (error, response) => {
      if (!error) {
        console.log(`Lights status in room ${roomID}: ${response.isOn ? 'ON' : 'OFF'}`);
      } else {
        console.error(`Error: ${error.message}`);
      }
      promptUser(); // Call promptUser again after handling the response
    });
  }
  */
  // readLineSync command-line takes user's input.
  
 /*while(true) {
    var userInputCommand = readlineSync.question(
        "What would you like to do?\n" +
        "\tType 'status' to get information on lights status in a room.\n" +
        "\tType 'control' if you would like to switch light on/off in a room.\n" +
        "\tPress 'Q' to quit.\n"
    );

    if (userInputCommand.toLowerCase() === "q") {
        console.log("Goodbye!");
        break;
    } else if (userInputCommand.toLowerCase() === "status") {
        var roomID = readlineSync.question("Enter roomID: ");
        getLightStatus(roomID, () => {});
    } else if (userInputCommand.toLowerCase() === "control") {
        var roomID = readlineSync.question("Enter roomID: ");
        var turnOn = readlineSync.question("Turn on? (true/false): ");
        controlLight(roomID, turnOn, () => {});
    }else if (userInputCommand.toLowerCase() === "q") {
            console.log("Goodbye!");
            break;
    } else {
        console.log("Invalid command");
    }
}*/
/*
function promptUser() {
    var userInputCommand = readlineSync.question(
      "\nWhat would you like to do?\n" +
      "\tType 'status' to get information on lights status in a room.\n" +
      "\tType 'control' if you would like to switch light on/off in a room.\n" +
      "\tPress 'Q' to quit.\n"
    );
  
    if (userInputCommand.toLowerCase() === "q") {
      console.log("Goodbye!");
      return; // Exit the function
    } 
  
    var roomID = readlineSync.question("Enter roomID: ");
  
    if (userInputCommand.toLowerCase() === "status") {
      getLightStatus(roomID); // Do not call promptUser here
    } else if (userInputCommand.toLowerCase() === "control") {
      var turnOn = readlineSync.question("Turn on? (true/false): ");
      controlLight(roomID, turnOn); // Do not call promptUser here
    } else {
      console.log("Invalid command");
      promptUser(); // Recursive call for invalid command
    }
  }
  
  // Start the prompt loop
  promptUser();

  */