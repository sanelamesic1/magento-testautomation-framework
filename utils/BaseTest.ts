import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';

dotenv.config();

export class BaseTest {
  private browser: Browser;
  private context!: BrowserContext;
  public page!: Page;
  private loginPage!: LoginPage;

  constructor(browser: Browser) {
    this.browser = browser;

  }

  async setupTest() {
    console.log('Initializing test setup...');
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
  }

  async login(
    email: string = process.env.USERNAME || '',
    password: string = process.env.PASSWORD || ''
  ) {
    console.log('Performing login...');

    await this.loginPage.navigateToLoginPage();
    await this.loginPage.login(email, password);

    // Check for the "Invalid Form Key" error and retry login if detected
    // This is a common issue in Magento when the form key is invalid or expired.
    // It can happen if the session is stale or if the form key has changed.
    const formKeyErrorLocator = this.page.locator('.message-error:has-text("Invalid Form Key")');
    if (await formKeyErrorLocator.isVisible()) {
      console.warn("Detected 'Invalid Form Key' error. Retrying login...");
      await this.login(email, password);
    }

    // Validate login success
    expect(await this.loginPage.isMyAccountVisible()).toBe(true);
    console.log('Login successful. Ready to execute tests.');
  }

  async cleanup() {
    console.log('Cleaning up test context...');
    if (this.context) {
      await this.context.close();
    }
  }
}
