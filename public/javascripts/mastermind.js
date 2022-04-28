let row_code = [];           // Sequence of 4 numbers
let secret_code = [];
let guessesRemaining = 10;
let current_row_index = 10;  // Starting from the top of the table
let board = [];              // For storing the player's responses
let feedback_pegs = [];      // For storing feedback on the player's guesses

// Board settings
let num_rows = 10;
let num_cols = 4;

// Initialize the board and feedback arrays
for (let i = 0; i < num_rows; i++) {
  board.push(new Array(num_cols));
  feedback_pegs.push(new Array(num_cols));
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
        }
        else {
            row_code.push(guess_val);
        }
    }
    board[current_row_index] = row_code;  // Store the guesses
    checkCodes(row_code, secret_code, this);
}

function checkCodes(row_code, secret_code, current_btn) {
    let other_feedback_div = document.getElementById('other-feedback');
    if (_.isEqual(row_code, secret_code)) {
        generateGuessFeedback(row_code, secret_code);
        other_feedback_div.innerText = 'You won';
    }
    else {
        generateGuessFeedback(row_code, secret_code);
        if (current_row_index == 1) {
            other_feedback_div.innerText = 'You lost'
        }
        else {
            updateCheckButton(current_btn);
            current_row_index -= 1;
        }
    }
}

function generateGuessFeedback(row_code, secret_code) {
    let feedback_array = [];  // 'o' for correct number & location, 'x' for only correct number
    // Find counts of each number in the secret code
    let map_secret = new Map();
    for (let i = 0; i < secret_code.length; i++) {
        let current_num = secret_code[i];
        if (!map_secret.has(current_num)) {
            map_secret.set(current_num, 1);
        }
        else {
            map_secret.set(current_num, map_secret.get(current_num) + 1);
        }
    }
    // Populate the feedback array
    // We will let exact matches (represented by 'o') take precedence over partial matches
    for (let j = 0; j < row_code.length; j++) {
        let current_num = row_code[j];
        if (map_secret.has(current_num) && map_secret.get(current_num) > 0) {
            if (current_num == secret_code[j]) {
                feedback_array.push('o');
                map_secret.set(current_num, map_secret.get(current_num) - 1);
            }
        }
    }
    // Find partial matches
    for (let k = 0; k < row_code.length; k++) {
        let current_num = row_code[k];
        if (map_secret.has(current_num) && map_secret.get(current_num) > 0) {
            if (current_num != secret_code[k]) {
                feedback_array.push('x');
                map_secret.set(current_num, map_secret.get(current_num) - 1);
            }
        }
    }
    while (feedback_array.length < 4) {
        feedback_array.push('');
    }
    // Shuffle the array so that the feedback does not give away which numbers
    // were an exact/partial/non match
    fisherYates(feedback_array);
    feedback_pegs[current_row_index] = feedback_array;  // Store the feedback
}

// Shuffle the array
// From http://sedition.com/perl/javascript-fy.html
function fisherYates (myArray) {
    var i = myArray.length;
    if (i == 0) return false;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempi = myArray[i];
        var tempj = myArray[j];
        myArray[i] = tempj;
        myArray[j] = tempi;
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
