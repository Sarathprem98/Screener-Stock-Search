# 📈 Screener Stock Search - Playwright Automation

This repository contains the automated UI test suite for the **Screener Stock Search** web application. It is built using **Playwright** and **TypeScript**, implementing the Page Object Model (POM) design pattern for maintainability and scalability.

## 🛠️ Tech Stack & Libraries

* **Framework:** [Playwright](https://playwright.dev/) (TypeScript)
* **Test Data Generation:** [Faker.js](https://fakerjs.dev/) (`@faker-js/faker`)
* **Reporting:** [Allure Report](https://allurereport.org/) (`allure-playwright`)
* **Logging:** [Winston](https://github.com/winstonjs/winston)
* **File Management:** `rimraf` (for pre-test cleanups)

## 📂 Project Structure

```text
📦 Screener-Stock-Search
 ┣ 📂 pages/             # Page Object Model (POM) classes (e.g., SearchPage.ts)
 ┣ 📂 tests/             # Playwright test specs (e.g., stock-search.spec.ts)
 ┣ 📂 utils/             # Helper functions and utilities (e.g., TestData.ts, Logger)
 ┣ 📂 logs/              # Auto-generated Winston execution logs (test.log)
 ┣ 📂 allure-results/    # Auto-generated raw Allure data
 ┣ 📜 playwright.config.ts # Playwright framework configuration
 ┗ 📜 package.json       # Project dependencies and custom npm scripts
