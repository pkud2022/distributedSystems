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

var loadedProtos = grpc.loadPackageDefinition(packageDefinition);


//CLIENT-SIDE STREAMING - Light Control - lights.proto

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

  
}

function getLightStatus(call, callback) {
  for(var i = 0; i<data.length; i++){
    call.write({
      movieType: dataLights[i].roomID,
      turnOn: data[i].turnOn
    })
  }
  call.end()
}

//adding service as per guided lab wk 8, but adding 2 services instead, as per: https://grpc.io/docs/languages/node/basics/#starting-the-server

server.addService(lightsProto.LoghtControlService.service, { 
  ControlLight: controlLight,
  GetLightStatus: getLightStatus
});



var server = new grpc.Server()

/*DELETE THIS FRAGMENT

var PROTO+PATH = __dirname + "/protos/lights.proto;     
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH
)*/


 



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
