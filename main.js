const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');

let displayValue = '0';
let number1 = null;
let operator = null;
let waitingForSecondNumber = false;
const maxDigits = 9;

function updateDisplay() {
    displayValue = displayValue.slice(0, maxDigits);
    screen.textContent = displayValue;
}

// When I press the clear button it resets everything
function clearCalculator() {
    displayValue = '0';
    number1 = null;
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay();
}


function inputDigit(digit) {
    // If it's ready for the second number, it will replace the value with the digit
    // and then make it false again, so further clicks add digits to it.
    if (waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
    // If the value on the screen is the default 0, replaces it with a digit
    // If not, it keeps adding digits one after another
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    // If the value is longer than maxDigits, it slices the exess and returns 9 digits
    if (displayValue.length > maxDigits) {
        displayValue = displayValue.slice(0, maxDigits);
    }
    updateDisplay();
}

// If the value doesn't have any decimal points, then it can add one
function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    // Change display value into a float number
    const inputValue = parseFloat(displayValue);

    // If number1 has't been used yet, and is a valid number, assign inputValue to it
    if (number1 === null && !isNaN(inputValue)) {
        number1 = inputValue;
    } else if (operator) {
        const result = calculate(number1, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        number1 = result;
    }

    waitingForSecondNumber = true;
    operator = nextOperator;
    updateDisplay();
}

function calculate(first, second, op) {
    switch(op) {
        case 'add': return first + second;
        case 'subtract': return first - second;
        case 'multiply': return first * second;
        case 'divide': return second !== 0 ? first / second : 'Error';
        default: return second;
    }
}

function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

calculator.addEventListener('click', function(event) {
    const target = event.target;
    if (!target.matches('div')) return;

    if (target.id.startsWith('num')) {
        inputDigit(target.textContent);
    } else if (target.id.startsWith('operator')) {
        // split('-'[1]) splits the #id into 2 part arra based on the - in the name
        // it then picks the second word [1], which is 'add' or 'divide', etc. 
        handleOperator(target.id.split('-')[1]);
    } else if (target.id === 'clear') {
        clearCalculator();
    } else if (target.id === 'comma') {
        inputDecimal();
    } else if (target.id === 'backspace') {
        backspace();
    } else if (target.id === 'equals') {
        if (number1 !== null && operator) {
            const inputValue = parseFloat(displayValue);
            displayValue = `${parseFloat(calculate(number1, inputValue, operator).toFixed(7))}`;
            number1 = null;
            operator = null;
            waitingForSecondNumber = false;
            updateDisplay();
        }
    }
});

updateDisplay();

