import { test, expect } from '@playwright/test';

// Parser regression matrix. These cases are exercised through the public UI so
// the tests verify both parsing and presentation without coupling to internals.
test.describe('expression engine edge cases', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-mode-toggle]').click();
    });

    const cases = [
        ['2 + 3 × 4', '14'],
        ['2 × (3 + 4)', '14'],
        ['2 ^ 3 ^ 2', '512'],
        ['sqrt(16)', '4'],
        ['5!', '120'],
        ['sin(90)', '1'],
        ['cos(0)', '1'],
        ['ln(e)', '1'],
        ['log(100)', '2'],
    ];

    for (const [expression, expected] of cases) {
        test(`${expression} = ${expected}`, async ({ page }) => {
            await page.locator('[data-expression-input]').fill(expression);
            await page.locator('[data-action="equals"]').click();
            await expect(page.locator('[data-display]')).toHaveText(expected);
        });
    }
});
