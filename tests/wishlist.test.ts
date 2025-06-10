import { test, expect } from '@playwright/test';
import { searchedItems, itemDetails, shippingDetails } from '../utils/TestData';
import { BasePage } from 'pages/BasePage';
import { HeaderPage } from 'pages/HeaderPage';
import { SearchPage } from 'pages/SearchPage';
import { BaseTest } from '../utils/BaseTest';
import { CartPage } from 'pages/CartPage';
import { MyOrdersPage } from 'pages/MyOrdersPage';
import { MyWishlistPage } from 'pages/MyWishlistPage';



let baseTest: BaseTest;
let basePage: BasePage;
let headerPage: HeaderPage;
let searchPage: SearchPage;
let cartPage: CartPage;
let myOrdersPage: MyOrdersPage;
let myWishlistPage: MyWishlistPage;

// Execute before each test: Initialize fresh test setup
test.beforeEach(async ({ browser }) => {
    baseTest = new BaseTest(browser);

    await baseTest.setupTest();
    await baseTest.login();

    // Initialize page objects with fresh session
    basePage = new BasePage(baseTest.page);
    headerPage = new HeaderPage(baseTest.page);
    searchPage = new SearchPage(baseTest.page);
    cartPage = new CartPage(baseTest.page);
    myOrdersPage = new MyOrdersPage(baseTest.page);
    myWishlistPage = new MyWishlistPage(baseTest.page);
})

// Execute after each test: Clean up browser context
test.afterEach(async () => {
    await baseTest.cleanup();
});

test.describe('Verify user is able to add, remove or edit wishlist', () => {

    test('Verify user can log in, search item and add it to wishlist', { tag: '@regression' }, async () => {
        await myWishlistPage.removeAllWishlistItems(); // Ensure wishlist is empty before starting

        await headerPage.enterSearchText(searchedItems.validSearchItem);
        expect(await searchPage.isCurrentUrlEndingWith(`/catalogsearch/result/?q=${searchedItems.chosenItem}`)).toBeTruthy;
        expect(await searchPage.isSearchedItemVisible(searchedItems.chosenItem)).toBeTruthy;
        await searchPage.clickProductByName(searchedItems.chosenItem);
        await searchPage.addToWishlist();
        expect(await myWishlistPage.verifySuccessMessageForWishlistAdding()).toBeTruthy;
        expect(await myWishlistPage.isItemDisplayedInWishlist(searchedItems.chosenItem)).toBeTruthy;

    });

    test('Verify user can log in, search item and edit wishlist ', { tag: '@regression' }, async () => {
        // add next test steps
    });

});    