(() => {
    'use strict';

    const $ = (selector) => document.querySelector(selector);
    const display = $('[data-display]');
    const expressionDisplay = $('[data-expression]');
    const status = $('[data-status]');
    const keys = $('[data-keypad]');
    const scientificKeys = $('[data-scientific-keypad]');
    const scientificTools = $('[data-scientific-tools]');
    const modeToggle = $('[data-mode-toggle]');
    const angleToggle = $('[data-angle-toggle]');
    const themeToggle = $('[data-theme-toggle]');
    const historyToggle = $('[data-history-toggle]');
    const historyPanel = $('[data-history-panel]');
    const historyList = $('[data-history-list]');
    const clearHistoryButton = $('[data-clear-history]');
    const copyButton = $('[data-copy-result]');
    const memoryBar = $('.memory-bar');

    let expression = '';
    let justEvaluated = false;
    let lastResult = '';
    let scientific = localStorage.getItem('calculator-mode') === 'scientific';
    let degrees = localStorage.getItem('calculator-angle') !== 'rad';
    let memory = Number.parseFloat(localStorage.getItem('calculator-memory') || '0') || 0;

    const HISTORY_KEY = 'calculator-history';
    const operators = ['+', '-', '×', '÷', '^'];
    const functions = ['sin', 'cos', 'tan', 'sqrt', 'ln', 'log'];
    const MAX_HISTORY = 30;
    const EPSILON = 1e-12;

    const isOperator = (value) => operators.includes(value);
    const isFunction = (value) => functions.includes(value);
    const isDigit = (value) => /^\d$/.test(value);

    function setStatus(message = '') {
        status.textContent = message;
        status.hidden = !message;
    }

    function updateDisplay() {
        const value = expression || '0';
        expressionDisplay.textContent = value;
        display.textContent = value;
        display.setAttribute('aria-label', `Calculator display: ${value}`);
    }

    function persistMemory() { localStorage.setItem('calculator-memory', String(memory)); }

    function getHistory() {
        try {
            const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((item) => item && typeof item.calculation === 'string' && typeof item.result === 'string').slice(0, MAX_HISTORY);
        } catch (_) { return []; }
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
        return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderHistory() {
        historyList.replaceChildren();
        const history = getHistory();
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
        const open = typeof force === 'boolean' ? force : historyPanel.hidden;
        historyPanel.hidden = !open;
        historyToggle.setAttribute('aria-expanded', String(open));
        if (open) renderHistory();
    }

    function setMode(value) {
        scientific = value;
        localStorage.setItem('calculator-mode', scientific ? 'scientific' : 'basic');
        scientificKeys.hidden = !scientific;
        scientificTools.hidden = !scientific;
        modeToggle.textContent = scientific ? 'BASIC' : 'SCI';
        modeToggle.setAttribute('aria-label', scientific ? 'Switch to basic calculator' : 'Switch to scientific calculator');
        if (!scientific && /[a-z]|π|\^|[()!]/.test(expression)) clearCalculator();
    }

    function setAngle(value) {
        degrees = value;
        localStorage.setItem('calculator-angle', degrees ? 'deg' : 'rad');
        angleToggle.textContent = degrees ? 'DEG' : 'RAD';
        angleToggle.setAttribute('aria-label', degrees ? 'Switch to radians' : 'Switch to degrees');
    }

    function clearCalculator() {
        expression = '';
        justEvaluated = false;
        lastResult = '';
        setStatus();
        updateDisplay();
    }

    function currentNumber() {
        const match = expression.match(/(?:^|[+\-×÷^(])(-?(?:\d+\.?\d*|\.\d*))$/);
        return match ? match[1] : '';
    }

    function resetAfterEvaluation() {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
            lastResult = '';
        }
    }

    function appendNumber(value) {
        resetAfterEvaluation();
        const number = currentNumber();
        if (value === '.' && number.includes('.')) return;
        if (value === '.' && (!number || number === '-')) expression += '0.';
        else if (number === '0' && value !== '.') expression = expression.slice(0, -1) + value;
        else expression += value;
        setStatus();
        updateDisplay();
    }

    function appendValue(value) {
        resetAfterEvaluation();
        if (isFunction(value)) expression += `${value}(`;
        else expression += value;
        setStatus();
        updateDisplay();
    }

    function appendOperator(operator) {
        if (!expression) {
            if (operator === '-') expression = '-';
            updateDisplay();
            return;
        }
        const last = expression.slice(-1);
        if (operator === '-' && isOperator(last)) {
            if (last !== '-') expression += '-';
            else expression = expression.slice(0, -1);
            updateDisplay();
            return;
        }
        if (last === '-' && isOperator(expression.slice(-2, -1))) expression = expression.slice(0, -2) + operator;
        else if (isOperator(last)) expression = expression.slice(0, -1) + operator;
        else if (last !== '(') expression += operator;
        justEvaluated = false;
        lastResult = '';
        setStatus();
        updateDisplay();
    }

    function backspace() {
        if (justEvaluated) return clearCalculator();
        for (const fn of functions) {
            if (expression.endsWith(`${fn}(`)) expression = expression.slice(0, -fn.length - 1);
        }
        if (!functions.some((fn) => expression.endsWith(`${fn}(`))) expression = expression.slice(0, -1);
        setStatus();
        updateDisplay();
    }

    function toggleSign() {
        const number = currentNumber();
        if (!expression) expression = '-';
        else if (number) {
            const start = expression.length - number.length;
            expression = number.startsWith('-') ? expression.slice(0, start) + number.slice(1) : expression.slice(0, start) + '-' + number;
        }
        setStatus();
        updateDisplay();
    }

    function factorial(n) {
        if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error('Factorial requires an integer from 0 to 170.');
        let result = 1;
        for (let i = 2; i <= n; i += 1) result *= i;
        return result;
    }

    function snap(value) {
        if (Math.abs(value) < EPSILON) return 0;
        const nearestInteger = Math.round(value);
        return Math.abs(value - nearestInteger) < EPSILON ? nearestInteger : value;
    }

    function tokenize(input) {
        const tokens = [];
        let i = 0;
        while (i < input.length) {
            const char = input[i];
            if (/\s/.test(char)) { i += 1; continue; }
            if (/\d|\./.test(char)) {
                const start = i;
                let dots = 0;
                while (i < input.length && /\d|\./.test(input[i])) { if (input[i] === '.') dots += 1; i += 1; }
                if (dots > 1) throw new Error('Invalid decimal number.');
                const raw = input.slice(start, i);
                if (raw === '.') throw new Error('Invalid decimal number.');
                const value = Number(raw);
                if (!Number.isFinite(value)) throw new Error('Invalid number.');
                tokens.push({ type: 'number', value });
                continue;
            }
            const fn = functions.find((name) => input.startsWith(name, i));
            if (fn) { tokens.push({ type: 'function', value: fn }); i += fn.length; continue; }
            if (char === 'π' || char === 'e') tokens.push({ type: 'constant', value: char });
            else if (operators.includes(char)) tokens.push({ type: 'operator', value: char });
            else if (['(', ')', '!'].includes(char)) tokens.push({ type: char, value: char });
            else throw new Error('Invalid expression.');
            i += 1;
        }
        return tokens;
    }

    function calculate(input) {
        const tokens = tokenize(input);
        if (!tokens.length) throw new Error('Complete the expression first.');
        let position = 0;
        const peek = () => tokens[position];
        const take = () => tokens[position++];

        const parseExpression = () => {
            let value = parseTerm();
            while (peek()?.type === 'operator' && ['+', '-'].includes(peek().value)) {
                const op = take().value;
                const right = parseTerm();
                value = op === '+' ? value + right : value - right;
            }
            return value;
        };
        const parseTerm = () => {
            let value = parsePower();
            while (peek()?.type === 'operator' && ['×', '÷'].includes(peek().value)) {
                const op = take().value;
                const right = parsePower();
                if (op === '÷' && right === 0) throw new Error('Cannot divide by zero.');
                value = op === '×' ? value * right : value / right;
            }
            return value;
        };
        const parsePower = () => {
            let value = parseUnary();
            if (peek()?.type === 'operator' && peek().value === '^') { take(); value = value ** parsePower(); }
            return value;
        };
        const parseUnary = () => {
            if (peek()?.type === 'operator' && peek().value === '+') { take(); return parseUnary(); }
            if (peek()?.type === 'operator' && peek().value === '-') { take(); return -parseUnary(); }
            return parsePostfix();
        };
        const parsePostfix = () => {
            let value = parsePrimary();
            while (peek()?.type === '!') { take(); value = factorial(value); }
            return value;
        };
        const parsePrimary = () => {
            const token = take();
            if (!token) throw new Error('Complete the expression first.');
            if (token.type === 'number') return token.value;
            if (token.type === 'constant') return token.value === 'π' ? Math.PI : Math.E;
            if (token.type === '(') {
                if (peek()?.type === ')') throw new Error('Empty parentheses are not allowed.');
                const value = parseExpression();
                if (take()?.type !== ')') throw new Error('Missing closing parenthesis.');
                return value;
            }
            if (token.type === 'function') {
                if (take()?.type !== '(') throw new Error(`Use ${token.value}(...)`);
                if (peek()?.type === ')') throw new Error('Function argument is required.');
                const argument = parseExpression();
                if (take()?.type !== ')') throw new Error('Missing closing parenthesis.');
                return applyFunction(token.value, argument);
            }
            throw new Error('Invalid expression.');
        };

        const result = parseExpression();
        if (position !== tokens.length) throw new Error('Invalid expression.');
        if (!Number.isFinite(result)) throw new Error('Result is outside the supported range.');
        const normalized = Number.parseFloat(result.toPrecision(12));
        return Object.is(normalized, -0) ? 0 : normalized;
    }

    function applyFunction(name, value) {
        const angle = degrees ? value * Math.PI / 180 : value;
        switch (name) {
            case 'sin': return snap(Math.sin(angle));
            case 'cos': return snap(Math.cos(angle));
            case 'tan': if (Math.abs(Math.cos(angle)) < EPSILON) throw new Error('Tangent is undefined at this angle.'); return snap(Math.tan(angle));
            case 'sqrt': if (value < 0) throw new Error('Square root requires a non-negative value.'); return snap(Math.sqrt(value));
            case 'ln': if (value <= 0) throw new Error('Natural log requires a positive value.'); return snap(Math.log(value));
            case 'log': if (value <= 0) throw new Error('Log requires a positive value.'); return snap(Math.log10(value));
            default: throw new Error('Unknown function.');
        }
    }

    function evaluate() {
        if (!expression || expression === '-') return;
        try {
            const calculation = expression;
            const resultText = String(calculate(expression));
            expressionDisplay.textContent = calculation;
            expression = resultText;
            display.textContent = resultText;
            display.setAttribute('aria-label', `Calculator result: ${resultText}`);
            justEvaluated = true;
            lastResult = resultText;
            setStatus('Result');
            addHistory(calculation, resultText);
        } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to calculate expression.'); }
    }

    function applyPercentage() {
        const number = currentNumber();
        if (!number) return;
        const start = expression.length - number.length;
        const prefix = expression.slice(0, start);
        const previous = prefix.slice(-1);
        const leftMatch = prefix.match(/(?:^|[+\-×÷^])(-?(?:\d+\.?\d*|\.\d+))$/);
        let percentage = Number(number) / 100;
        if (leftMatch && (previous === '+' || previous === '-')) percentage = Number(leftMatch[1]) * percentage;
        expression = prefix + String(percentage);
        setStatus();
        updateDisplay();
    }

    function currentNumericValue() {
        const source = justEvaluated && lastResult ? lastResult : currentNumber();
        const value = Number(source);
        return Number.isFinite(value) ? value : null;
    }

    function memoryAction(action) {
        const value = currentNumericValue();
        switch (action) {
            case 'clear': memory = 0; persistMemory(); setStatus('Memory cleared'); break;
            case 'recall': expression = String(memory); justEvaluated = false; lastResult = ''; setStatus('Memory recalled'); updateDisplay(); break;
            case 'store': if (value !== null) { memory = value; persistMemory(); setStatus('Stored in memory'); } else setStatus('Enter a number first.'); break;
            case 'add': if (value !== null) { memory += value; persistMemory(); setStatus('Added to memory'); } else setStatus('Enter a number first.'); break;
            case 'subtract': if (value !== null) { memory -= value; persistMemory(); setStatus('Subtracted from memory'); } else setStatus('Enter a number first.'); break;
        }
    }

    async function copyResult() {
        try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(display.textContent || '0');
            setStatus('Result copied');
        } catch (_) { setStatus('Unable to copy result.'); }
    }

    keys.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        const value = button.dataset.value;
        const action = button.dataset.action;
        if (value && isDigit(value)) appendNumber(value);
        else if (value === '.') appendNumber(value);
        else if (value && isOperator(value)) appendOperator(value);
        else if (value) appendValue(value);
        else if (action === 'factorial') appendValue('!');
        else if (action === 'clear') clearCalculator();
        else if (action === 'backspace') backspace();
        else if (action === 'equals') evaluate();
        else if (action === 'sign') toggleSign();
        else if (action === 'percent') applyPercentage();
    });

    scientificKeys.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.value) appendValue(button.dataset.value);
        else if (button.dataset.action === 'factorial') appendValue('!');
    });

    memoryBar.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-memory]');
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
        setStatus('History restored');
        updateDisplay();
        toggleHistory(false);
    });

    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        setStatus('History cleared');
    });

    modeToggle.addEventListener('click', () => setMode(!scientific));
    angleToggle.addEventListener('click', () => setAngle(!degrees));
    historyToggle.addEventListener('click', () => toggleHistory());
    copyButton.addEventListener('click', copyResult);

    function setTheme(dark) {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('calculator-theme', dark ? 'dark' : 'light');
        themeToggle.textContent = dark ? '☀' : '☾';
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    themeToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));

    document.addEventListener('keydown', (event) => {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
        const key = event.key;
        if (/^\d$/.test(key)) appendNumber(key);
        else if (key === '.') appendNumber('.');
        else if (['+', '-'].includes(key)) appendOperator(key);
        else if (key === '*') appendOperator('×');
        else if (key === '/') { event.preventDefault(); appendOperator('÷'); }
        else if (key === '^') appendOperator('^');
        else if (key === '%') applyPercentage();
        else if (['(', ')'].includes(key)) appendValue(key);
        else if (key === '!') appendValue('!');
        else if (key === 'Enter' || key === '=') { event.preventDefault(); evaluate(); }
        else if (key === 'Backspace') backspace();
        else if (key === 'Escape') { clearCalculator(); toggleHistory(false); }
        else if (key.toLowerCase() === 'h') toggleHistory();
        else if (key.toLowerCase() === 's') setMode(!scientific);
    });

    setMode(scientific);
    setAngle(degrees);
    setTheme(localStorage.getItem('calculator-theme') === 'dark');
    updateDisplay();
    renderHistory();
})();
