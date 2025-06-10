import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../utils/TestData';
import { BaseTest } from '../utils/BaseTest';
import { BasePage } from 'pages/BasePage';
import { HeaderPage } from 'pages/HeaderPage';
import { SearchPage } from 'pages/SearchPage';
import { CartPage } from 'pages/CartPage';

let baseTest: BaseTest;
let basePage: BasePage;
let loginPage: LoginPage;

// Execute before each test: Initialize fresh test setup
test.beforeEach(async ({ browser }) => {
 baseTest = new BaseTest(browser); 
    await baseTest.setupTest();

  // Initialize page objects with fresh session
  basePage = new BasePage(baseTest.page);
  loginPage = new LoginPage(baseTest.page);  // Ensure correct login page instantiation
});

// Execute after each test: Clean up browser context
test.afterEach(async () => {
  await baseTest.cleanup();
});


test.describe('Verify login test cases', () => {
  test('Verify there is an error message when logging in with invalid data', {tag: '@regression'}, async () => {
    const { email, password } = testUsers.invalidLoginUser;

    await loginPage.navigateToLoginPage();
    await loginPage.login(email, password);

    await expect(loginPage.errorMessage).toBeVisible();
  });
});
