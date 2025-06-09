import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyAccountPage extends BasePage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly contactBox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.emailInput = page.locator('#email');
        this.contactBox = page.locator('div.box-information', { hasText: 'Contact Information' });

    }

    async isContactNameVisible(name: string): Promise<boolean> {
        return await this.contactBox.locator(`text=${name}`).isVisible();
    }

}
