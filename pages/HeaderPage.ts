import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderPage extends BasePage {
    public page: Page;
    private searchInput: Locator;
    private homePageLogo: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchInput = page.locator('input#search');
        this.homePageLogo = page.locator('a.logo[aria-label="store logo"] >> img[src*="logo.svg"]');

    }

    async enterSearchText(searchText: string): Promise<void> {
        await this.searchInput.evaluate((el: HTMLInputElement) => el.value = '');            // Clear any existing text
        await this.searchInput.type(searchText);    
        await this.searchInput.press('Enter');      
    }

    async clickStoreLogo() {
    await this.homePageLogo.click();
  }

}
