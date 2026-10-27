import { type Page, type Locator } from '@playwright/test';

type StatusTab = 'Tất cả' | 'Chờ thanh toán' | 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Đã huỷ';

export class AdminOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly orderRows: Locator;

  // Popup xác nhận huỷ đơn
  readonly cancelDialog: Locator;
  readonly keepOrderButton: Locator;
  readonly confirmCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Đơn hàng', level: 1 });
    // chỉ lấy dòng đơn hàng (có nút Xem/Ẩn chi tiết), bỏ dòng tiêu đề và dòng chi tiết mở rộng
    this.orderRows = main.getByRole('table').getByRole('row')
      .filter({ has: page.getByRole('button', { name: /(Xem|Ẩn) chi tiết$/ }) });

    this.cancelDialog = page.getByRole('dialog', { name: /^Huỷ đơn .*\?$/ });
    this.keepOrderButton = this.cancelDialog.getByRole('button', { name: 'Giữ đơn' });
    this.confirmCancelButton = this.cancelDialog.getByRole('button', { name: 'Huỷ đơn', exact: true });
  }

  async goto() {
    await this.page.goto('/admin/orders');
  }

  statusTab(name: StatusTab) {
    return this.page.getByRole('tablist', { name: 'Lọc theo trạng thái đơn' }).getByRole('tab', { name, exact: true });
  }

  async filterByStatus(name: StatusTab) {
    await this.statusTab(name).click();
  }

  orderRow(code: string) {
    return this.orderRows.filter({ has: this.page.getByRole('button', { name: new RegExp(`^${code} `) }) });
  }

  detailsToggle(code: string) {
    return this.orderRow(code).getByRole('button', { name: new RegExp(`^${code} `) });
  }

  // Dòng chi tiết hiện ngay dưới dòng đơn sau khi bấm "Xem chi tiết"
  detailsRow(code: string) {
    return this.orderRow(code).locator('xpath=following-sibling::tr[1]');
  }

  confirmButton(code: string) {
    return this.page.getByRole('button', { name: `Xác nhận đơn ${code}`, exact: true });
  }

  shipButton(code: string) {
    return this.page.getByRole('button', { name: `Giao hàng ${code}`, exact: true });
  }

  completeButton(code: string) {
    return this.page.getByRole('button', { name: `Hoàn thành ${code}`, exact: true });
  }

  cancelButton(code: string) {
    return this.page.getByRole('button', { name: `Huỷ đơn ${code}`, exact: true });
  }

  async openDetails(code: string) {
    await this.detailsToggle(code).click();
  }

  async confirm(code: string) {
    await this.confirmButton(code).click();
  }

  async ship(code: string) {
    await this.shipButton(code).click();
  }

  async complete(code: string) {
    await this.completeButton(code).click();
  }

  async cancel(code: string) {
    await this.cancelButton(code).click();
    await this.confirmCancelButton.click();
  }
}
