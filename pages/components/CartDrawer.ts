import { type Page, type Locator } from '@playwright/test';

// Popup giỏ hàng mở ra khi bấm icon giỏ hàng trên header
export class CartDrawer {
  readonly page: Page;
  readonly root: Locator;
  readonly closeButton: Locator;
  readonly items: Locator;
  readonly emptyHeading: Locator;
  readonly checkoutButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // tên dialog là "Giỏ hàng" hoặc "Giỏ hàng (2)"
    this.root = page.getByRole('dialog', { name: /^Giỏ hàng/ });
    this.closeButton = this.root.getByRole('button', { name: 'Đóng' });
    this.items = this.root.getByRole('listitem');
    this.emptyHeading = this.root.getByRole('heading', { name: 'Giỏ hàng đang trống' });
    this.checkoutButton = this.root.getByRole('button', { name: 'Thanh toán' });
    this.viewCartLink = this.root.getByRole('link', { name: 'Xem giỏ hàng' });
  }

  item(productName: string) {
    return this.items.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
  }
}
