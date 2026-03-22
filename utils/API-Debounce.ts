import { Page } from '@playwright/test';

export function trackSearchAPICalls(page: Page) {
  let count = 0;

  // Listen to 'response' instead of 'request' so we can get the status code
  page.on('response', (response) => {
    // Only track responses where the URL contains 'search'
    if (response.url().includes('search')) {
      count++;
      console.log('API URL:', response.url());
      console.log('Status Code:', response.status());
    }
  });

  // Return a closure so you can check the final count later in your test
  return () => count;
}

export async function waitForDebounce(page: Page, time = 500) {

  await page.waitForTimeout(500);
}
