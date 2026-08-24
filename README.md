# Calculator

A modern, responsive calculator built as a lightweight PHP + JavaScript web application. The project started as a simple PHP calculator and has been redesigned with a client-side calculation engine, keyboard support, validation, responsive UI, theme switching, accessibility, automated browser testing, and continuous integration.

## ✨ Features

- Basic arithmetic: addition, subtraction, multiplication and division
- Correct operator precedence (`2 + 3 × 4 = 14`)
- Decimal input with duplicate-decimal protection
- Positive/negative toggle
- Percentage conversion
- Backspace and all-clear controls
- Division-by-zero protection
- Human-readable calculation errors
- Keyboard support
- Responsive mobile and desktop layout
- Light/dark theme with persisted preference
- Accessible labels, focus states and live result updates
- No `eval()` or unsafe expression execution
- Automated Playwright end-to-end regression tests
- GitHub Actions CI on pushes and pull requests to `main`
- Creator attribution and professional profile links

## 🛠️ Tech Stack

- PHP 8+
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Node.js for development/test tooling
- Playwright for end-to-end testing
- GitHub Actions for CI
- Browser `localStorage` for theme preference

The application itself has no runtime framework dependency or frontend build step.

## 🚀 Run Locally

1. Clone the repository:

```bash
git clone https://github.com/imiantalha/Calculator.git
cd Calculator
```

2. Start PHP's built-in server:

```bash
php -S 127.0.0.1:8000
```

3. Open `http://127.0.0.1:8000` in your browser.

## 🧪 Automated Testing

Phase 2 adds browser-level regression coverage with Playwright.

Install Node dependencies:

```bash
npm install
```

Install the Chromium browser used by the tests:

```bash
npx playwright install chromium
```

Run the test suite:

```bash
npm test
```

Run tests with Playwright's interactive UI:

```bash
npm run test:ui
```

Show the last HTML test report:

```bash
npm run test:report
```

The suite covers arithmetic, operator precedence, multiplication/division ordering, division by zero, decimal protection, floating-point normalization, negative numbers, percentage, operator replacement, incomplete expressions, backspace, clear, keyboard controls, and theme persistence.

## 🔄 Continuous Integration

GitHub Actions runs the Playwright suite for pushes to `main` and pull requests targeting `main`.

The workflow installs PHP 8.3, Node.js 22, the project test dependency, Chromium and its Linux dependencies, then starts PHP's built-in server and executes the browser regression suite.

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0-9` | Enter number |
| `.` | Decimal point |
| `+` / `-` | Add / subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete last character |
| `Esc` | Clear |

## 🧮 Calculation Model

The calculator does not use `eval()`. Expressions are tokenized and evaluated using operator precedence, so multiplication and division are evaluated before addition and subtraction.

For example:

```text
2 + 3 × 4
      ↓
2 + 12
      ↓
14
```

Results are normalized to avoid common floating-point display artifacts while retaining useful decimal precision.

## 🔐 Security & Reliability

The application intentionally avoids executing user input as code. The calculator engine validates tokens, rejects malformed expressions, prevents division by zero, and checks that calculated values remain finite.

The PHP front end also escapes creator/profile values before rendering them into HTML.

Automated regression tests protect calculation and UI behavior as the project evolves.

## 📁 Project Structure

```text
Calculator/
├── index.php                    # Application shell and calculator markup
├── app.js                       # Calculator state, parser and interactions
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

- Calculation history
- Memory functions (`MC`, `MR`, `M+`, `M-`)
- Copy result button
- Scientific operations
- Additional accessibility audits
- Broader browser/device matrix

## 📄 License

This project currently does not declare a software license. If you intend to make the source explicitly reusable by others, add an appropriate license file.
