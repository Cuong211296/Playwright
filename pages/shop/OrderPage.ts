import { type Page, type Locator } from '@playwright/test';

// Gồm 2 màn hình: danh sách "/orders" và chi tiết "/orders/<mã đơn>"
export class OrderPage {
  readonly page: Page;
  readonly main: Locator;

  // Danh sách đơn
  readonly listHeading: Locator;

  // Chi tiết đơn
  readonly codeHeading: Locator;
  readonly successMessage: Locator;
  readonly pendingPaymentNotice: Locator;
  readonly payWithMomoButton: Locator;
  readonly progressSteps: Locator;
  readonly cancelledNotice: Locator;
  readonly items: Locator;
  readonly paymentSummary: Locator;
  readonly shippingAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.getByRole('main');

    this.listHeading = this.main.getByRole('heading', { name: 'Đơn hàng của tôi', level: 1 });

    this.codeHeading = this.main.getByRole('heading', { level: 1 });
    this.successMessage = this.main.getByRole('status').filter({ hasText: 'Đặt hàng thành công' });
    this.pendingPaymentNotice = this.main.getByText('Đơn hàng đang chờ thanh toán');
    this.payWithMomoButton = this.main.getByRole('button', { name: 'Thanh toán với MoMo' });
    this.progressSteps = this.main.getByRole('list', { name: 'Tiến trình đơn hàng' }).getByRole('listitem');
    this.cancelledNotice = this.main.getByText('Đơn hàng đã bị huỷ');
    this.items = this.main.getByRole('region', { name: /^Sản phẩm \(\d+\)$/ }).getByRole('listitem');
    this.paymentSummary = this.main.getByRole('region', { name: 'Thanh toán' });
    this.shippingAddress = this.main.getByRole('region', { name: 'Giao đến' });
  }

  async gotoList() {
    await this.page.goto('/orders');
  }

  async gotoDetail(code: string) {
    await this.page.goto(`/orders/${code}`);
  }

  orderLink(code: string) {
    return this.main.getByRole('link', { name: new RegExp(`^${code} `) });
  }

  // vd: progressStep('Chờ xác nhận') -> text "1Chờ xác nhận (hiện tại)", bước hiện tại có aria-current="step"
  progressStep(name: 'Chờ thanh toán' | 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao' | 'Hoàn thành') {
    return this.progressSteps.filter({ hasText: name });
  }
}
