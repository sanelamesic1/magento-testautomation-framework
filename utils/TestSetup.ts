import { Browser, BrowserContext, Page, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../utils/TestData';
import { MyAccountPage } from '../pages/MyAccountPage';

dotenv.config();

export class TestSetup {
  private browser: Browser;
  private context!: BrowserContext;
  public page!: Page;
  private loginPage!: LoginPage;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  async init() {
    console.log('Initializing test setup...');

    // Create a new browser context
    this.context = await this.browser.newContext();

    // Close Playwright's default blank page if it exists
    const defaultPages = this.context.pages();
    if (defaultPages.length > 0) {
      await defaultPages[0].close();
    }

    // Open the actual test page
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
    await this.page.waitForTimeout(5000);
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
