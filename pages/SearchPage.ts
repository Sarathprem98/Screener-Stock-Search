import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly results: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('input[autofocus="true"]');
    this.results = page.locator(".home-search .dropdown-content li");
  }

  async search(text: string) {
    await this.searchBox.fill(text);
  }
//
  async getResultsText() {
    await this.results.first().waitFor();
    return this.results.allTextContents();
  }
}