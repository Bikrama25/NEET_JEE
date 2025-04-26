class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = undefined;
        this.resetScreen = false;
    }

    appendNumber(number) {
        if (this.currentInput === '0' || this.resetScreen) {
            this.currentInput = number;
            this.resetScreen = false;
        } else {
            this.currentInput += number;
        }
    }

    appendDecimal() {
        if (this.resetScreen) {
            this.currentInput = '0.';
            this.resetScreen = false;
            return;
        }
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
    }

    handleOperation(op) {
        if (this.currentInput === '') return;
        if (this.previousInput !== '') {
            this.compute();
        }
        this.operation = op;
        this.previousInput = this.currentInput;
        this.currentInput = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        if (isNaN(prev) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            case '√':
                computation = Math.sqrt(prev);
                break;
            case 'sin':
                computation = Math.sin(prev);
                break;
            case 'cos':
                computation = Math.cos(prev);
                break;
            case 'tan':
                computation = Math.tan(prev);
                break;
            case 'log':
                computation = Math.log10(prev);
                break;
            case 'ln':
                computation = Math.log(prev);
                break;
            default:
                return;
        }

        this.currentInput = computation.toString();
        this.operation = undefined;
        this.previousInput = '';
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = undefined;
    }

    delete() {
        this.currentInput = this.currentInput.toString().slice(0, -1);
        if (this.currentInput === '') {
            this.currentInput = '0';
        }
    }

    updateDisplay() {
        const currentDisplay = document.getElementById('calculator-display');
        const previousDisplay = document.getElementById('previous-display');
        
        currentDisplay.textContent = this.currentInput;
        if (this.operation != null) {
            previousDisplay.textContent = `${this.previousInput} ${this.operation}`;
        } else {
            previousDisplay.textContent = '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const decimalButton = document.querySelector('[data-decimal]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.handleOperation(button.textContent);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

decimalButton.addEventListener('click', () => {
    calculator.appendDecimal();
    calculator.updateDisplay();
});
