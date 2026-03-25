import { Page, Locator } from '@playwright/test';
import logger from '../utils/Logger';
import { Faker } from '@faker-js/faker';

export class SearchPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly results: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('input[autofocus="true"]');
    this.results = page.locator(".home-search .dropdown-content li");
  }

  async search(term: string) {
    logger.info(`Typed search : ${term}`);
    await this.searchBox.fill(term);
  }

  async getResultsText() {
    await this.results.first().waitFor();
    return this.results.allTextContents();
  }
}