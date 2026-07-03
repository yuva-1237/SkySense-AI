import { test, expect } from '@playwright/test';

test.describe('SkySense AI – Core User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial weather load to complete
    await page.waitForSelector('.glass-panel', { timeout: 15000 });
  });

  test('loads the dashboard and displays weather data', async ({ page }) => {
    // Sidebar should be visible on desktop
    await expect(page.locator('text=SkySense AI').first()).toBeVisible();

    // Primary weather card should render with temperature
    await expect(page.locator('text=Weather Intelligence')).toBeVisible();

    // Temperature should be visible (°C or °F)
    const tempEl = await page.locator('text=/\\d+°[CF]/').first();
    await expect(tempEl).toBeVisible();
  });

  test('searches for a new location and updates weather', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search locations"]');
    await searchInput.fill('Tokyo');
    await searchInput.press('Enter');

    // After search, should display Tokyo
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Tokyo')).toBeVisible();
  });

  test('navigates to the Maps view', async ({ page }) => {
    // Click Maps in sidebar
    await page.locator('button:has-text("Maps")').click();
    
    // Map container and layer controls should appear
    await expect(page.locator('text=Precipitation Radar')).toBeVisible();
    await expect(page.locator('text=Cloud Cover')).toBeVisible();
  });

  test('layer toggle switches weather overlay on map', async ({ page }) => {
    await page.locator('button:has-text("Maps")').click();
    await page.waitForTimeout(1000);

    const cloudBtn = page.locator('button:has-text("Cloud Cover")');
    await cloudBtn.click();
    await expect(cloudBtn).toHaveClass(/bg-primary/);

    const windBtn = page.locator('button:has-text("Wind Streamlines")');
    await windBtn.click();
    await expect(windBtn).toHaveClass(/bg-primary/);
  });

  test('navigates to Health Center and shows allergy info', async ({ page }) => {
    await page.locator('button:has-text("Health Center")').click();
    await expect(page.locator('text=Allergen Tracker')).toBeVisible();
    await expect(page.locator('text=Air Contaminants Breakdown')).toBeVisible();
  });

  test('navigates to Travel Mode and shows packing checklist', async ({ page }) => {
    await page.locator('button:has-text("Travel Mode")').click();
    await expect(page.locator('text=Contextual Packing Checklist')).toBeVisible();
    await expect(page.locator('text=Transit Security Status')).toBeVisible();
  });

  test('navigates to Farmer Mode and shows soil metrics', async ({ page }) => {
    await page.locator('button:has-text("Farmer Mode")').click();
    await expect(page.locator('text=Estimated Soil Moisture')).toBeVisible();
    await expect(page.locator('text=Evapotranspiration').first()).toBeVisible();
  });

  test('opens AI Assistant and sends a weather question', async ({ page }) => {
    await page.locator('button:has-text("AI Assistant")').click();

    // Chat input should be visible
    const chatInput = page.locator('input[placeholder*="Ask about weather"]');
    await expect(chatInput).toBeVisible();

    // Send a message
    await chatInput.fill('What is the weather like?');
    await chatInput.press('Enter');

    // Wait for the bot to respond (loading indicator disappears)
    await page.waitForSelector('text=Querying atmospheric data', { state: 'detached', timeout: 15000 });

    // A reply should have appeared
    const messages = page.locator('.rounded-2xl');
    await expect(messages.nth(1)).toBeVisible();
  });

  test('temperature unit toggle switches between C and F', async ({ page }) => {
    const toggleBtn = page.locator('button:has-text("Display")');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText(/°F/);
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText(/°C/);
  });

  test('geolocation fallback input appears when denied', async ({ page, context }) => {
    // Deny geolocation permission
    await context.grantPermissions([]);
    await page.locator('button:has-text("Maps")').click();
    await page.waitForTimeout(500);

    const geoBtn = page.locator('button:has-text("Use My Geolocation")');
    await geoBtn.click();
    
    // After denial, manual input should appear
    await page.waitForTimeout(1000);
    // Fallback state should be shown (coords input or denied message)
    const fallbackInput = page.locator('input[placeholder="coords: lat,lon"]');
    await expect(fallbackInput).toBeVisible({ timeout: 8000 });
  });
});
