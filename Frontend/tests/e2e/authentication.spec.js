const { test, expect } = require('@playwright/test');

test('invalid credentials show an authentication error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('invalid@example.com');
    await page.getByLabel('Password').fill('incorrect-password');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/login failed|bad credentials/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login$/);
});

test('demo passenger can authenticate and reach protected bookings', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('passenger@persistent.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('passenger', { exact: true })).toBeVisible();

    await page.getByRole('link', { name: /My Bookings/i }).click();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(page.getByRole('heading', { name: /My Confirmed Bookings/i })).toBeVisible();
    await expect(page.evaluate(() => Boolean(localStorage.getItem('token')))).resolves.toBe(true);
});
