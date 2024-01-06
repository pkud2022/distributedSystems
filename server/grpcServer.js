// grpcServer.js (might ranem to app.js)

//these are required for chat service - socket.io
const express = require('express');
const app = express();

const http = require('http');

const path = require('path') //added for websocket issues, declare before 1st use.


const httpServer = http.createServer(app); //different name to avoid conflict; see lab 4
const { Server } = require("socket.io");
//const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));// Socket.io


const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const WebSocket = require('ws'); //package for subscription service

// Load gRPC Protos from protos folder
const protoPath = __dirname + '/protos/';
const packageDefinition = protoLoader.loadSync(
  [protoPath + 'chat.proto', protoPath + 'lights.proto', protoPath + 'subscription.proto'], 
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);


//LIGHTS CONTROL SERVICE IMPLEMENTATION
const lightProto = grpc.loadPackageDefinition(packageDefinition).lightcontrol; //we need to extract this proto from protoLoader

//hard-coded array of roomsID 0 to 5, all lights turned to OFF on initiation (turnOn=false)
const roomStaus = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false
};



// gRPC service methods for Light Control Service
const controlLight = (call, callback) => {
  const { roomID, turnOn } = call.request;
  if (roomStaus.hasOwnProperty(roomID)) { // see https://www.javatpoint.com/javascript-hasownproperty for hasOwnProperty method
      roomStaus[roomID] = turnOn;
      console.log(`ControlLight: Room ${roomID}, Light ${turnOn ? 'On' : 'Off'}`);
      callback(null, { status: "success" });
  } else {
      console.log(`ControlLight: Room ${roomID} does not exist`);
      callback({ code: grpc.status.NOT_FOUND, message: `Room ${roomID} does not exist` });
  }
};

const getLightStatus = (call, callback) => {
  const { roomID } = call.request;
  if (roomStaus.hasOwnProperty(roomID)) {
      console.log(`GetLightStatus: Room ${roomID}, Light ${roomStaus[roomID] ? 'On' : 'Off'}`);
      callback(null, { isOn: roomStaus[roomID] });
  } else {
      console.log(`GetLightStatus: Room ${roomID} does not exist`);
      callback({ code: grpc.status.NOT_FOUND, message: `Room ${roomID} does not exist` });
  }
};



// Create gRPC server for Lights Control Service
const server = new grpc.Server();
// Create WebSocket server for Subscription Service
const wss = new WebSocket.Server({ port: 8081 });//DIFFERENT PORT!

let wsClient = null;
let isSubscribed = false;

//defining various messages being sent to the website by the server - array
const missives = [
  "missive contents being sent to the client - version 1",
  "missive contents being sent to the client - version 2",
  "missive contents being sent to the client - version 3",
  "missive contents being sent to the client - version 4",
  "missive contents being sent to the client - version 5"
];

wss.on('connection', (ws) => {
  console.log("WebSocket client connected"); // Log client connection
  wsClient = ws;


  ws.on('message', (message) => {
    // Convert message from Buffer to string
    let messageText = message.toString();
    console.log("Received message:", messageText); // Log message received

    if (messageText === 'subscribe') {
        isSubscribed = true;
    } else if (messageText === 'unsubscribe') {
        isSubscribed = false;
    }
});

  ws.on('close', () => {
    console.log("WebSocket client disconnected"); // Log client disconnection
    wsClient = null;
    isSubscribed = false;
  });
});

  setInterval(() => {
  if (wsClient && isSubscribed) {
      // Random pick from missives []
      const randomMissive = missives[Math.floor(Math.random() * missives.length)];

      // sending a random missive
      wsClient.send(JSON.stringify({ text: randomMissive }));
  }
  }, 5000); //interval for messages is set here

//launching the Light Service 
server.addService(lightProto.LightControlService.service, { ControlLight: controlLight, GetLightStatus: getLightStatus });

//launching the Subscription Service

//socket.io server to listen to messages from website input
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

//socket.io for chat service
io.on('connection', (socket) => {
  console.log('a user connected to chat'); //for testing purposes to confirm a connection

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Emitting to all clients (please note that in this functionality there is no facitlity to differenciate users, there is no userID)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected from chat'); //for testing purposes, prints when the website on the localhost is closed
  });
});

// Start HTTP server for Socket.IO, lab 4
const httpPort = 8082; // A port different from gRPC and WebSocket, can be varied depending on requirements
httpServer.listen(httpPort, () => {
  console.log(`Socket.IO port is: ${httpPort}`); //for testing in browser
});

// Start gRPC server
const gRPCPort = 8079;
server.bindAsync(`0.0.0.0:${gRPCPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error("Error starting gRPC server:", error);
        return;
    }
    console.log(`gRPC server running on port ${port}`);
    server.start();
});
