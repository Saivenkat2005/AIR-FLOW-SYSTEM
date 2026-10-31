const { test, expect } = require('@playwright/test');

test('unauthenticated passengers are redirected from bookings', async ({ page }) => {
    await page.goto('/bookings');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

test('flight search remains usable after a fresh navigation', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: 'Verified Scheduled Flights' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Verified Scheduled Flights' })).toBeVisible();
});
