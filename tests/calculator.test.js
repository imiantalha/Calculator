import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
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

    test('handles multiplication and division left-to-right', async ({ page }) => {
        await calculate(page, ['2', '0', '÷', '5', '×', '2']);
        await expect(page.locator('[data-display]')).toHaveText('8');
    });

    test('prevents division by zero', async ({ page }) => {
        await calculate(page, ['1', '0', '÷', '0']);
        await expect(page.locator('[data-status]')).toHaveText('Cannot divide by zero.');
    });

    test('prevents duplicate decimal points', async ({ page }) => {
        await clickKeys(page, ['1', '.', '2']);
        await page.locator('[data-value="."]').click();
        await expect(page.locator('[data-display]')).toHaveText('1.2');
    });

    test('normalizes floating-point artifacts', async ({ page }) => {
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

    test('supports negative numbers after an operator', async ({ page }) => {
        await calculate(page, ['5', '×', '-', '3']);
        await expect(page.locator('[data-display]')).toHaveText('-15');
    });

    test('supports percentage conversion', async ({ page }) => {
        await clickKeys(page, ['5', '0']);
        await page.locator('[data-action="percent"]').click();
        await expect(page.locator('[data-display]')).toHaveText('0.5');
    });

    test('replaces a pending operator', async ({ page }) => {
        await clickKeys(page, ['5', '+', '×', '2']);
        await page.locator('[data-action="equals"]').click();
        await expect(page.locator('[data-display]')).toHaveText('10');
    });

    test('reports incomplete expressions', async ({ page }) => {
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

    test('saves calculations to history', async ({ page }) => {
        await calculate(page, ['1', '2', '+', '8']);
        await page.locator('[data-history-toggle]').click();
        await expect(page.locator('[data-history-list]')).toContainText('12 + 8');
        await expect(page.locator('[data-history-list]')).toContainText('20');
    });

    test('restores a calculation from history', async ({ page }) => {
        await calculate(page, ['7', '×', '6']);
        await page.locator('[data-action="clear"]').click();
        await page.locator('[data-history-toggle]').click();
        await page.locator('[data-history-index="0"]').click();
        await expect(page.locator('[data-display]')).toHaveText('7×6');
    });

    test('clears calculation history', async ({ page }) => {
        await calculate(page, ['4', '+', '4']);
        await page.locator('[data-history-toggle]').click();
        await page.locator('[data-clear-history]').click();
        await expect(page.locator('[data-history-list]')).toContainText('No calculations yet.');
    });

    test('stores and recalls memory', async ({ page }) => {
        await clickKeys(page, ['4', '2']);
        await page.locator('[data-memory="store"]').click();
        await page.locator('[data-action="clear"]').click();
        await page.locator('[data-memory="recall"]').click();
        await expect(page.locator('[data-display]')).toHaveText('42');
    });

    test('adds and subtracts from memory', async ({ page }) => {
        await clickKeys(page, ['1', '0']);
        await page.locator('[data-memory="store"]').click();
        await page.locator('[data-action="clear"]').click();
        await clickKeys(page, ['5']);
        await page.locator('[data-memory="add"]').click();
        await page.locator('[data-action="clear"]').click();
        await page.locator('[data-memory="recall"]').click();
        await expect(page.locator('[data-display]')).toHaveText('15');
        await page.locator('[data-memory="subtract"]').click();
        await page.locator('[data-memory="recall"]').click();
        await expect(page.locator('[data-display]')).toHaveText('0');
    });

    test('copy button reports success when clipboard is available', async ({ page }) => {
        await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
        await clickKeys(page, ['4', '2']);
        await page.locator('[data-copy-result]').click();
        await expect(page.locator('[data-status]')).toHaveText('Result copied');
    });

    test('supports H to open history', async ({ page }) => {
        await page.keyboard.press('h');
        await expect(page.locator('[data-history-panel]')).toBeVisible();
    });
});
