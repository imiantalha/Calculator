# Calculator

A modern, responsive and privacy-friendly scientific calculator built with PHP and vanilla JavaScript. The project has evolved from a simple PHP calculator into a production-style web app with a safe expression parser, scientific mode, history, memory, keyboard support, accessibility improvements, automated browser tests, CI and offline/PWA foundations.

## ✨ Features

- Basic arithmetic with correct operator precedence
- Scientific mode with parentheses, powers, roots, trig, logarithms, factorials and constants
- DEG/RAD angle modes
- Calculation history (up to 30 local entries)
- Memory: `MC`, `MR`, `M+`, `M−`, `MS`
- Copy result to clipboard
- Light/dark theme
- Responsive mobile and desktop UI
- Keyboard shortcuts
- Accessible labels, focus states and live results
- No `eval()` or arbitrary code execution
- Playwright regression tests and GitHub Actions CI
- Web App Manifest and service worker for installable/offline-capable use
- SEO/social metadata and crawler policy
- Creator links displayed directly in the product

## 🛠️ Tech Stack

- PHP 8+
- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- Node.js + Playwright for testing
- GitHub Actions for CI
- Browser `localStorage` for local preferences, history and memory
- Service Worker + Web App Manifest for PWA capabilities

There is no runtime frontend framework or build step.

## 🚀 Run Locally

```bash
git clone https://github.com/imiantalha/Calculator.git
cd Calculator
php -S 127.0.0.1:8000
```

Open `http://127.0.0.1:8000`.

### PWA / offline note

Service workers require a secure context in normal browsers. `localhost` is treated as secure for development. For a deployed installation, serve the app over HTTPS.

## 🧪 Testing

```bash
npm install
npx playwright install chromium
npm test
```

Optional:

```bash
npm run test:ui
npm run test:report
```

The browser suite covers arithmetic, parser precedence, scientific functions, errors, keyboard controls, history, memory, clipboard, theme persistence and other product flows.

## 🔬 Scientific Mode

Scientific mode supports:

```text
2 × (3 + 4) = 14
2 ^ 3 = 8
sqrt(9) = 3
5! = 120
sin(90) = 1        # DEG mode
ln(e) = 1
log(100) = 2
```

The expression engine uses explicit recursive-descent parsing. User expressions are never executed as JavaScript.

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0-9` | Enter number |
| `.` | Decimal |
| `+` / `-` | Add / subtract |
| `*` / `/` | Multiply / divide |
| `^` | Power |
| `(` / `)` | Parentheses |
| `!` | Factorial |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete |
| `Esc` | Clear |
| `H` | History |
| `S` | Scientific mode |

## 🔐 Security & Privacy

- No `eval()` or dynamic code execution
- Expressions are tokenized and parsed explicitly
- History and memory remain in the browser's local storage
- No calculator data is sent to a backend
- Dynamic history content is rendered safely with DOM APIs
- PHP profile values are HTML-escaped

## 📱 PWA / Offline Architecture

The app includes:

- `manifest.webmanifest` — app identity, display mode and theme metadata
- `sw.js` — cache-first fallback strategy for the application shell and visited GET resources
- Service-worker registration from `index.php`

The service worker uses a versioned cache and removes old cache versions during activation. Network requests are preferred when available so updated resources can be cached for future offline use.

For production hosting, HTTPS is required for service-worker installation.

## 🔎 SEO & Social Metadata

The page includes:

- Descriptive page title
- Meta description
- Author metadata
- Theme color
- Open Graph title/description/type
- Twitter card metadata
- `robots.txt`
- `sitemap.xml`

The sitemap currently uses a relative root URL so the repository remains portable across hosting environments. If the app is deployed to a canonical domain, replace the sitemap URL with that absolute production URL.

## 👨‍💻 Creator

**Muhammad Talha — Software Engineer**

- Portfolio: https://imiantalha.vercel.app/
- GitHub: https://github.com/imiantalha
- Fiverr: https://www.fiverr.com/imiantalha
- Upwork: https://www.upwork.com/freelancers/~0129afd82850749f05?viewMode=1
- LinkedIn: https://www.linkedin.com/in/imiantalha

These links are configured centrally in `index.php` and are rendered on the calculator front page.

## 📁 Project Structure

```text
Calculator/
├── index.php
├── app.js
├── style.css
├── manifest.webmanifest
├── sw.js
├── robots.txt
├── sitemap.xml
├── tests/
│   └── calculator.test.js
├── playwright.config.js
├── package.json
├── .github/workflows/tests.yml
└── README.md
```

## 📌 Roadmap

Future candidates:

- Expanded accessibility/screen-reader testing
- Broader browser/device matrix
- Unit-level parser tests alongside E2E tests
- Configurable precision/display formatting
- Generated app icons and screenshots for richer PWA installation metadata
- Optional install prompt UX

## 📄 License

This project currently does not declare a software license. Add an appropriate license if you intend to explicitly grant reuse rights.
