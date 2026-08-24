# imiantalha Calculator

A modern, responsive and privacy-friendly scientific calculator built with PHP and vanilla JavaScript. The project is designed as a real product rather than a demo: it includes a safe expression parser, scientific mode, local history and memory, accessibility improvements, automated browser tests, CI, PWA support and a professional branded icon.

## ✨ Features

- Basic arithmetic with correct operator precedence
- Scientific mode with parentheses, powers, roots, trigonometry, logarithms, factorials and constants
- DEG/RAD angle modes
- Scientific precision normalization (`sin(180°)` and `cos(90°)` display `0`)
- Clear domain errors for invalid mathematical operations
- Standard percentage semantics (`200 + 10% = 220`)
- Calculation history (up to 30 local entries)
- Memory: `MC`, `MR`, `M+`, `M−`, `MS`
- Copy result to clipboard
- Light/dark theme
- Responsive mobile and desktop UI
- Keyboard shortcuts
- Keyboard-accessible skip link, focus states and live results
- Reduced-motion support
- No `eval()` or arbitrary code execution
- Playwright regression tests and GitHub Actions CI
- Web App Manifest and service worker for installable/offline-capable use
- Professional SVG application icon used in the header, browser tab and PWA manifest
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

For PWA functionality, serve production over HTTPS. `localhost` is treated as a secure context for development.

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

The suite covers arithmetic, parser precedence, scientific functions, precision normalization, percentage behavior, validation, keyboard controls, history, memory, clipboard, theme persistence and other product flows.

## 🔬 Calculation Engine

The expression engine uses explicit recursive-descent parsing. User expressions are never executed as JavaScript.

See [`docs/CALCULATION_ENGINE.md`](docs/CALCULATION_ENGINE.md) for the complete grammar behavior, operator precedence, percentage semantics, validation rules, precision policy and security boundary.

Examples:

```text
2 × (3 + 4) = 14
2 ^ 3 ^ 2 = 512
sqrt(16) = 4
5! = 120
sin(90) = 1        # DEG mode
ln(e) = 1
log(100) = 2
200 + 10% = 220
```

## ♿ Quality & Accessibility

The quality baseline is documented in [`docs/QUALITY.md`](docs/QUALITY.md). It includes keyboard navigation, live result/status regions, visible focus indicators, reduced-motion support, safer external links, PWA hardening and scientific parser regression coverage.

Repository improvements should not be confused with formal WCAG certification. Run a real accessibility audit against the deployed build before making compliance claims.

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
- History and memory remain in browser storage
- No calculator data is sent to a backend
- Dynamic history content is rendered safely with DOM APIs
- PHP profile values are HTML-escaped
- External profile links use `noopener noreferrer`

## 📱 PWA / Offline Architecture

- `manifest.webmanifest` — app identity, display mode, theme and icon metadata
- `icons/calculator-logo.svg` — professional application icon
- `sw.js` — versioned service worker with application-shell caching and offline fallback
- Service-worker registration from `index.php`

The service worker removes old cache versions during activation and only caches successful network responses. Production PWA installation requires HTTPS.

## 🔎 SEO & Social Metadata

The page includes a descriptive title, meta description, author metadata, referrer policy, theme color, Open Graph/Twitter metadata, `robots.txt` and `sitemap.xml`.

The sitemap remains portable by using a relative root. Replace it with the deployed canonical absolute URL before production release.

## 👨‍💻 Creator

**Muhammad Talha — Software Engineer**

- Portfolio: https://imiantalha.vercel.app/
- GitHub: https://github.com/imiantalha
- Fiverr: https://www.fiverr.com/imiantalha
- Upwork: https://www.upwork.com/freelancers/~0129afd82850749f05?viewMode=1
- LinkedIn: https://www.linkedin.com/in/imiantalha

These links are configured centrally in `index.php` and rendered on the calculator front page.

## 📦 Production Release

See [`docs/RELEASE.md`](docs/RELEASE.md) for the deployment checklist, hosting requirements, production smoke tests, Lighthouse/accessibility verification and release process.

The repository intentionally does not claim a production deployment URL, Lighthouse score or WCAG certification until those checks have been performed against a real deployed build.

## 📁 Project Structure

```text
Calculator/
├── index.php
├── app.js
├── style.css
├── manifest.webmanifest
├── sw.js
├── icons/calculator-logo.svg
├── robots.txt
├── sitemap.xml
├── docs/
│   ├── QUALITY.md
│   ├── CALCULATION_ENGINE.md
│   └── RELEASE.md
├── tests/
│   ├── calculator.test.js
│   └── parser.test.js
├── playwright.config.js
├── package.json
├── .github/workflows/tests.yml
└── README.md
```

## 📄 License

This project currently does not declare a software license. Add an appropriate license if you intend to explicitly grant reuse rights.
