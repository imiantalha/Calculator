# Phase 6 — Quality, Performance & Accessibility

## Quality baseline

Phase 6 focuses on production hardening rather than adding calculator features.

### Accessibility

- Added a keyboard-accessible skip link to the calculator.
- Calculator results use a live output region.
- Status/error feedback uses a polite status region.
- Existing controls retain explicit labels and visible `:focus-visible` states.
- Reduced-motion users are respected through `prefers-reduced-motion`.
- Creator links open with `noopener noreferrer`.

### PWA

- Added a branded SVG application icon.
- Added the icon to the web manifest.
- Added the icon to the application shell cache.
- Service-worker cache version is bumped to invalidate the previous shell.
- Only successful network responses are written to the cache.

### Regression testing

Added a dedicated parser regression suite covering:

- Nested parentheses and precedence
- Right-associative exponentiation
- Square root
- Factorial
- Degree-based sine
- Natural logarithm with Euler's constant

The tests intentionally exercise the public calculator controls rather than private parser implementation details. This keeps the suite aligned with user-visible behavior.

## Performance guidance

The runtime remains dependency-free. CSS and JavaScript are loaded as static assets and the application has no runtime API calls. The service worker caches the application shell after first installation.

For deployment, enable HTTP compression and long-lived immutable caching for versioned static assets at the web-server/CDN layer.

## Security baseline

- Calculator expressions are parsed instead of executed as JavaScript.
- Local history and memory remain client-side.
- Profile values rendered by PHP are escaped.
- External creator links use `noopener noreferrer`.
- A restrictive referrer policy is supplied via the document metadata.
- `security.txt` and the repository security policy provide a vulnerability-reporting path.

## Manual release checklist

Before production deployment:

1. Run `npm test`.
2. Verify the app over HTTPS.
3. Verify service-worker installation in a private browser session.
4. Test offline reload after the first successful visit.
5. Test keyboard-only navigation.
6. Test at 320px and 390px viewport widths.
7. Test light/dark mode and reduced-motion preference.
8. Verify all creator links.
9. Replace the relative sitemap location with the final canonical production URL.
10. Run Lighthouse and address environment-specific hosting recommendations.

## Known limitations

- The project does not bundle a full automated WCAG/axe audit yet.
- SVG is used for the PWA icon; if a platform requires raster icons, add 192px and 512px PNG variants.
- Lighthouse scores depend on the hosting environment and cannot be meaningfully guaranteed from the repository alone.
