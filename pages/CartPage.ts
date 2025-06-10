import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    public page: Page;
    private homePageLogo: Locator;
    private productRowLocator: Locator;
    private cartItemRowSelector: string;
    private cartItemQtyInputSelector: string;
    private proceedToCheckoutButton: Locator;
    private shippingAddressTitle: Locator;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private companyInput: Locator;
    private streetInput: Locator;
    private cityInput: Locator;
    private countryDropdown: Locator;
    private regionInput: Locator;
    private zipInput: Locator;
    private phoneInput: Locator;
    private shippingMethodsSection: Locator;
    private flatRateOption: Locator;
    private nextButton: Locator;
    private subtotalLocator: Locator;
    private orderTotalLocator: Locator;
    private placeOrderButton: Locator;
    private newAddressButton: Locator;
    private shipHereButton: Locator;
    private successMessageLocator: Locator;


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.homePageLogo = page.locator('a.logo[aria-label="store logo"] >> img[src*="logo.svg"]');
        this.productRowLocator = page.locator('tbody.cart.item tr.item-info');
        this.cartItemRowSelector = 'tr.item-info';
        this.cartItemQtyInputSelector = 'input[data-role="cart-item-qty"]';
        this.proceedToCheckoutButton = page.locator('button[data-role="proceed-to-checkout"]');
        this.shippingAddressTitle = this.page.locator('div.step-title[data-role="title"]', {
            hasText: 'Shipping Address'
        });
        this.firstNameInput = page.locator('input[name="firstname"]');
        this.lastNameInput = page.locator('input[name="lastname"]');
        this.companyInput = page.locator('input[name="company"]');
        this.streetInput = page.locator('input[name="street[0]"]');
        this.cityInput = page.locator('input[name="city"]');
        this.countryDropdown = page.locator('select[name="country_id"]');
        this.regionInput = page.locator('select[name="region_id"]');
        this.zipInput = page.locator('input[name="postcode"]');
        this.phoneInput = page.locator('input[name="telephone"]');
        this.shippingMethodsSection = page.locator('.checkout-shipping-method').first();
        this.flatRateOption = page.locator('input[value="flatrate_flatrate"]');
        this.nextButton = page.locator('button[data-role="opc-continue"]');
        this.subtotalLocator = page.locator('td.col.subtotal .cart-price .price');
        this.orderTotalLocator = page.locator('tr.grand.totals .amount .price');
        this.placeOrderButton = page.locator('button.action.primary.checkout');
        this.newAddressButton = page.locator('button.action.action-show-popup');
        this.shipHereButton = page.locator('button.action.primary.action-save-address');
        this.successMessageLocator = page.locator('.page-title-wrapper .page-title span.base');


    }

    async isCartEmpty(): Promise<boolean> {
        const emptyCartMessage = this.page.locator('div.empty.cart');
        return await emptyCartMessage.isVisible();
    }

    async getCartItemQuantityByProductName(productName: string): Promise<number> {
        const productRow = this.page.locator(this.cartItemRowSelector, {
            has: this.page.locator(`a:has-text("${productName}")`)
        });

        const quantityInput = productRow.locator(this.cartItemQtyInputSelector);
        const quantityValue = await quantityInput.getAttribute('value');

        const itemCount = parseInt(quantityValue || '0', 10);
        return isNaN(itemCount) ? 0 : itemCount;
    }

    async isProductInCart(size: string, color: string, quantity: number): Promise<boolean> {
        const matchedRow = this.productRowLocator
            .filter({ hasText: size })
            .filter({ hasText: color });

        const quantityInput = matchedRow.locator('input.input-text.qty');
        const actualQuantityStr = await quantityInput.getAttribute('value');

        if (actualQuantityStr === null) {
            return false;
        }

        const actualQuantity = parseInt(actualQuantityStr, 10);
        return actualQuantity === quantity;
    }

    async proceedToCheckout(): Promise<boolean> {
        await this.waitForLoadState();
        await this.proceedToCheckoutButton.click();
        await this.waitForLoadState();
        await this.isCurrentUrlEndingWith('/checkout/#shipping');
        return await this.shippingAddressTitle.isVisible();
    }

    async fillShippingDetails(
        firstName: string,
        lastName: string,
        company: string,
        street: string,
        city: string,
        region: string,
        zip: string,
        country: string,
        phone: string
    ): Promise<void> {
        // if the new address button is visible, click it to open the address form
        if (await this.newAddressButton.isVisible()) {
            await this.newAddressButton.click();
        } else {
            console.log("New address button is not visible, skipping action.");
        }
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.companyInput.fill(company);
        await this.streetInput.fill(street);
        await this.cityInput.fill(city);

        // Select country
        await this.countryDropdown.selectOption({ label: country });

        // Wait for region/state dropdown to update (some countries have dynamic regions)
        await this.regionInput.isVisible()
        await this.regionInput.selectOption({ label: region });

        await this.zipInput.fill(zip);
        await this.phoneInput.fill(phone);

        if (await this.shipHereButton.isVisible()) {
            await this.shipHereButton.click();
        } else {
            console.log("Ship here button is not visible, skipping action.");
        }

        await this.selectFlatRateShipping();
    }

    async checkAndFillShippingDetails(
        firstName: string,
        lastName: string,
        company: string,
        street: string,
        city: string,
        region: string,
        zip: string,
        country: string,
        phone: string
    ): Promise<void> {
        const shippingAddressItems = await this.page.locator('.shipping-address-item').all();

        if (shippingAddressItems.length === 0) {
            console.log("No saved addresses found, proceeding with new address entry.");
            await this.fillShippingDetails(firstName, lastName, company, street, city, region, zip, country, phone);
            return;
        }

        for (const item of shippingAddressItems) {
            const itemText = await item.innerText();
            if (
                itemText.includes(firstName) &&
                itemText.includes(lastName) &&
                itemText.includes(street) &&
                itemText.includes(city) &&
                itemText.includes(region) &&
                itemText.includes(zip) &&
                itemText.includes(country) &&
                itemText.includes(phone)
            ) {
                console.log("Matching address found, skipping new address entry.");

                // If the matching address is not selected, select it
                const selectButton = item.locator('.action-select-shipping-item');
                if (await selectButton.isVisible()) {
                    await selectButton.click();
                }
                await this.selectFlatRateShipping();
                return;
            }
        }

        console.log("No matching address found, proceeding with new address entry.");
        await this.fillShippingDetails(firstName, lastName, company, street, city, region, zip, country, phone);
    }

    async isFixedFlatRatePrice(expectedPrice: number): Promise<boolean> {
        const rows = this.shippingMethodsSection.locator('table.table-checkout-shipping-method tbody tr.row');

        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);

            // Get method, carrier, price text
            const methodTitle = await row.locator('td.col-method[id^="label_method_"]').innerText();
            const carrierTitle = await row.locator('td.col-carrier[id^="label_carrier_"]').innerText();
            const priceText = await row.locator('td.col-price span.price').first().innerText();

            // Parse price number from price text like "$5.00" => 5
            const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, ''));

            if (
                methodTitle.trim() === 'Fixed' &&
                carrierTitle.trim() === 'Flat Rate' &&
                priceNumber === expectedPrice
            ) {
                return true;
            }
        }
        return false;
    }

    async selectFlatRateShipping(): Promise<void> {

        await this.flatRateOption.isVisible()
        await this.flatRateOption.click();
    }

    async clickNextButton(): Promise<void> {

        if (await this.nextButton.isVisible()) {
            await this.nextButton.click();
        } else {
            throw new Error("Next button not found or not visible.");
        }
        this.waitForLoadState
    }

    async getItemSubtotal(): Promise<number> {
        if (await this.subtotalLocator.isVisible()) {
            const subtotalText = await this.subtotalLocator.innerText();
            return parseFloat(subtotalText.replace(/[^0-9.]/g, '')); // Extract numeric value
        } else {
            throw new Error("Subtotal price not found or not visible.");
        }
    }

    async verifyOrderTotal(price: number, shipping: number): Promise<boolean> {
        await this.waitForLoadState();
        await this.orderTotalLocator.isVisible()
        const orderTotalText = await this.orderTotalLocator.innerText();
        const orderTotal = parseFloat(orderTotalText.replace(/[^0-9.]/g, '')); // Extract numeric value

        // Compare the expected total with the displayed total
        return orderTotal === (price + shipping);
    }

    async verifyShippingDetails(
        firstName: string,
        lastName: string,
        company: string,
        street: string,
        city: string,
        region: string,
        zip: string,
        country: string,
        phone: string
    ): Promise<boolean> {
        // Locate the shipping details elements
        const firstNameLocator = this.page.locator('.shipping-information-content').locator(':text("' + firstName + '")');
        const lastNameLocator = this.page.locator('.shipping-information-content').locator(':text("' + lastName + '")');
        const streetLocator = this.page.locator('.shipping-information-content').locator(':text("' + street + '")');
        const cityLocator = this.page.locator('.shipping-information-content').locator(':text("' + city + '")');
        const regionLocator = this.page.locator('.shipping-information-content').locator(':text("' + region + '")');
        const zipLocator = this.page.locator('.shipping-information-content').locator(':text("' + zip + '")');
        const countryLocator = this.page.locator('.shipping-information-content').locator(':text("' + country + '")');
        const phoneLocator = this.page.locator('.shipping-information-content').locator('a[href="tel:' + phone + '"]');
        const shippingMethodLocator = this.page.locator('.ship-via .value');

        // Wait for elements to stabilize
        await this.page.waitForTimeout(500); // Adjust timeout if needed for stability

        // Validate shipping details
        const detailsMatch = (
            await firstNameLocator.isVisible() &&
            await lastNameLocator.isVisible() &&
            await streetLocator.isVisible() &&
            await cityLocator.isVisible() &&
            await regionLocator.isVisible() &&
            await zipLocator.isVisible() &&
            await countryLocator.isVisible() &&
            await phoneLocator.isVisible()
        );

        // Validate shipping method
        const shippingMethodText = await shippingMethodLocator.innerText();
        const shippingMatch = shippingMethodText.includes("Flat Rate - Fixed");

        return detailsMatch && shippingMatch;
    }


    async placeAnOrder(): Promise<string> {

        await this.placeOrderButton.isVisible()
        await this.placeOrderButton.click();
        await this.waitForLoadState();
        await this.page.waitForTimeout(10000);

        // Verify the success message
        (await this.successMessageLocator.innerText()).includes("Thank you for your purchase!");

        // Extract order ID directly from confirmation text
        const orderNumberLocator = this.page.locator('.checkout-success .order-number');
        if (await orderNumberLocator.isVisible()) {
            const orderText = await orderNumberLocator.innerText();
            const orderIdMatch = orderText.match(/\d+/); // Extract numeric order ID
            const orderId = orderIdMatch ? orderIdMatch[0] : '';

            // Verify confirmation email message
            const confirmationMessageLocator = this.page.locator('.checkout-success p:nth-of-type(2)');
            const confirmationMessage = await confirmationMessageLocator.innerText();
            if (!confirmationMessage.includes("We'll email you an order confirmation with details and tracking info.")) {
                throw new Error("Confirmation email message not found.");
            }

            return orderId;
        }

        throw new Error("Order ID not found in confirmation text.");
    }

    async clickOrderNumber(): Promise<void> {
        const orderLink = this.page.locator('a.order-number');
        await orderLink.isVisible()
        await orderLink.click();
        await this.waitForLoadState();
    }












}
