var express = require('express');
const axios = require('axios').default;

var router = express.Router();

// API parameter values
const par_num = 4;
const par_min = 0;
const par_max = 7;
const par_col = 1;
const par_base = 10;
const par_format = 'plain';
const par_rnd = 'new';

let secret_code;  // Sequence of 4 numbers
let guessesRemaining = 10;
let board = [];

// Board settings
let num_rows = 11;  // 10 attempt rows + 1 answer row
let num_cols = 8;   // 4 attempt columns + 4 feedback columns

// Initialize the board
for (let i = 0; i < num_rows; i++) {
  board.push(new Array(num_cols));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getRandomNumbers(res);
  res.render('index', { title: 'Mastermind' });
});

function getRandomNumbers(res) {
  // Make an HTTP GET request to the Random Integer Generator
  axios
    .get(`https://www.random.org/integers/?num=${par_num}&min=${par_min}&max=${par_max}&col=${par_col}&base=${par_base}&format=${par_format}&rnd=${par_rnd}`)
    .then(resp => {
      secret_code = resp.data.trim().split('\n');
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = router;
