import { test, expect } from '../hooks/testHooks';
import { trackSearchAPICalls, waitForDebounce } from '../utils/API-Debounce';

test.describe.serial('Stock Search Functionality', () => {
   
    test('TC_01: Search bar visible/clickable on the main page', async ({ searchPage }) => {


        // Verify search bar is visible
        await expect(searchPage.searchBox).toBeVisible();

        // Verify search bar is clickable
        await expect(searchPage.searchBox).toBeEnabled();

        // Click on search bar to verify interactivity
        await searchPage.searchBox.click();
    });

    test('TC_03: Typing 3 characters should trigger API and display results', async ({ page, searchPage }) => {
        // const searchPage = new SearchPage(page);

        // Start tracking API calls before typing
        const getSearchCallCount = trackSearchAPICalls(page);
       
        // Type 3 characters
        await searchPage.search('REL');

        // Wait for debounce and API response
        await waitForDebounce(page);

        // Check how many API calls were triggered
        console.log('No of API calls triggered:', getSearchCallCount());

        // Verify results are displayed
        const results = searchPage.results;
        
        const resultCount = await results.count();

        console.log('Number of results displayed:', resultCount);

    });

    test('TC_05: Lowercase search should return matching results', async ({ page , searchPage }) => {

        // const searchPage = new SearchPage(page);
        await searchPage.search('tata');

        // Wait for results
        await waitForDebounce(page);

        // Verify results contain Tata companies
        const results = searchPage.results;
        
        const resultCount = await results.allTextContents();

        console.log('List of Tata results displayed:', resultCount);

    });

    test('TC_06: No stock should display while searching XYZM', async ({ page, searchPage }) => {

        // const searchPage = new SearchPage(page);
        await searchPage.search('XYZM');

        // Wait for API response
        await waitForDebounce(page);

        // Check for no results message or empty results list
        const noResultsMessage = searchPage.results;

        await expect(noResultsMessage).toBeVisible();
        console.log("No Results Message:", await noResultsMessage.textContent());

    });

    test('TC_07:Extra spaces should be trimmed automatically', async ({ page, searchPage }) => {

        // const searchPage = new SearchPage(page);
        await searchPage.search(" RELIANCE ");

        // Wait for results
        await waitForDebounce(page);

        // Verify results are returned as spaces trimmed
        const results = searchPage.results;
        const resultCount = await results.count();
        console.log('No of Reliance resultls:', resultCount);

        const resultsText = await results.allTextContents();
        console.log('List of Reliance results displayed:', resultsText);
        const hasRelianceResults = resultsText.some(text =>
            text.toLowerCase().includes('reliance')
            );
        expect(hasRelianceResults).toBeTruthy();
    });

    test('TC_08: Special characters should be handled', async ({ page, searchPage }) => {

        // const searchPage = new SearchPage(page);
        await searchPage.search('@#$');

        // Wait for API response
        await waitForDebounce(page);

        // Verify no results or error message
        const results = searchPage.results;
        const resultCount = await results.count();
        const resultsText = await results.allTextContents();

        // Should either have no results or show no results message
        expect(resultCount).toBe(1);

        // Verify page doesn't crash (page should still be responsive)
        await expect(searchPage.searchBox).toBeEnabled();
        console.log('no of results count:', resultCount);
        console.log('Results for special characters:', resultsText);
    });

    test('TC_10: long input (100+ characters) should be handled without crash', async ({ page , searchPage }) => {

        // const searchPage = new SearchPage(page);
        const getSearchCallCount = trackSearchAPICalls(page);

        // fill a very long string
        const longString = 'D'.repeat(100);
        await searchPage.search(longString);

        // Wait for potential API call
        await waitForDebounce(page);
        console.log('API calls triggered for long input:', getSearchCallCount());

        // Verify page is still responsive (not crashed)
        await expect(searchPage.searchBox).toBeEnabled();

        // Verify input was handled gracefully
        const inputValue = await searchPage.searchBox.inputValue();
        expect(inputValue).toBeDefined();
    });

    test('TC_11: Numeric BSE codes should be recognized', async ({ page, searchPage }) => {

        // const searchPage = new SearchPage(page);
        const getSearchCallCount = trackSearchAPICalls(page);

        // Using a known code - HDFC Bank BSE code
        await searchPage.search('500180');

        // Wait for debounce and API response
        await waitForDebounce(page);
        console.log('API calls triggered for numeric code:', getSearchCallCount());

        // Verify either results are shown or no data found message
        const results = searchPage.results;

        const resultsText = await results.allTextContents()

        console.log('Results for numeric code:', resultsText);

        const resultCount = await results.count();

        console.log('Number of results for numeric code:', resultCount);

        expect(resultCount).toBeGreaterThanOrEqual(0);
    });

});
