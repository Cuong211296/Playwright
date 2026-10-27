import { type Page, type Locator, expect } from '@playwright/test';

type CheckoutField = 'receiverName' | 'phone' | 'email' | 'province' | 'district' | 'ward' | 'address';

type ShippingInfo = {
  receiverName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note?: string;
};

export class CheckoutPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyCartHeading: Locator;

  // 1. Thông tin giao hàng
  readonly receiverNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly provinceSelect: Locator;
  readonly districtSelect: Locator;
  readonly wardSelect: Locator;
  readonly addressInput: Locator;
  readonly noteInput: Locator;

  // 2. Phương thức thanh toán
  readonly momoRadio: Locator;
  readonly codRadio: Locator;

  // Tóm tắt bên phải
  readonly summary: Locator;
  readonly summaryItems: Locator;
  readonly shippingFee: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Hoàn tất đơn hàng' });
    this.emptyCartHeading = main.getByRole('heading', { name: 'Giỏ hàng trống' });

    this.receiverNameInput = main.getByRole('textbox', { name: 'Họ tên người nhận' });
    this.phoneInput = main.getByRole('textbox', { name: 'Số điện thoại' });
    this.emailInput = main.getByRole('textbox', { name: 'Email nhận xác nhận đơn' });
    this.provinceSelect = main.getByRole('combobox', { name: 'Tỉnh/Thành' });
    this.districtSelect = main.getByRole('combobox', { name: 'Quận/Huyện' });
    this.wardSelect = main.getByRole('combobox', { name: 'Phường/Xã' });
    this.addressInput = main.getByRole('textbox', { name: 'Địa chỉ' });
    this.noteInput = main.getByRole('textbox', { name: 'Ghi chú (không bắt buộc)' });

    this.momoRadio = main.getByRole('radio', { name: /^Ví MoMo/ });
    this.codRadio = main.getByRole('radio', { name: /^Thanh toán khi nhận hàng/ });

    this.summary = main.getByRole('complementary', { name: 'Đơn hàng của bạn' });
    this.summaryItems = this.summary.getByRole('listitem');
    // chỉ hiện khi đã chọn đủ địa chỉ và tính được phí
    this.shippingFee = this.summary.getByRole('status');
    // tên nút đổi theo phương thức: "Thanh toán với MoMo" / "Đặt hàng (COD)"
    this.placeOrderButton = this.summary.getByRole('button', { name: /^(Thanh toán với MoMo|Đặt hàng \(COD\))$/ });
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  errorOf(field: CheckoutField) {
    return this.page.locator(`#co-${field}-msg`);
  }

  async fillShippingInfo(info: ShippingInfo) {
    await this.receiverNameInput.fill(info.receiverName);
    await this.phoneInput.fill(info.phone);
    await this.emailInput.fill(info.email);
    // Quận/Phường load sau khi chọn cấp trên, selectOption tự chờ option xuất hiện
    await this.provinceSelect.selectOption(info.province);
    await this.districtSelect.selectOption(info.district);
    await this.wardSelect.selectOption(info.ward);
    await this.addressInput.fill(info.address);
    if (info.note) {
      await this.noteInput.fill(info.note);
    }
  }

  async selectPayment(method: 'COD' | 'MOMO') {
    if (method === 'COD') {
      await this.codRadio.check();
    } else {
      await this.momoRadio.check();
    }
  }

  // Đặt hàng và trả về mã đơn (vd: DH2610276B8SCQ) lấy từ response của API tạo đơn
  async placeOrder() {
    await expect(this.shippingFee).toBeVisible();

    const responsePromise = this.page.waitForResponse(
      (res) => res.url().endsWith('/identity/orders') && res.request().method() === 'POST'
    );
    await this.placeOrderButton.click();
    const body = await (await responsePromise).json();
    return body.result.code as string;
  }
}
