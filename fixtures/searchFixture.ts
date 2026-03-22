import { test as base } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

export const test = base.extend<{
  searchPage: SearchPage;
}>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
});