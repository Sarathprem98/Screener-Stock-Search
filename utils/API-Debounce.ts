import { Page } from '@playwright/test';
import logger from '../utils/Logger';

export function trackAPICalls(page: Page) {
  let count = 0;

  page.on('response', async (response) => {
      const url = response.url();
    // Only track responses where the URL contains 'search'
    if (url.includes('search')) {
      count++;
      await response.finished();
      const timing = response.request().timing();
      const durationMs = timing.responseEnd;
      
      console.log('API URL:', response.url());
      console.log('Status Code:', response.status());
      console.log('Response Time (ms):', durationMs);
    }
  });

  return () => count;
}

export async function waitForDebounce(page: Page, time = 500) {

  await page.waitForTimeout(500);
  logger.info('Waited for debounce');
}
