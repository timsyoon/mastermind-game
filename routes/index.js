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

let secret_code;            // Sequence of 4 numbers
let guessesRemaining = 10;
let cracker_board = [];     // For storing the code cracker's responses & feedback

// Board settings
let num_rows = 10;          // 10 attempt rows
let num_cols = 5;           // 4 attempt columns + 1 feedback column

// Initialize the board
for (let i = 0; i < num_rows; i++) {
  cracker_board.push(new Array(num_cols));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getRandomNumbers();
  res.render('index', { par_min: par_min, par_max: par_max });
});

function getRandomNumbers() {
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
