import { type Page, type Locator } from '@playwright/test';

export class AdminSidebar {
  readonly page: Page;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole('navigation', { name: 'Quản trị' });
  }

  link(name: 'Tổng quan' | 'Sản phẩm' | 'Đơn hàng' | 'Phí vận chuyển' | 'Cài đặt cửa hàng') {
    return this.nav.getByRole('link', { name, exact: true });
  }

  async goTo(name: 'Tổng quan' | 'Sản phẩm' | 'Đơn hàng' | 'Phí vận chuyển' | 'Cài đặt cửa hàng') {
    await this.link(name).click();
  }
}
