import { test, expect } from '@playwright/test';
import { BaseTest } from '../utils/BaseTest';
import { testUsers } from '../utils/TestData';
import { MyAccountPage } from '../pages/MyAccountPage';
import { BasePage } from 'pages/BasePage';
import { LoginPage } from 'pages/LoginPage';

let baseTest: BaseTest;
let basePage: BasePage;
let loginPage: LoginPage;
let myAccountPage: MyAccountPage

// Execute before each test: Initialize fresh test setup
test.beforeEach(async ({ browser }) => {
    baseTest = new BaseTest(browser); 
    await baseTest.setupTest();
    await baseTest.login();

    // Initialize page objects with fresh session
    basePage = new BasePage(baseTest.page);
    myAccountPage = new MyAccountPage(baseTest.page);
    
});

// Execute after each test: Clean up browser context
test.afterEach(async () => {
    await baseTest.cleanup();
});

test.describe('Verify My Account page details', () => {

  test('Should show My Account page after login with login details', async () => {
    const { name } = testUsers.validUserData;
    expect(myAccountPage.isContactNameVisible(name)).toBeTruthy();
  });
})
