(() => {
    'use strict';

    const display = document.querySelector('[data-display]');
    const expressionDisplay = document.querySelector('[data-expression]');
    const status = document.querySelector('[data-status]');
    const keys = document.querySelector('[data-keypad]');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const historyToggle = document.querySelector('[data-history-toggle]');
    const historyPanel = document.querySelector('[data-history-panel]');
    const historyList = document.querySelector('[data-history-list]');
    const clearHistoryButton = document.querySelector('[data-clear-history]');
    const copyButton = document.querySelector('[data-copy-result]');

    let expression = '';
    let justEvaluated = false;
    let lastExpression = '';
    let lastResult = '';
    let memory = Number.parseFloat(localStorage.getItem('calculator-memory') || '0') || 0;

    const HISTORY_KEY = 'calculator-history';
    const operators = ['+', '-', '×', '÷'];
    const MAX_HISTORY = 30;

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

    function persistMemory() {
        localStorage.setItem('calculator-memory', String(memory));
    }

    function getHistory() {
        try {
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            return Array.isArray(history) ? history : [];
        } catch (_) {
            return [];
        }
    }

    function saveHistory(items) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
        renderHistory();
    }

    function addHistory(calculation, result) {
        const history = getHistory();
        history.unshift({ calculation, result, timestamp: Date.now() });
        saveHistory(history);
    }

    function formatHistoryTime(timestamp) {
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderHistory() {
        const history = getHistory();
        historyList.replaceChildren();

        if (!history.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'No calculations yet.';
            historyList.appendChild(empty);
            return;
        }

        history.forEach((item, index) => {
            const entry = document.createElement('button');
            entry.type = 'button';
            entry.className = 'history-entry';
            entry.dataset.historyIndex = String(index);

            const calculation = document.createElement('span');
            calculation.className = 'history-calculation';
            calculation.textContent = item.calculation;

            const result = document.createElement('strong');
            result.className = 'history-result';
            result.textContent = `= ${item.result}`;

            const time = document.createElement('small');
            time.textContent = formatHistoryTime(item.timestamp);

            entry.append(calculation, result, time);
            historyList.appendChild(entry);
        });
    }

    function toggleHistory(force) {
        const shouldOpen = typeof force === 'boolean' ? force : historyPanel.hidden;
        historyPanel.hidden = !shouldOpen;
        historyToggle.setAttribute('aria-expanded', String(shouldOpen));
        if (shouldOpen) renderHistory();
    }

    function clearCalculator() {
        expression = '';
        justEvaluated = false;
        lastExpression = '';
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
            lastResult = '';
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

        if (expression === '-') return;
        justEvaluated = false;
        lastResult = '';

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
                    if ((number.match(/\./g) || []).length > 1) throw new Error('Invalid decimal number.');
                    tokens.push(Number(number));
                    number = '';
                }

                if (char === '-' && (tokens.length === 0 || isOperator(tokens[tokens.length - 1]))) {
                    number = '-';
                } else {
                    tokens.push(char);
                }
            } else {
                throw new Error('Invalid expression.');
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

            if (typeof left !== 'number' || typeof right !== 'number') {
                throw new Error('Invalid expression.');
            }
            if (operator === '÷' && right === 0) throw new Error('Cannot divide by zero.');

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

            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) apply();
            ops.push(token);
        });

        while (ops.length) apply();
        if (values.length !== 1 || !Number.isFinite(values[0])) throw new Error('Invalid expression.');

        const rounded = Number.parseFloat(values[0].toPrecision(12));
        return Object.is(rounded, -0) ? 0 : rounded;
    }

    function evaluate() {
        if (!expression || expression === '-') return;

        try {
            const calculation = expression;
            const result = calculate(expression);
            const resultText = String(result);

            expressionDisplay.textContent = calculation;
            expression = resultText;
            display.textContent = resultText;
            display.setAttribute('aria-label', `Calculator result: ${resultText}`);
            justEvaluated = true;
            lastExpression = calculation;
            lastResult = resultText;
            setStatus('Result');
            addHistory(calculation, resultText);
        } catch (error) {
            setStatus(error.message);
        }
    }

    function replaceCurrentNumber(value) {
        const number = currentNumber();
        if (!number) return false;
        expression = expression.slice(0, -number.length) + value;
        justEvaluated = false;
        updateDisplay();
        return true;
    }

    function applyPercentage() {
        const number = currentNumber();
        if (!number) return;
        replaceCurrentNumber(String(Number(number) / 100));
    }

    function currentNumericValue() {
        const source = justEvaluated && lastResult ? lastResult : currentNumber();
        const value = Number(source);
        return Number.isFinite(value) ? value : null;
    }

    function memoryAction(action) {
        const value = currentNumericValue();

        switch (action) {
            case 'clear':
                memory = 0;
                persistMemory();
                setStatus('Memory cleared');
                break;
            case 'recall':
                if (Number.isFinite(memory)) {
                    expression = String(memory);
                    justEvaluated = false;
                    setStatus('Memory recalled');
                    updateDisplay();
                }
                break;
            case 'store':
                if (value !== null) {
                    memory = value;
                    persistMemory();
                    setStatus('Stored in memory');
                }
                break;
            case 'add':
                if (value !== null) {
                    memory += value;
                    persistMemory();
                    setStatus('Added to memory');
                }
                break;
            case 'subtract':
                if (value !== null) {
                    memory -= value;
                    persistMemory();
                    setStatus('Subtracted from memory');
                }
                break;
            default: break;
        }
    }

    async function copyResult() {
        const value = display.textContent || '0';
        try {
            await navigator.clipboard.writeText(value);
            setStatus('Result copied');
        } catch (_) {
            setStatus('Unable to copy result.');
        }
    }

    function handleAction(action) {
        switch (action) {
            case 'clear': clearCalculator(); break;
            case 'backspace': backspace(); break;
            case 'equals': evaluate(); break;
            case 'sign': toggleSign(); break;
            case 'percent': applyPercentage(); break;
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

    document.querySelector('.memory-bar').addEventListener('click', (event) => {
        const button = event.target.closest('[data-memory]');
        if (button) memoryAction(button.dataset.memory);
    });

    historyList.addEventListener('click', (event) => {
        const entry = event.target.closest('[data-history-index]');
        if (!entry) return;

        const item = getHistory()[Number(entry.dataset.historyIndex)];
        if (!item) return;

        expression = item.calculation;
        justEvaluated = false;
        lastResult = '';
        setStatus('Restored from history');
        updateDisplay();
        toggleHistory(false);
    });

    clearHistoryButton.addEventListener('click', () => saveHistory([]));
    historyToggle.addEventListener('click', () => toggleHistory());
    copyButton.addEventListener('click', copyResult);

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
        else if (event.key.toLowerCase() === 'h') toggleHistory();
    });

    themeToggle.addEventListener('click', () => {
        const dark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('calculator-theme', dark ? 'dark' : 'light');
        themeToggle.textContent = dark ? '☀' : '☾';
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });

    if (localStorage.getItem('calculator-theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.textContent = '☀';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }

    renderHistory();
    updateDisplay();
})();
