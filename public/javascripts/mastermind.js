let secret_code;            // Sequence of 4 numbers
let guessesRemaining = 10;
let active_row = 0;
let cracker_board = [];     // For storing the code cracker's responses & feedback

// Board settings
let num_rows = 10;          // 10 attempt rows
let num_cols = 5;           // 4 attempt columns + 1 feedback column

// Initialize the board
for (let i = 0; i < num_rows; i++) {
  cracker_board.push(new Array(num_cols));
}

window.addEventListener('DOMContentLoaded', () => {
    
});
