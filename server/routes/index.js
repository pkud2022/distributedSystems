/*var express = require('express');
var router = express.Router();

 //GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;*/

router.get('/check-status', async function(req, res, next) {
  var roomID = req.query.roomID;

  try {
    // Simulating a call to check light status and getting a response
    var status = await checkLightStatusFromGrpc(roomID);
    
    res.render('index', { title: 'Light Status', result: 'Status for room ' + roomID + ': ' + status });
  } catch (error) {
    res.render('index', { title: 'Error', result: 'Error checking status' });
  }
});
