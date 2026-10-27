import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly items: Locator;
  readonly removeButtons: Locator;
  readonly emptyHeading: Locator;
  readonly continueShoppingLink: Locator;
  readonly summary: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Giỏ hàng', level: 1 });
    this.items = main.getByRole('region', { name: 'Sản phẩm trong giỏ' }).getByRole('listitem');
    this.removeButtons = main.getByRole('button', { name: /^Xoá .* khỏi giỏ hàng$/ });
    this.emptyHeading = main.getByRole('heading', { name: 'Giỏ hàng của bạn đang trống' });
    this.continueShoppingLink = main.getByRole('link', { name: 'Tiếp tục mua sắm' });
    this.summary = main.getByRole('complementary', { name: 'Tóm tắt đơn hàng' });
    this.checkoutButton = this.summary.getByRole('button', { name: 'Thanh toán' });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  item(productName: string) {
    return this.items.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
  }

  quantityInput(productName: string) {
    return this.item(productName).getByRole('textbox', { name: /^Số lượng/ });
  }

  async increase(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Tăng số lượng' }).click();
  }

  async decrease(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Giảm số lượng' }).click();
  }

  async remove(productName: string) {
    await this.item(productName).getByRole('button', { name: /^Xoá / }).click();
  }

  // Xoá hết sản phẩm để mỗi test bắt đầu với giỏ trống
  async clear() {
    await this.goto();
    // chờ trang load xong: hoặc có tóm tắt đơn, hoặc báo giỏ trống
    await expect(this.summary.or(this.emptyHeading)).toBeVisible();

    let count = await this.removeButtons.count();
    while (count > 0) {
      await this.removeButtons.first().click();
      await expect(this.removeButtons).toHaveCount(count - 1);
      count--;
    }
  }
}
