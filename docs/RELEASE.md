# Production Release Guide

## Current release

**Version:** 7.0.0

## Pre-release checklist

- [ ] Run the Playwright suite with `npm test`.
- [ ] Verify PHP 8+ is available on the hosting environment.
- [ ] Serve the app over HTTPS.
- [ ] Verify `/manifest.webmanifest` and `/sw.js` return `200`.
- [ ] Verify the service worker registers without console errors.
- [ ] Verify calculator history and memory remain local to the browser.
- [ ] Test basic and scientific modes on a real mobile device.
- [ ] Test keyboard controls on desktop.
- [ ] Test DEG/RAD behavior and invalid scientific expressions.
- [ ] Run Lighthouse against the deployed URL.
- [ ] Check accessibility and color contrast with browser accessibility tooling.
- [ ] Confirm all creator links resolve to the intended profiles.
- [ ] Replace the portable sitemap URL with the canonical production URL.

## Hosting requirements

The calculator is a static-style PHP application and does not require a database. Any PHP 8+ host that supports normal web serving can run it.

For PWA functionality, use HTTPS in production. `localhost` is also treated as a secure context for development.

## Release process

1. Merge reviewed changes into `main`.
2. Run the automated test suite.
3. Deploy `main` to the production host.
4. Open the deployed URL in a clean browser profile.
5. Verify install/offline behavior.
6. Run Lighthouse and browser accessibility checks.
7. Smoke-test creator links and social metadata.
8. Tag the release in GitHub after production verification.

## Production limitations

This repository does not include a hosting-provider-specific deployment configuration because the project can run on many PHP hosts. Do not claim a production deployment URL until the application has actually been deployed and verified.

## Portfolio presentation

When presenting the project publicly, describe it as a privacy-friendly scientific calculator with a safe expression parser, local history/memory, PWA support, automated testing and CI. Avoid claiming measured Lighthouse scores or formal WCAG conformance unless those have been independently verified against the deployed build.
