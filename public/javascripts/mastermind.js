let row_code = [];          // Sequence of 4 numbers
let secret_code = [];
let guessesRemaining = 10;
let active_row = 0;
let board = [];             // For storing the code cracker's responses & feedback

// Board settings
let num_rows = 10;          // 10 attempt rows
let num_cols = 5;           // 4 attempt columns + 1 feedback column

// Initialize the board
for (let i = 0; i < num_rows; i++) {
  board.push(new Array(num_cols));
}

window.addEventListener('DOMContentLoaded', () => {
    let check_btn = document.querySelector('input.active');
    check_btn.addEventListener('click', checkRow);
});

function checkRow() {
    let row = this.parentNode.parentNode;
    let cells = row.children;
    row_code = [];  // Clear any previous code
    // Iterate num_cols - 1 times because one column is for feedback
    for (let i = 0; i < num_cols - 1; i++) {
        let guess_val = cells[i].children[0].value;
        if (guess_val == '') {
            let other_feedback_div = document.getElementById('other-feedback');
            other_feedback_div.innerText = 'Please enter numbers in all the text fields for the current row.';
        } else {
            row_code.push(guess_val);
        }
    }
    // Check the current code against the secret code
    axios
      .get('/secret-code')
      .then(resp => {
          secret_code = resp.data;
          if (_.isEqual(row_code, secret_code)) {
              
          } else {
              
          }
      })
      .catch(error => {
          console.error(error);
      });
}
