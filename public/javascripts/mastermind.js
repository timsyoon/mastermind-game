let row_code = [];           // Sequence of 4 numbers
let secret_code = [];
let guessesRemaining = 10;
let current_row_index = 10;  // Starting from the top of the table
let board = [];              // For storing the player's responses & feedback

// Board settings
let num_rows = 10;           // 10 attempt rows
let num_cols = 5;            // 4 attempt columns + 1 feedback column

// Initialize the board
for (let i = 0; i < num_rows; i++) {
  board.push(new Array(num_cols));
}

window.addEventListener('DOMContentLoaded', () => {
    addClickListenersToCheckButtons();
    getSecretCode();
});

function addClickListenersToCheckButtons() {
    let check_buttons = document.querySelectorAll('.check-btn');
    for (let i = 0; i < check_buttons.length; i++) {
        check_buttons[i].addEventListener('click', checkRow);
    }
}

function getSecretCode() {
    axios
    .get('/secret-code')
    .then(resp => {
        secret_code = resp.data;
    })
    .catch(error => {
        console.error(error);
    });
}

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
            return;
        } else {
            row_code.push(guess_val);
        }
    }
    checkCodes(row_code, secret_code, this);
}

function checkCodes(row_code, secret_code, current_btn) {
    let other_feedback_div = document.getElementById('other-feedback');
    if (_.isEqual(row_code, secret_code)) {
        other_feedback_div.innerText = 'You won';
    } else {
        if (current_row_index == 1) {
            other_feedback_div.innerText = 'You lost'
        } else {
            updateCheckButton(current_btn);
            current_row_index -= 1;
        }
    }
}

function updateCheckButton(current_btn) {
    // Make button in current row hidden
    current_btn.classList.remove('active');
    current_btn.classList.add('hidden');
    // Make button in next row visible
    let next_row = document.getElementById(`row${current_row_index - 1}`);
    let next_btn = next_row.lastElementChild.children[0];
    next_btn.classList.remove('hidden');
    next_btn.classList.add('active');
}
