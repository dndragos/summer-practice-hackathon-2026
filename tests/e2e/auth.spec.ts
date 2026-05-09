import { test, expect } from '@playwright/test';

test.describe('Dashboard & Availability Toggle', () => {
  test('should allow a user to toggle their availability', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // NOTE: This test assumes the user is already authenticated or 
    // that the environment is configured to bypass auth for testing.
    
    // Check for the "ShowUpToday?" button (initial state)
    const toggleButton = page.getByRole('button', { name: /ShowUpToday\?/i });
    
    if (await toggleButton.isVisible()) {
      // Click to show up
      await toggleButton.click();

      // Expect the button text to change
      await expect(page.getByRole('button', { name: /I'm Showing Up!/i })).toBeVisible();
      await expect(page.getByText(/You are ready to play today!/i)).toBeVisible();
    } else {
      // If already showing up, toggle back to test the reverse
      const showingUpButton = page.getByRole('button', { name: /I'm Showing Up!/i });
      await expect(showingUpButton).toBeVisible();
      
      await showingUpButton.click();
      await expect(page.getByRole('button', { name: /ShowUpToday\?/i })).toBeVisible();
    }
  });
});
