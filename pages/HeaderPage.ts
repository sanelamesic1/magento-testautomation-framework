import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderPage extends BasePage {
    readonly page: Page;
    readonly searchInput: Locator;


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchInput = page.locator('input#search');

    }

    async enterSearchText(searchText: string): Promise<void> {
        await this.searchInput.fill('');            // Clear any existing text
        await this.searchInput.type(searchText);    
        await this.searchInput.press('Enter');      
    }

}
