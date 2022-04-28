let DEBUG = true;

var express = require('express');
var router = express.Router();

const axios = require('axios').default;

// API parameter values
const par_num = 4;
const par_min = 0;
const par_max = 7;
const par_col = 1;
const par_base = 10;
const par_format = 'plain';
const par_rnd = 'new';

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
