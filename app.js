(() => {
    'use strict';

    const display = document.querySelector('[data-display]');
    const expressionDisplay = document.querySelector('[data-expression]');
    const status = document.querySelector('[data-status]');
    const keys = document.querySelector('[data-keypad]');
    const themeToggle = document.querySelector('[data-theme-toggle]');

    let expression = '';
    let justEvaluated = false;

    const operators = ['+', '-', '×', '÷'];

    function isOperator(value) {
        return operators.includes(value);
    }

    function setStatus(message = '') {
        status.textContent = message;
        status.hidden = !message;
    }

    function updateDisplay() {
        expressionDisplay.textContent = expression || '0';
        display.textContent = expression || '0';
        display.setAttribute('aria-label', `Calculator display: ${expression || '0'}`);
    }

    function clearCalculator() {
        expression = '';
        justEvaluated = false;
        setStatus();
        updateDisplay();
    }

    function currentNumber() {
        const match = expression.match(/(?:^|[+\-×÷])(-?(?:\d+\.?\d*|\.\d*))$/);
        return match ? match[1] : '';
    }

    function appendNumber(value) {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
        }

        const number = currentNumber();
        if (value === '.' && number.includes('.')) return;

        if (value === '.' && (!number || number === '-')) {
            expression += '0.';
        } else if (number === '0' && value !== '.') {
            expression = expression.slice(0, -1) + value;
        } else {
            expression += value;
        }

        setStatus();
        updateDisplay();
    }

    function appendOperator(operator) {
        if (!expression) {
            if (operator === '-') {
                expression = '-';
                updateDisplay();
            }
            return;
        }

        justEvaluated = false;

        if (isOperator(expression.slice(-1))) {
            expression = expression.slice(0, -1) + operator;
        } else {
            expression += operator;
        }

        setStatus();
        updateDisplay();
    }

    function backspace() {
        if (justEvaluated) {
            clearCalculator();
            return;
        }
        expression = expression.slice(0, -1);
        setStatus();
        updateDisplay();
    }

    function toggleSign() {
        if (!expression) {
            expression = '-';
            updateDisplay();
            return;
        }

        const match = expression.match(/(?:^|[+\-×÷])(-?(?:\d+\.?\d*|\.\d*))$/);
        if (!match || !match[1]) return;

        const number = match[1];
        const start = expression.length - number.length;
        expression = number.startsWith('-')
            ? expression.slice(0, start) + number.slice(1)
            : expression.slice(0, start) + '-' + number;

        setStatus();
        updateDisplay();
    }

    function tokenize(input) {
        const tokens = [];
        let number = '';

        for (let i = 0; i < input.length; i += 1) {
            const char = input[i];

            if (/\d|\./.test(char)) {
                number += char;
                continue;
            }

            if (isOperator(char)) {
                if (number) {
                    tokens.push(Number(number));
                    number = '';
                }

                if (char === '-' && (tokens.length === 0 || isOperator(tokens[tokens.length - 1]))) {
                    number = '-';
                } else {
                    tokens.push(char);
                }
            }
        }

        if (number && number !== '-') tokens.push(Number(number));
        return tokens;
    }

    function calculate(input) {
        const tokens = tokenize(input);
        if (!tokens.length || isOperator(tokens[tokens.length - 1])) {
            throw new Error('Complete the expression first.');
        }

        const values = [];
        const ops = [];
        const precedence = { '+': 1, '-': 1, '×': 2, '÷': 2 };

        const apply = () => {
            const operator = ops.pop();
            const right = values.pop();
            const left = values.pop();

            if (operator === '÷' && right === 0) {
                throw new Error('Cannot divide by zero.');
            }

            switch (operator) {
                case '+': values.push(left + right); break;
                case '-': values.push(left - right); break;
                case '×': values.push(left * right); break;
                case '÷': values.push(left / right); break;
                default: throw new Error('Invalid operator.');
            }
        };

        tokens.forEach((token) => {
            if (typeof token === 'number') {
                if (!Number.isFinite(token)) throw new Error('Invalid number.');
                values.push(token);
                return;
            }

            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
                apply();
            }
            ops.push(token);
        });

        while (ops.length) apply();

        if (values.length !== 1 || !Number.isFinite(values[0])) {
            throw new Error('Invalid expression.');
        }

        const rounded = Number.parseFloat(values[0].toPrecision(12));
        return Object.is(rounded, -0) ? 0 : rounded;
    }

    function evaluate() {
        if (!expression) return;

        try {
            const result = calculate(expression);
            expressionDisplay.textContent = expression;
            expression = String(result);
            display.textContent = expression;
            justEvaluated = true;
            setStatus('Result');
        } catch (error) {
            setStatus(error.message);
        }
    }

    function handleAction(action) {
        switch (action) {
            case 'clear': clearCalculator(); break;
            case 'backspace': backspace(); break;
            case 'equals': evaluate(); break;
            case 'sign': toggleSign(); break;
            case 'percent':
                try {
                    const number = currentNumber();
                    if (number) {
                        expression = expression.slice(0, -number.length) + String(Number(number) / 100);
                        updateDisplay();
                    }
                } catch (_) {
                    setStatus('Invalid percentage.');
                }
                break;
            default: break;
        }
    }

    keys.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value && /^\d$/.test(value)) appendNumber(value);
        else if (value === '.') appendNumber(value);
        else if (value && isOperator(value)) appendOperator(value);
        else if (action) handleAction(action);
    });

    document.addEventListener('keydown', (event) => {
        if (/^\d$/.test(event.key)) appendNumber(event.key);
        else if (event.key === '.') appendNumber('.');
        else if (['+', '-'].includes(event.key)) appendOperator(event.key);
        else if (event.key === '*') appendOperator('×');
        else if (event.key === '/') appendOperator('÷');
        else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            evaluate();
        } else if (event.key === 'Backspace') backspace();
        else if (event.key === 'Escape') clearCalculator();
    });

    themeToggle.addEventListener('click', () => {
        const dark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('calculator-theme', dark ? 'dark' : 'light');
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });

    if (localStorage.getItem('calculator-theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }

    updateDisplay();
})();
