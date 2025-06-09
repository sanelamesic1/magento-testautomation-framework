import { test, expect } from '@playwright/test';
import { TestSetup } from '../utils/TestSetup';
import { testUsers } from '../utils/TestData';
import { MyAccountPage } from '../pages/MyAccountPage';

let setup: TestSetup;

test.beforeAll(async ({ browser }) => {
    // Initialize TestSetup and reuse context/page
    setup = new TestSetup(browser);
    await setup.init();
    await setup.login();
});

test.afterAll(async () => {
    await setup.cleanup();
});

test('Should show My Account page after login with login details', async () => {
  const myAccountPage = new MyAccountPage(setup.page);
  const { name } = testUsers.validUserData;
 
  expect(myAccountPage.isContactNameVisible(name)).toBeTruthy();
});
