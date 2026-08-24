(() => {
    'use strict';

    const display = document.querySelector('[data-display]');
    const expressionDisplay = document.querySelector('[data-expression]');
    const status = document.querySelector('[data-status]');
    const keys = document.querySelector('[data-keypad]');
    const scientificKeys = document.querySelector('[data-scientific-keypad]');
    const scientificTools = document.querySelector('[data-scientific-tools]');
    const modeToggle = document.querySelector('[data-mode-toggle]');
    const angleToggle = document.querySelector('[data-angle-toggle]');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const historyToggle = document.querySelector('[data-history-toggle]');
    const historyPanel = document.querySelector('[data-history-panel]');
    const historyList = document.querySelector('[data-history-list]');
    const clearHistoryButton = document.querySelector('[data-clear-history]');
    const copyButton = document.querySelector('[data-copy-result]');

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

    const isOperator = value => operators.includes(value);
    const isFunction = value => functions.includes(value);

    function setStatus(message = '') {
        status.textContent = message;
        status.hidden = !message;
    }

    function updateDisplay() {
        expressionDisplay.textContent = expression || '0';
        display.textContent = expression || '0';
        display.setAttribute('aria-label', `Calculator display: ${expression || '0'}`);
    }

    function persistMemory() { localStorage.setItem('calculator-memory', String(memory)); }

    function getHistory() {
        try {
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            return Array.isArray(history) ? history : [];
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
        if (!scientific && /[a-z]|π|\^|[()]/.test(expression)) clearCalculator();
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
        const match = expression.match(/(?:^|[+\-×÷^,(])(-?(?:\d+\.?\d*|\.\d*))$/);
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
        if (value === '.' && (!number || number === '-')) expression += '0.';
        else if (number === '0' && value !== '.') expression = expression.slice(0, -1) + value;
        else expression += value;
        setStatus();
        updateDisplay();
    }

    function appendValue(value) {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
            lastResult = '';
        }
        expression += value;
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
            return;
        }
        if (last === '-' && isOperator(expression.slice(-2, -1))) expression = expression.slice(0, -2) + operator;
        else if (isOperator(last)) expression = expression.slice(0, -1) + operator;
        else expression += operator;
        justEvaluated = false;
        lastResult = '';
        setStatus();
        updateDisplay();
    }

    function backspace() {
        if (justEvaluated) return clearCalculator();
        expression = expression.slice(0, -1);
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

    function tokenize(input) {
        const tokens = [];
        let i = 0;
        while (i < input.length) {
            const char = input[i];
            if (/\s/.test(char)) { i += 1; continue; }
            if (/\d|\./.test(char)) {
                const start = i;
                let dots = 0;
                while (i < input.length && /\d|\./.test(input[i])) {
                    if (input[i] === '.') dots += 1;
                    i += 1;
                }
                if (dots > 1) throw new Error('Invalid decimal number.');
                const value = Number(input.slice(start, i));
                if (!Number.isFinite(value)) throw new Error('Invalid number.');
                tokens.push({ type: 'number', value });
                continue;
            }
            if (input.startsWith('sin', i) || input.startsWith('cos', i) || input.startsWith('tan', i) || input.startsWith('sqrt', i) || input.startsWith('log', i) || input.startsWith('ln', i)) {
                const name = functions.find(fn => input.startsWith(fn, i));
                tokens.push({ type: 'function', value: name });
                i += name.length;
                continue;
            }
            if (char === 'π' || char === 'e') tokens.push({ type: 'constant', value: char });
            else if (['+', '-', '×', '÷', '^', '(', ')', '!'].includes(char)) tokens.push({ type: char === '(' || char === ')' || char === '!' ? char : 'operator', value: char });
            else throw new Error('Invalid expression.');
            i += 1;
        }
        return tokens;
    }

    function calculate(input) {
        const tokens = tokenize(input);
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
            if (peek()?.type === 'operator' && peek().value === '^') {
                take();
                value = value ** parsePower();
            }
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
                const value = parseExpression();
                if (take()?.type !== ')') throw new Error('Missing closing parenthesis.');
                return value;
            }
            if (token.type === 'function') {
                if (take()?.type !== '(') throw new Error(`Use ${token.value}(...)`);
                const argument = parseExpression();
                if (take()?.type !== ')') throw new Error('Missing closing parenthesis.');
                return applyFunction(token.value, argument);
            }
            throw new Error('Invalid expression.');
        };

        const result = parseExpression();
        if (position !== tokens.length) throw new Error('Invalid expression.');
        if (!Number.isFinite(result)) throw new Error('Result is outside the supported range.');
        const rounded = Number.parseFloat(result.toPrecision(12));
        return Object.is(rounded, -0) ? 0 : rounded;
    }

    function applyFunction(name, value) {
        const angle = degrees ? value * Math.PI / 180 : value;
        switch (name) {
            case 'sin': return Math.sin(angle);
            case 'cos': return Math.cos(angle);
            case 'tan':
                if (Math.abs(Math.cos(angle)) < 1e-12) throw new Error('Tangent is undefined at this angle.');
                return Math.tan(angle);
            case 'sqrt':
                if (value < 0) throw new Error('Square root requires a non-negative value.');
                return Math.sqrt(value);
            case 'ln':
                if (value <= 0) throw new Error('Natural log requires a positive value.');
                return Math.log(value);
            case 'log':
                if (value <= 0) throw new Error('Log requires a positive value.');
                return Math.log10(value);
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
        } catch (error) { setStatus(error.message); }
    }

    function applyPercentage() {
        const number = currentNumber();
        if (number) {
            expression = expression.slice(0, -number.length) + String(Number(number) / 100);
            updateDisplay();
        }
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
            case 'recall': expression = String(memory); justEvaluated = false; setStatus('Memory recalled'); updateDisplay(); break;
            case 'store': if (value !== null) { memory = value; persistMemory(); setStatus('Stored in memory'); } break;
            case 'add': if (value !== null) { memory += value; persistMemory(); setStatus('Added to memory'); } break;
            case 'subtract': if (value !== null) { memory -= value; persistMemory(); setStatus('Subtracted from memory'); } break;
            default: break;
        }
    }

    async function copyResult() {
        try { await navigator.clipboard.writeText(display.textContent || '0'); setStatus('Result copied'); }
        catch (_) { setStatus('Unable to copy result.'); }
    }

    keys.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        const value = button.dataset.value;
        const action = button.dataset.action;
        if (value && /^\d$/.test(value)) appendNumber(value);
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

    scientificKeys.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.value) appendValue(button.dataset.value);
        else if (button.dataset.action === 'factorial') appendValue('!');
    });

    document.querySelector('.memory-bar').addEventListener('click', event => {
        const button = event.target.closest('[data-memory]');
        if (button) memoryAction(button.dataset.memory);
    });

    historyList.addEventListener('click', event => {
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
    modeToggle.addEventListener('click', () => setMode(!scientific));
    angleToggle.addEventListener('click', () => setAngle(!degrees));

    document.addEventListener('keydown', event => {
        if (/^\d$/.test(event.key)) appendNumber(event.key);
        else if (event.key === '.') appendNumber('.');
        else if (['+', '-'].includes(event.key)) appendOperator(event.key);
        else if (event.key === '*') appendOperator('×');
        else if (event.key === '/') appendOperator('÷');
        else if (event.key === '^') appendOperator('^');
        else if (event.key === '(' || event.key === ')' || event.key === '!') appendValue(event.key);
        else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); evaluate(); }
        else if (event.key === 'Backspace') backspace();
        else if (event.key === 'Escape') clearCalculator();
        else if (event.key.toLowerCase() === 'h') toggleHistory();
        else if (event.key.toLowerCase() === 's') setMode(!scientific);
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

    setMode(scientific);
    setAngle(degrees);
    renderHistory();
    updateDisplay();
})();
