import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyOrdersPage extends BasePage {
    readonly page: Page;


    constructor(page: Page) {
        super(page);
        this.page = page;


    }

    async verifyOrderDetails(expectedOrderId: string, expectedStatus: string): Promise<boolean> {
        const orderIdLocator = this.page.locator('.page-title-wrapper .page-title span.base');
        const orderStatusLocator = this.page.locator('.order-status');
        await orderIdLocator.isVisible();

        // Extract order ID from text
        const orderIdText = await orderIdLocator.innerText();
        const orderIdMatch = orderIdText.match(/Order # (\d+)/);
        const actualOrderId = orderIdMatch ? orderIdMatch[1] : null;

        // Ensure order status element is visible
        if (!(await orderStatusLocator.isVisible())) {
            throw new Error("Order status element not found or not visible.");
        }

        // Extract order status from text
        const actualStatus = await orderStatusLocator.innerText();

        // Compare values and return true if they match, otherwise return false
        return actualOrderId === expectedOrderId && actualStatus === expectedStatus;
    }

}
