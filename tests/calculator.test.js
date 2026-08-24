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

    async function result(page) {
        return page.locator('[data-display]').textContent();
    }

    test('adds numbers', async ({ page }) => {
        await clickKeys(page, ['2', '+', '3']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('5');
    });

    test('respects operator precedence', async ({ page }) => {
        await clickKeys(page, ['2', '+', '3', '×', '4']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('14');
    });

    test('handles division', async ({ page }) => {
        await clickKeys(page, ['2', '0', '÷', '4']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('5');
    });

    test('prevents division by zero', async ({ page }) => {
        await clickKeys(page, ['1', '0', '÷', '0']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-status]')).toHaveText('Cannot divide by zero.');
    });

    test('prevents duplicate decimal points in a number', async ({ page }) => {
        await clickKeys(page, ['1', '.', '2']);
        await page.locator('[data-value="."]').click();
        await expect(page.locator('[data-display]')).toHaveText('1.2');
    });

    test('supports negative numbers', async ({ page }) => {
        await page.locator('[data-action="sign"]').click();
        await page.locator('[data-value="5"]').click();
        await page.locator('[data-value="+"]').click();
        await page.locator('[data-value="8"]').click();
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('3');
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
