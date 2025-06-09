import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
    readonly page: Page;
    readonly searchInput: Locator;


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchInput = page.locator('input#search');

    }

    async isSearchedItemVisible(itemName: string): Promise<boolean> {
        const productItems = this.page.locator('.product-item');
        try {
            await expect(productItems).toContainText(itemName);
            return true;
        } catch {
            return false;
        }
    }


}
