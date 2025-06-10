import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
    public page: Page;
    private searchInput: Locator;
    private addToCartButton: Locator;
    private colorOptionSelectorTemplate: string;
    private sizeOptionSelectorTemplate: string;
    private productItemsList: Locator;
    private productItemSelector: string;
    private productLinkSelector: string;
    private quantityInputSelector: Locator;
    private successMessageSelector: Locator;
    private cartButton: Locator;
    private viewCartButton: Locator;
    private wishlistButton: Locator;


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchInput = page.locator('input#search');
        this.productItemsList = this.page.locator('.product-item');
        // Templates with %s placeholders
        this.colorOptionSelectorTemplate = `.swatch-attribute.color .swatch-option[option-label="%s"]`;
        this.sizeOptionSelectorTemplate = `.swatch-attribute.size .swatch-option[option-label="%s"]`;
        this.addToCartButton = page.locator('button#product-addtocart-button');
        this.productItemSelector = 'li.item.product.product-item';
        this.productLinkSelector = 'a.product-item-link';
        this.quantityInputSelector = page.locator('input#qty');
        this.successMessageSelector = page.locator(`div[data-bind*="prepareMessageForHtml"]`);
        this.cartButton = page.locator('a.action.showcart');
        this.viewCartButton = page.locator('a.action.viewcart');
        this.wishlistButton = page.locator('a.action.towishlist');


    }

    async isSearchedItemVisible(itemName: string): Promise<boolean> {
        try {
            await expect(this.productItemsList).toContainText(itemName);
            return true;
        } catch {
            return false;
        }
    }

    async clickProductByName(productName: string): Promise<void> {
        const productLocator = this.page.locator(this.productItemSelector)
            .filter({ hasText: productName });

        const productLink = productLocator.locator(this.productLinkSelector);
        await productLink.first().click();
        await this.waitForLoadState();
    }

    async selectProductOptions(color: string, size: string, quantity: number): Promise<void> {
        const colorSelector = this.format(this.colorOptionSelectorTemplate, color);
        const sizeSelector = this.format(this.sizeOptionSelectorTemplate, size);

        const colorLocator = this.page.locator(colorSelector);
        const sizeLocator = this.page.locator(sizeSelector);

        await colorLocator.click();
        await sizeLocator.click();
        await this.quantityInputSelector.fill('');             // Clear the default value first
        await this.quantityInputSelector.fill(quantity.toString());
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.isVisible();
        await this.addToCartButton.click();
    }

    async isAddToCartSuccessful(productName: string): Promise<boolean> {
        const expectedText = `You added ${productName} to your shopping cart`;
        // Wait briefly to allow message to appear (adjust timeout as needed)
        await this.successMessageSelector.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);

        const messageText = await this.successMessageSelector.textContent();
        return messageText?.includes(expectedText) ?? false;
    }

    async openAndProceedToCart(): Promise<void> {

        await this.cartButton.click();
        await this.waitForLoadState();
        // Wait for the "View and Edit Cart" button to become visible in the minicart dropdown
        await this.viewCartButton.waitFor({ state: 'visible' });
        await this.viewCartButton.click();
        await this.isCurrentUrlEndingWith('**/checkout/cart/**');
    }

    async addToWishlist(): Promise<void> {
        await this.wishlistButton.isVisible()
        await this.wishlistButton.click()
        await this.waitForLoadState();
        await this.isCurrentUrlContaining("wishlist/index/index/wishlist_id/");
    }

}
