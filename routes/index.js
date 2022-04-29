var express = require('express');
var router = express.Router();

var axios = require('axios').default;
var async = require('async');
var Game = require('../models/game');
var game_controller = require('../controllers/gameController.js')

// var mongoose = require('mongoose');

// Set up mongoose connection
// var mongoDB = 'insert_your_database_url_here';
// mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// API parameter values
const par_num = 4;
const par_min = 0;
const par_max = 7;
const par_col = 1;
const par_base = 10;
const par_format = 'plain';
const par_rnd = 'new';

let DEBUG = true;
let secret_code;

/* GET home page. */
router.get('/', function(req, res, next) {
  generateRandomNumbersAndRender(res);
});

router.get('/secret-code', function(req, res, next) {
  if (secret_code != undefined) {
    res.set('content-type', 'text/plain');
    res.send(JSON.stringify(secret_code));
  }
  else {
    generateRandomNumbersAndRespond(res);
  }
});

router.post('/games', function(req, res, next) {
  game_controller.create_game(req, res);
});

function generateRandomNumbersAndRespond(res) {
  // Make an HTTP GET request to the Random Integer Generator
  axios
    .get(`https://www.random.org/integers/?num=${par_num}&min=${par_min}&max=${par_max}&col=${par_col}&base=${par_base}&format=${par_format}&rnd=${par_rnd}`)
    .then(resp => {
      secret_code = resp.data.trim().split('\n');
      if (DEBUG) console.log(`secret_code = ${secret_code}`);
      res.set('content-type', 'text/plain');
      res.send(JSON.stringify(secret_code));
    })
    .catch(error => {
      console.error(error);
    });
}

function generateRandomNumbersAndRender(res) {
  // Make an HTTP GET request to the Random Integer Generator
  axios
    .get(`https://www.random.org/integers/?num=${par_num}&min=${par_min}&max=${par_max}&col=${par_col}&base=${par_base}&format=${par_format}&rnd=${par_rnd}`)
    .then(resp => {
      secret_code = resp.data.trim().split('\n');
      if (DEBUG) console.log(`secret_code = ${secret_code}`);
      res.render('index', { par_min: par_min, par_max: par_max });
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = router;
