import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 10_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL: 'http://127.0.0.1:8000',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'php -S 127.0.0.1:8000',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: true,
    },
});
