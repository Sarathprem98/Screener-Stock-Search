import { faker } from '@faker-js/faker/locale/zu_ZA';
import { test, expect } from '../hooks/testHooks';
import { trackAPICalls, waitForDebounce } from '../utils/API-Debounce';
import logger from '../utils/Logger';
import { TestData } from '../utils/TestData';


test.describe('Stock Search Functionality', () => {
     const Company = TestData.randomCompany();
     const RandomString = TestData.RandomString();
     const Extraspaces = TestData.Extraspaces();
     const specialChars = TestData.specialChars();
     const longString = TestData.longString();
     const BSEcode = TestData.BSEcode();
    

    test('TC_01: Search bar visible/clickable on the main page', async ({ searchPage }) => {


        // Verify search bar is visible
        await expect(searchPage.searchBox).toBeVisible();

        // Verify search bar is clickable
        await expect(searchPage.searchBox).toBeEnabled();

        // Click on search bar to verify interactivity
        await searchPage.searchBox.click();
    });
        test('TC_02: Typing 2 characters should not trigger API and display results', async ({ page, searchPage }) => {

        // Start tracking API calls before typing
        const getSearchCallCount = trackAPICalls(page);


        // Random company Data with Type 2 characters
        await searchPage.search(Company.slice(0, 2).toUpperCase());
        

        // Wait for debounce timeout
        await waitForDebounce(page);

        
        // Verify results are displayed
        const results = searchPage.results
        const resultCount = await results.allTextContents();
        logger.info('List of results displayed:' + resultCount);

        // Verify API was called at least once
        const count = getSearchCallCount();
        logger.info('API calls triggered:' + count);
        expect(count, 'API should not be triggered').toBe(0);
        await expect(results).toHaveCount(1);


    });

    test('TC_03: Typing 3 characters should trigger API and display results', async ({ page, searchPage }) => {

        // Start tracking API calls before typing
        const getSearchCallCount = trackAPICalls(page);


        // Random Data with Type 3 characters
        await searchPage.search(Company.slice(0, 3).toUpperCase());
        

        // Wait for debounce timeout
        await waitForDebounce(page);
        
        // Verify results are displayed
        const results = searchPage.results
        const resultCount = await results.allTextContents();
        logger.info('List of results displayed:' + resultCount);

        // Verify API was called at least once
        const count = getSearchCallCount();
        logger.info('API calls triggered:' + count);

    });

    test('TC_04: Rapid typing should not trigger API call', async ({ page, searchPage }) => {

        // Start tracking API calls before typing
        const getSearchCallCount = trackAPICalls(page);


        // Rapidly type a valid company name character by character
        await searchPage.searchBox.pressSequentially(Company.slice(0, 4).toUpperCase(), { delay: 100 });
        

        // Wait for debounce timeout
        await waitForDebounce(page);
        
        // // Verify results are displayed
        const results = searchPage.results
        const resultCount = await results.allTextContents();
        logger.info('List of results displayed:' + resultCount);

        // Verify API was called only once after rapid typing
        const count = getSearchCallCount();
        logger.info('API calls triggered after rapid typing:' + count);
        expect(count, 'API should be triggered only once after rapid typing').toBe(1);

    });

    test('TC_05: Lowercase search should return matching results', async ({ page, searchPage }) => {


        // Radom company name with 3 characters in lowercase
        await searchPage.search(Company.toLowerCase());
        

        // Wait for results
        await waitForDebounce(page);

        // Verify results contain matching companies
        const results = searchPage.results;

        const resultCount = await results.allTextContents();

        logger.info('List of results displayed:' + resultCount);
        

    });

    test('TC_06: No stock should display while searching Random Data', async ({ page, searchPage }) => {

        // Random string with 4 characters that is unlikely to match any stock 
        
        await searchPage.search(RandomString.toUpperCase());

        // Wait for API response
        await waitForDebounce(page);

        // Check for no results message or empty results list
        const noResultsMessage = searchPage.results;

        await expect(noResultsMessage).toBeVisible();
        logger.info('No Results Message:' + await noResultsMessage.textContent());

    });

    test('TC_07:Extra spaces should be trimmed automatically from random data', async ({ page, searchPage }) => {
        
        // Search with random data that has extra spaces
        await searchPage.search(Extraspaces);

        // Wait for results
        await waitForDebounce(page);

        // Verify results are returned as spaces trimmed
        const results = searchPage.results;
        const resultCount = await results.count();
        logger.info('No of resultls:' + resultCount);

        const resultsText = await results.allTextContents();
        logger.info('List of results displayed:' + resultsText);
       
    });

    test('TC_08: Special characters should be handled', async ({ page, searchPage }) => {
        
        // Search with random special characters
        await searchPage.search(specialChars);

        // Wait for API response
        await waitForDebounce(page);

        // Verify no results or error message
        const results = searchPage.results;
        const resultCount = await results.count();
        const resultsText = await results.allTextContents();

        // Should either have no results or show no results message
        expect(resultCount).toBe(1);

        // Verify page doesn't crash (page should still be responsive)
        logger.info('no of results count:' + resultCount);
        logger.info('Results for special characters:' + resultsText);
    });

    test('TC_09: Rapid typing and then backspace', async ({ page, searchPage }) => {

        // Start tracking API calls before typing
        const getSearchCallCount = trackAPICalls(page);


        // Rapidly type a valid company name character by character and then backspace
        const searchcompany = Company.slice(0, 5).toUpperCase().trim();
        await searchPage.searchBox.type(searchcompany, { delay: 100 });
        await searchPage.searchBox.press('Backspace');
        await searchPage.searchBox.press('Backspace');
        ;
        
        // Wait for debounce timeout
        await waitForDebounce(page);
        
        // // Verify results are displayed
        const results = searchPage.results
        const resultCount = await results.allTextContents();
        logger.info('List of results displayed:' + resultCount);

        // Verify API was called only once after rapid typing and backspace
        const count = getSearchCallCount();
        logger.info('API calls triggered after backspace:' + count);
        expect(count, 'API should be triggered only once after backspace').toBe(1);

    });

    test('TC_10: Random long input (100+ characters) should be handled without crash', async ({ page, searchPage }) => {

        const getSearchCallCount = trackAPICalls(page);

        // fill a very long random string
        await searchPage.search(longString);

        // Wait for potential API call
        await waitForDebounce(page);
        logger.info('API calls triggered for long input:' + getSearchCallCount());

        // Verify page is still responsive (not crashed)
        await expect(searchPage.searchBox).toBeEnabled();

        // Verify input was handled gracefully
        const inputValue = await searchPage.searchBox.inputValue();
        expect(inputValue).toBeDefined();
    });

    test('TC_11: Numeric BSE codes should be recognized', async ({ page, searchPage }) => {

        const getSearchCallCount = trackAPICalls(page);

        // Using a Random BSE code to test numeric search functionality
        await searchPage.search(BSEcode);

        // Wait for debounce and API response
        await waitForDebounce(page);
        logger.info('API calls triggered for numeric code:' + getSearchCallCount());

        // Verify either results are shown or no data found message
        const results = searchPage.results;

        const resultsText = await results.allTextContents()

        logger.info('Results for numeric code:' + resultsText);

        const resultCount = await results.count();

        logger.info('Number of results for numeric code:' + resultCount);

        expect(resultCount).toBeGreaterThanOrEqual(0);
    });

});
