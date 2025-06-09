import { Page } from '@playwright/test';

export class BasePage {
    public page: Page;

    constructor(page: Page) {
        this.page = page;

    }

    async isCurrentUrlEndingWith(expectedExtension: string): Promise<boolean> {
        return this.page.url().endsWith(expectedExtension);        
    }

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }
    async getTitle(): Promise<string> {
        return await this.page.title();
    }
    async getUrl(): Promise<string> {   
        return this.page.url();
    }
    async waitForSelector(selector: string): Promise<void> {
        await this.page.waitForSelector(selector, { state: 'visible' });
    }
    async click(selector: string): Promise<void> {
        const element = this.page.locator(selector);
        await element.click();
    }
    async fill(selector: string, text: string): Promise<void> {             
        const element = this.page.locator(selector);
        await element.fill(text);
    }
    async getText(selector: string): Promise<string> {
        const element = this.page.locator(selector);
        return await element.textContent() || '';
    }
    async isVisible(selector: string): Promise<boolean> {
        const element = this.page.locator(selector);
        return await element.isVisible();
    }

}
