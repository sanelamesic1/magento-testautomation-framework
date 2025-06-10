import { Page } from '@playwright/test';

export class BasePage {
    public page: Page;

    constructor(page: Page) {
        this.page = page;

    }

    async isCurrentUrlEndingWith(expectedExtension: string): Promise<boolean> {
        return this.page.url().endsWith(expectedExtension);
    }

    async isCurrentUrlContaining(expectedSubstring: string): Promise<boolean> {
        return this.page.url().includes(expectedSubstring);
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

    // String formatter
    public format(template: string, ...args: string[]): string {
        let i = 0;
        return template.replace(/%s/g, () => args[i++]);
    }

    async waitForLoadState(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async scrollPage(scrollAmount: number = 1000): Promise<void> {
        await this.page.evaluate((amount) => {
            window.scrollBy({ top: amount, behavior: 'smooth' });
        }, scrollAmount);

        await this.page.waitForTimeout(500); // Short delay for UI stabilization
    }

}
