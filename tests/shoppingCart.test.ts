import { test, expect, BrowserContext, Page } from '@playwright/test';
import { searchedItems } from '../utils/TestData';
import { BasePage } from 'pages/BasePage';
import { HeaderPage } from 'pages/HeaderPage';
import { SearchPage } from 'pages/SearchPage';  
import { TestSetup } from '../utils/TestSetup';


let setup: TestSetup;
let basePage: BasePage;
let headerPage: HeaderPage;
let searchPage: SearchPage;

test.beforeAll(async ({ browser }) => {
    console.log('Before tests ---- ');

    // Initialize TestSetup and reuse context/page
    setup = new TestSetup(browser);
    await setup.init();
    await setup.login();
    // **Initialize page objects once**
    basePage = new BasePage(setup.page);
    headerPage = new HeaderPage(setup.page);
    searchPage = new SearchPage(setup.page);
});

test.afterAll(async () => {
    await setup.cleanup();
});

test.describe('Verify user can log in, search item and add it to cart', () => {
    test('Search for item', async () => {

        await headerPage.enterSearchText(searchedItems.validSearchItem);
        expect(await basePage.isCurrentUrlEndingWith(`/catalogsearch/result/?q=${searchedItems.chosenItem}`)).toBeTruthy;
        expect(await searchPage.isSearchedItemVisible(searchedItems.chosenItem)).toBeTruthy;

    });

    test('Add chosen item to shopping cart', async () => {
        
    });

});    