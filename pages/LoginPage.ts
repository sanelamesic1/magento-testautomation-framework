import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly myAccountTitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('input[name="login[password]"][type="password"]');
    this.signInButton = page.locator('button#send2.action.login.primary[type="submit"]');
    this.myAccountTitle = page.locator('span[data-ui-id="page-title-wrapper"]:has-text("My Account")');
    this.errorMessage = page.locator('.message-error');
  }

  async navigateToLoginPage() {
    await this.navigateTo('/customer/account/login/');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async isMyAccountVisible(): Promise<boolean> {
    return await this.myAccountTitle.isVisible();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}
