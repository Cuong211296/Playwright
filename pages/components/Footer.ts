import { type Page, type Locator } from '@playwright/test';

export class Footer {
  readonly page: Page;
  readonly root: Locator;
  readonly paymentMethods: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('contentinfo');
    this.paymentMethods = this.root.getByRole('list', { name: 'Phương thức thanh toán' });
  }

  link(name: 'Tất cả sản phẩm' | 'Giỏ hàng' | 'Đơn hàng của tôi') {
    return this.root.getByRole('link', { name, exact: true });
  }
}
