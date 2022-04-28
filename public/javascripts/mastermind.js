let isGameActive = true;
let row_code = [];           // Sequence of 4 numbers
let secret_code = [];
let current_row_index = 9;   // 0 = top guess row, 9 = bottom guess row
let board = [];              // For storing the player's responses
let feedback_pegs = [];      // For storing feedback on the player's guesses

// Board settings
let num_rows = 10;
let num_cols = 4;

// Initialize the board and feedback arrays
for (let i = 0; i < num_rows; i++) {
  board.push([]);
  feedback_pegs.push([]);
}

window.addEventListener('DOMContentLoaded', () => {
    addClickListenersToCheckButtons();
    getSecretCode();
    displayWelcomeText();
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

function displayWelcomeText() {
    let other_feedback_div = document.getElementById('other-feedback');
    let attempt_string = current_row_index == 0 ? 'attempt' : 'attempts';
    other_feedback_div.innerText = `Welcome to Mastermind! Use the numbers in the number bank below to guess the correct pattern. You have ${current_row_index + 1} ${attempt_string} remaining.`;
}

function checkRow() {
    if (!isGameActive) return;
    let row_element = this.parentNode.parentNode;
    let cell_elements = row_element.children;
    row_code = [];  // Clear any previous code
    for (let i = 0; i < num_cols; i++) {
        let guess_val = cell_elements[i].children[0].value;
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
    console.log(board);
    console.log(feedback_pegs);
}

function checkCodes(row_code, secret_code, current_btn) {
    
    let other_feedback_div = document.getElementById('other-feedback');
    let row_feedback_pegs;
    
    if (_.isEqual(row_code, secret_code)) {
        row_feedback_pegs = generateFeedbackPegs(row_code, secret_code);
        displayFeedbackPegs(row_feedback_pegs, current_btn);
        other_feedback_div.innerText = 'You won! You correctly guessed the pattern.';
        revealCorrectPattern();
        isGameActive = false;
    }
    else {
        row_feedback_pegs = generateFeedbackPegs(row_code, secret_code);
        displayFeedbackPegs(row_feedback_pegs, current_btn);
        if (current_row_index == 0) {
            other_feedback_div.innerText = 'You lost.. You have run out of remaining attempts.';
            revealCorrectPattern();
            isGameActive = false;
        }
        else {
            updateCheckButton(current_btn);
            current_row_index -= 1;
            let attempt_string = current_row_index == 0 ? 'attempt' : 'attempts';
            other_feedback_div.innerText = `You have ${current_row_index + 1} remaining ${attempt_string}.`;
        }
    }
}

function generateFeedbackPegs(row_code, secret_code) {
    let row_feedback_pegs = [];  // 'o' for correct number & location, 'x' for only correct number
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
    // We will let exact matches (represented by 'o' pegs) take precedence over partial matches
    for (let j = 0; j < row_code.length; j++) {
        let current_num = row_code[j];
        if (map_secret.has(current_num) && map_secret.get(current_num) > 0) {
            if (current_num == secret_code[j]) {
                row_feedback_pegs.push('o');
                map_secret.set(current_num, map_secret.get(current_num) - 1);
            }
        }
    }
    // Find partial matches (represented by 'x' pegs)
    for (let k = 0; k < row_code.length; k++) {
        let current_num = row_code[k];
        if (map_secret.has(current_num) && map_secret.get(current_num) > 0) {
            if (current_num != secret_code[k]) {
                row_feedback_pegs.push('x');
                map_secret.set(current_num, map_secret.get(current_num) - 1);
            }
        }
    }
    while (row_feedback_pegs.length < 4) {
        row_feedback_pegs.push('-');
    }
    // Shuffle the array so that the feedback does not give away which numbers
    // were an exact/partial/non match
    fisherYates(row_feedback_pegs);
    feedback_pegs[current_row_index] = row_feedback_pegs;  // Store the feedback
    return row_feedback_pegs;
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

function displayFeedbackPegs(row_feedback_pegs, current_btn) {
    let feedback_table = current_btn.parentNode.previousElementSibling.children[0];
    
    let first_row = feedback_table.children[0].children[0];
    first_row.children[0].innerText = row_feedback_pegs[0];
    first_row.children[1].innerText = row_feedback_pegs[1];

    let second_row = feedback_table.children[0].children[1];
    second_row.children[0].innerText = row_feedback_pegs[2];
    second_row.children[1].innerText = row_feedback_pegs[3];
}

function revealCorrectPattern() {
    let answer_row = document.getElementById('answer-row');
    for (let i = 0; i < secret_code.length; i++) {
        answer_row.children[i].innerText = secret_code[i];
    }
}

function updateCheckButton(current_btn) {
    // Make button in current row hidden
    current_btn.classList.remove('active');
    current_btn.classList.add('hidden');
    // Make button in next row visible
    let next_row = document.getElementById(`guess-row${current_row_index - 1}`);
    let next_btn = next_row.lastElementChild.children[0];
    next_btn.classList.remove('hidden');
    next_btn.classList.add('active');
}
