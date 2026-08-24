import { test, expect } from '@playwright/test';

async function press(page, values) {
    for (const value of values) {
        await page.locator(`[data-value="${value}"]`).click();
    }
}

test.describe('expression engine regression coverage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-mode-toggle]').click();
    });

    test('respects nested parentheses and precedence', async ({ page }) => {
        await press(page, ['2', '×', '(', '3', '+', '4', ')']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('14');
    });

    test('evaluates exponentiation right-to-left', async ({ page }) => {
        await press(page, ['2', '^', '3', '^', '2']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('512');
    });

    test('evaluates square root', async ({ page }) => {
        await press(page, ['sqrt(', '1', '6', ')']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('4');
    });

    test('evaluates factorial', async ({ page }) => {
        await press(page, ['5']);
        await page.locator('[data-action="factorial"]').click();
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('120');
    });

    test('evaluates sine in degrees', async ({ page }) => {
        await press(page, ['sin(', '9', '0', ')']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('1');
    });

    test('evaluates ln with Euler constant', async ({ page }) => {
        await press(page, ['ln(', 'e', ')']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('1');
    });
});
