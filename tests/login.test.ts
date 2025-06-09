import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../utils/TestData';
import { TestSetup } from '../utils/TestSetup';

let setup: TestSetup;

test.beforeAll(async ({ browser }) => {
    console.log('Before tests ---- ');

    // Initialize TestSetup and reuse context/page
    setup = new TestSetup(browser);
    await setup.init();
    await setup.login();
});

test.afterAll(async () => {
    await setup.cleanup();
});


test('Verify there is an error message when log in with invalid data', async () => {
  const loginPage = new LoginPage(setup.page);
  const { email, password } = testUsers.invalidLoginUser;

  await loginPage.navigateToLoginPage();
  await loginPage.login(email, password);

  await expect(loginPage.errorMessage).toBeVisible();
});

