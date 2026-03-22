import { test as base, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

type MyFixtures = {
  searchPage: SearchPage;
};

export const test = base.extend<MyFixtures>({

  page: async ({ page }, use) => {
    console.log('Test started:', test.info().title);

    await page.goto('https://www.screener.in');

    await use(page);

    await page.close();
    console.log('Test ended');
  },

  searchPage: async ({ page }, use) => {

    const searchPage = new SearchPage(page);
    
    await use(searchPage);
  },
});

export { expect };