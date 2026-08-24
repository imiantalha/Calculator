import { test, expect } from '@playwright/test';

async function press(page, values) {
    for (const value of values) await page.locator(`[data-value="${value}"]`).click();
}

async function calculate(page, values) {
    await press(page, values);
    await page.locator('[data-action="equals"]').click();
}

test.describe('expression engine regression coverage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.locator('[data-mode-toggle]').click();
    });

    test('respects nested parentheses and precedence', async ({ page }) => {
        await calculate(page, ['2', '×', '(', '3', '+', '4', ')']);
        await expect(page.locator('[data-display]')).toHaveText('14');
    });

    test('evaluates exponentiation right-to-left', async ({ page }) => {
        await calculate(page, ['2', '^', '3', '^', '2']);
        await expect(page.locator('[data-display]')).toHaveText('512');
    });

    test('normalizes trigonometric floating-point artifacts', async ({ page }) => {
        await calculate(page, ['sin(', '1', '8', '0', ')']);
        await expect(page.locator('[data-display]')).toHaveText('0');
        await calculate(page, ['cos(', '9', '0', ')']);
        await expect(page.locator('[data-display]')).toHaveText('0');
    });

    test('detects tangent singularities', async ({ page }) => {
        await calculate(page, ['tan(', '9', '0', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Tangent is undefined at this angle.');
    });

    test('supports DEG and RAD calculations', async ({ page }) => {
        await calculate(page, ['sin(', '9', '0', ')']);
        await expect(page.locator('[data-display]')).toHaveText('1');
        await page.locator('[data-angle-toggle]').click();
        await calculate(page, ['sin(', 'π', '÷', '2', ')']);
        await expect(page.locator('[data-display]')).toHaveText('1');
    });

    test('supports standard percentage semantics for addition', async ({ page }) => {
        await press(page, ['2', '0', '0', '+', '1', '0']);
        await page.locator('[data-action="percent"]').click();
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('220');
    });

    test('supports percentage as a fraction', async ({ page }) => {
        await press(page, ['5', '0']);
        await page.locator('[data-action="percent"]').click();
        await expect(page.locator('[data-display]')).toHaveText('0.5');
    });

    test('rejects empty parentheses', async ({ page }) => {
        await calculate(page, ['(', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Empty parentheses are not allowed.');
    });

    test('rejects empty function arguments', async ({ page }) => {
        await calculate(page, ['sqrt(', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Function argument is required.');
    });

    test('rejects natural log of zero', async ({ page }) => {
        await calculate(page, ['ln(', '0', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Natural log requires a positive value.');
    });

    test('rejects log of negative values', async ({ page }) => {
        await calculate(page, ['log(', '-', '1', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Log requires a positive value.');
    });

    test('rejects non-integer factorials', async ({ page }) => {
        await calculate(page, ['2', '.', '5', '!']);
        await expect(page.locator('[data-status]')).toHaveText('Factorial requires an integer from 0 to 170.');
    });

    test('rejects negative square roots', async ({ page }) => {
        await calculate(page, ['sqrt(', '-', '1', ')']);
        await expect(page.locator('[data-status]')).toHaveText('Square root requires a non-negative value.');
    });

    test('rejects missing closing parentheses', async ({ page }) => {
        await press(page, ['sqrt(', '1', '6']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-status]')).toHaveText('Missing closing parenthesis.');
    });
});
