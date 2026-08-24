import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    async function clickKeys(page, keys) {
        for (const key of keys) {
            await page.locator(`[data-value="${key}"]`).click();
        }
    }

    async function calculate(page, keys) {
        await clickKeys(page, keys);
        await page.locator('[data-action="equals"]').click();
    }

    test('adds numbers', async ({ page }) => {
        await calculate(page, ['2', '+', '3']);
        await expect(page.locator('[data-display]')).toHaveText('5');
    });

    test('respects operator precedence', async ({ page }) => {
        await calculate(page, ['2', '+', '3', '×', '4']);
        await expect(page.locator('[data-display]')).toHaveText('14');
    });

    test('handles division', async ({ page }) => {
        await calculate(page, ['2', '0', '÷', '4']);
        await expect(page.locator('[data-display]')).toHaveText('5');
    });

    test('handles mixed multiplication and division left-to-right', async ({ page }) => {
        await calculate(page, ['2', '0', '÷', '5', '×', '2']);
        await expect(page.locator('[data-display]')).toHaveText('8');
    });

    test('prevents division by zero', async ({ page }) => {
        await calculate(page, ['1', '0', '÷', '0']);
        await expect(page.locator('[data-status]')).toHaveText('Cannot divide by zero.');
    });

    test('prevents duplicate decimal points in a number', async ({ page }) => {
        await clickKeys(page, ['1', '.', '2']);
        await page.locator('[data-value="."]').click();
        await expect(page.locator('[data-display]')).toHaveText('1.2');
    });

    test('normalizes common floating-point artifacts', async ({ page }) => {
        await calculate(page, ['0', '.', '1', '+', '0', '.', '2']);
        await expect(page.locator('[data-display]')).toHaveText('0.3');
    });

    test('supports negative numbers', async ({ page }) => {
        await page.locator('[data-action="sign"]').click();
        await page.locator('[data-value="5"]').click();
        await page.locator('[data-value="+"]').click();
        await page.locator('[data-value="8"]').click();
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('3');
    });

    test('supports a negative number after an operator', async ({ page }) => {
        await calculate(page, ['5', '×', '-', '3']);
        await expect(page.locator('[data-display]')).toHaveText('-15');
    });

    test('supports percentage conversion', async ({ page }) => {
        await clickKeys(page, ['5', '0']);
        await page.locator('[data-action="percent"]').click();
        await expect(page.locator('[data-display]')).toHaveText('0.5');
    });

    test('replaces a pending operator instead of stacking operators', async ({ page }) => {
        await clickKeys(page, ['5', '+', '×', '2']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('10');
    });

    test('shows an error for an incomplete expression', async ({ page }) => {
        await clickKeys(page, ['5', '+']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-status]')).toHaveText('Complete the expression first.');
    });

    test('supports backspace', async ({ page }) => {
        await clickKeys(page, ['1', '2', '3']);
        await page.locator('[data-action="backspace"]').click();
        await expect(page.locator('[data-display]')).toHaveText('12');
    });

    test('clears the calculator', async ({ page }) => {
        await clickKeys(page, ['1', '2', '3']);
        await page.locator('[data-action="clear"]').click();
        await expect(page.locator('[data-display]')).toHaveText('0');
    });

    test('supports keyboard input', async ({ page }) => {
        await page.keyboard.type('12+8');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-display]')).toHaveText('20');
    });

    test('supports Escape to clear', async ({ page }) => {
        await page.keyboard.type('123');
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-display]')).toHaveText('0');
    });

    test('persists dark theme preference', async ({ page }) => {
        await page.locator('[data-theme-toggle]').click();
        await expect(page.locator('html')).toHaveClass(/dark/);
        await page.reload();
        await expect(page.locator('html')).toHaveClass(/dark/);
    });
});
