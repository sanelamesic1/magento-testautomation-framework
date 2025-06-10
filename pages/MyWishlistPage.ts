import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyWishlistPage extends BasePage {
    readonly page: Page;
    private successMessageLocator: Locator;
    private itemLocator: string;
    private wishlistLink: Locator;
    private removeButtons: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.successMessageLocator = page.locator('.message-success.success.message');
        this.itemLocator = `.product-item-name a:has-text("%s")`;
        this.wishlistLink = page.locator('li.nav.item a:has-text("My Wish List")');
        this.removeButtons = page.locator('.actions-secondary .btn-remove.action.delete');
    }

    async verifyItemIsAddedToWishlist(): Promise<boolean> {

        // Wait for the success message to appear
        await this.successMessageLocator.isVisible({ timeout: 5000 });
        const successMessageText = await this.successMessageLocator.innerText();
        return successMessageText.includes("has been added to your Wish List");
    }

    async isItemDisplayedInWishlist(itemName: string): Promise<boolean> {
        const itemLocator = this.page.locator(this.format(this.itemLocator, itemName)).first();
        return await itemLocator.isVisible();
    }

    async removeAllWishlistItems(): Promise<void> {
        await this.wishlistLink.click();
        const removeButtons = this.page.locator('.actions-secondary .btn-remove.action.delete');

        // Check if there are any items to remove
        const itemCount = await removeButtons.count();
        if (itemCount === 0) {
            console.log("Wishlist is already empty.");
            return;
        }

        console.log(`Found ${itemCount} items in wishlist. Removing all...`);

        for (let i = 0; i < itemCount; i++) {
            // Click the first visible delete button
            await this.scrollPage();
            await removeButtons.nth(0).click();

            // Wait for page reload or confirmation
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(3000); // Short delay to stabilize UI
        }

        console.log("All items removed from the wishlist.");
    }

}
