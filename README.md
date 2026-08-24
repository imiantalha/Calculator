# Calculator

A modern, responsive calculator built as a lightweight PHP + JavaScript web application. The project started as a simple PHP calculator and has evolved into a product-style experience with a safe client-side expression parser, scientific mode, keyboard support, validation, history, memory functions, clipboard support, responsive UI, themes, accessibility, automated testing, and continuous integration.

## ✨ Features

### Basic mode
- Addition, subtraction, multiplication and division
- Correct operator precedence
- Decimal input and validation
- Positive/negative toggle
- Percentage conversion
- Backspace and all-clear
- Division-by-zero protection

### Scientific mode
- Parentheses and nested expressions
- Exponentiation (`^`)
- Square root (`sqrt`)
- Sine, cosine and tangent
- Natural logarithm (`ln`)
- Base-10 logarithm (`log`)
- Factorial (`!`, integers 0–170)
- Constants `π` and `e`
- Degree/radian angle switching
- Scientific mode preference persists locally

### Product features
- Calculation history with up to 30 local entries
- Restore calculations from history
- Clear history
- Calculator memory: `MC`, `MR`, `M+`, `M−`, `MS`
- Persistent memory
- Copy result to clipboard
- Light/dark theme
- Responsive mobile and desktop UI
- Accessible labels, focus states and live results
- Keyboard shortcuts
- No `eval()` or arbitrary code execution
- Playwright regression tests
- GitHub Actions CI

## 🛠️ Tech Stack

- PHP 8+
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Node.js for development/test tooling
- Playwright for end-to-end testing
- GitHub Actions for CI
- Browser `localStorage` for local preferences, history and memory

The application has no runtime framework dependency or frontend build step.

## 🚀 Run Locally

```bash
git clone https://github.com/imiantalha/Calculator.git
cd Calculator
php -S 127.0.0.1:8000
```

Open `http://127.0.0.1:8000` in your browser.

## 🧪 Automated Testing

Install dependencies and Chromium:

```bash
npm install
npx playwright install chromium
```

Run the regression suite:

```bash
npm test
```

Interactive UI mode:

```bash
npm run test:ui
```

Open the latest HTML report:

```bash
npm run test:report
```

The suite covers basic arithmetic, precedence, decimals, errors, keyboard controls, history, memory, clipboard behavior, scientific mode, parentheses, exponentiation, square root, factorial, trigonometry, angle modes and scientific validation.

## 🔄 Continuous Integration

GitHub Actions runs the browser regression suite for pushes to `main` and pull requests targeting `main`.

## 🔬 Scientific Calculator

Scientific mode can be enabled with the **SCI** button or the `S` keyboard shortcut.

Examples:

```text
2 × (3 + 4) = 14
2 ^ 3 = 8
sqrt(9) = 3
5! = 120
sin(90) = 1        # DEG mode
ln(e) = 1
log(100) = 2
```

### Angle modes

- **DEG** — trigonometric input is interpreted as degrees
- **RAD** — trigonometric input is interpreted as radians

The selected mode is persisted in the browser.

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0-9` | Enter number |
| `.` | Decimal point |
| `+` / `-` | Add / subtract |
| `*` | Multiply |
| `/` | Divide |
| `^` | Exponentiation |
| `(` / `)` | Parentheses |
| `!` | Factorial |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete last character |
| `Esc` | Clear |
| `H` | Open/close history |
| `S` | Toggle scientific mode |

## 🧠 Memory Functions

| Button | Action |
| --- | --- |
| `MC` | Clear stored memory |
| `MR` | Recall stored value |
| `M+` | Add current value to memory |
| `M−` | Subtract current value from memory |
| `MS` | Store current value in memory |

Memory is stored only in the browser and is never sent to a backend.

## 🕘 Calculation History

Successful calculations are stored locally, with a maximum of 30 entries. Each entry contains the expression, result and timestamp. Selecting an entry restores its expression. History can be cleared from the History panel.

## 📋 Copy Result

Use **Copy** below the display to copy the current result to the clipboard. The application reports success or failure without sending the value to a backend.

## 🧮 Expression Engine

The calculator does **not** use `eval()`.

Scientific expressions are processed by a recursive-descent parser with explicit grammar stages for:

```text
Expression → addition/subtraction
Term       → multiplication/division
Power      → exponentiation
Unary      → positive/negative values
Postfix    → factorial
Primary    → numbers, constants, parentheses, functions
```

This makes precedence explicit and keeps arbitrary JavaScript execution out of the calculation path.

The engine validates malformed expressions, decimal values, function arguments, division by zero, invalid logarithms, invalid square roots, undefined tangent angles, factorial bounds and non-finite results.

## 🔐 Security & Privacy

- No `eval()` or dynamic code execution
- Input is tokenized and parsed explicitly
- Stored history is rendered with DOM text nodes rather than HTML injection
- Local history and memory never leave the browser
- PHP profile values are HTML-escaped before rendering

## 📁 Project Structure

```text
Calculator/
├── index.php                    # Application shell and calculator markup
├── app.js                       # State, expression parser and interactions
├── style.css                    # Responsive product UI and themes
├── tests/
│   └── calculator.test.js       # Playwright end-to-end regression tests
├── playwright.config.js         # Test runner and PHP web-server configuration
├── package.json                 # Test tooling and npm scripts
├── .github/workflows/tests.yml  # Continuous integration workflow
└── README.md                    # Project documentation
```

## 👨‍💻 Created By

**Muhammad Talha** — Software Engineer

- GitHub: https://github.com/imiantalha
- Portfolio: add your portfolio URL in `index.php`
- Fiverr: add your Fiverr profile URL in `index.php`
- Upwork: add your Upwork profile URL in `index.php`

The profile links are intentionally configured in one place so they can be updated without touching the calculator UI.

## 📌 Development Roadmap

Potential future improvements:

- Advanced accessibility audit and screen-reader testing
- Broader browser/device matrix
- Optional installable PWA experience
- Unit-level parser tests in addition to browser tests
- Optional configurable precision/display formatting

## 📄 License

This project currently does not declare a software license. If you intend to make the source explicitly reusable by others, add an appropriate license file.
