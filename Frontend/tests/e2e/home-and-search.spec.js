const { test, expect } = require('@playwright/test');

test('passenger can open the premium home screen and filter verified flights', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AIRLINE NEXUS/i);
    await expect(page.getByRole('link', { name: /Search Flights/i })).toBeVisible();

    await page.getByRole('link', { name: 'Flights', exact: true }).click();
    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByRole('heading', { name: 'Verified Scheduled Flights' })).toBeVisible();
    await expect(page.getByRole('status', { name: /Loading available flights/i })).toBeHidden({ timeout: 15000 });

    const filter = page.getByPlaceholder(/Filter by city/i);
    await filter.fill('DEL');
    await expect(filter).toHaveValue('DEL');
    await expect(page.getByText(/Verified Scheduled Flights/i)).toBeVisible();
});

test('passenger can switch themes without losing the current route', async ({ page }) => {
    await page.goto('/search');
    const themeButton = page.getByRole('button', { name: /Switch theme/i });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await expect(page).toHaveURL(/\/search$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', /light|amoled|dark/);
});
