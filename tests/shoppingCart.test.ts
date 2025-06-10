import { test, expect } from '@playwright/test';
import { searchedItems, itemDetails, shippingDetails } from '../utils/TestData';
import { BasePage } from 'pages/BasePage';
import { HeaderPage } from 'pages/HeaderPage';
import { SearchPage } from 'pages/SearchPage';
import { BaseTest } from '../utils/BaseTest';
import { CartPage } from 'pages/CartPage';
import { MyOrdersPage } from 'pages/MyOrdersPage';


let baseTest: BaseTest;
let basePage: BasePage;
let headerPage: HeaderPage;
let searchPage: SearchPage;
let cartPage: CartPage;
let myOrdersPage: MyOrdersPage;

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
});

// Execute after each test: Clean up browser context
test.afterEach(async () => {
    console.log('get into afterEach');

    await baseTest.cleanup();
});

test.describe('Verify user is able to proceed with search and shop of an item', () => {
    
    console.log('get into describe Verify user is able to proceed with search and shop of an item');

    test('Verify user can log in, search item, add it to cart and proceed to shop', {tag: '@smoke'}, async () => {
        await headerPage.enterSearchText(searchedItems.validSearchItem);
        expect(await searchPage.isCurrentUrlEndingWith(`/catalogsearch/result/?q=${searchedItems.chosenItem}`)).toBeTruthy;
        expect(await searchPage.isSearchedItemVisible(searchedItems.chosenItem)).toBeTruthy;
        await searchPage.clickProductByName(searchedItems.chosenItem);
        await searchPage.selectProductOptions(itemDetails.shirtColor, itemDetails.shirtSize, itemDetails.shirtQuantity);
        await searchPage.addToCart();
        expect(await searchPage.isAddToCartSuccessful(searchedItems.chosenItem)).toBeTruthy;
        await searchPage.openAndProceedToCart();
        await cartPage.isProductInCart(itemDetails.shirtSize, itemDetails.shirtColor, itemDetails.shirtQuantity);
        let subtotalPrice = await cartPage.getItemSubtotal();
        expect(await cartPage.getCartItemQuantityByProductName(searchedItems.chosenItem)).toBe(itemDetails.shirtQuantity);
        expect(await cartPage.isCartEmpty()).toBeFalsy;
        expect(await cartPage.proceedToCheckout()).toBeTruthy();
        expect(await cartPage.isFixedFlatRatePrice(5.00)).toBeTruthy;
        await cartPage.checkAndFillShippingDetails(
            shippingDetails.firstname,
            shippingDetails.lastname,
            shippingDetails.company,
            shippingDetails.address,
            shippingDetails.city,
            shippingDetails.city,
            shippingDetails.zipcode,
            shippingDetails.country,
            shippingDetails.phone
        );
        await cartPage.clickNextButton();
        expect(await cartPage.verifyOrderTotal(subtotalPrice, 5.00)).toBeTruthy;
        expect(await cartPage.verifyShippingDetails(
            shippingDetails.firstname,
            shippingDetails.lastname,
            shippingDetails.company,
            shippingDetails.address,
            shippingDetails.city,
            shippingDetails.city,
            shippingDetails.zipcode,
            shippingDetails.country,
            shippingDetails.phone
        )).toBeTruthy;

        let orderid = await cartPage.placeAnOrder();
        console.log("Created order_id: "+ orderid);
        await cartPage.clickOrderNumber();
        await myOrdersPage.verifyOrderDetails(orderid, "Pending");

    });

    test('Navigate to checkout and remove added item', {tag: '@regression'}, async () => {
        // add next test steps
    });

});    