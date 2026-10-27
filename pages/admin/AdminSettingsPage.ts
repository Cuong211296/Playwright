import { type Page, type Locator } from '@playwright/test';

export class AdminSettingsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly form: Locator;

  // Thông tin cửa hàng
  readonly shopNameInput: Locator;
  readonly phoneInput: Locator;

  // Địa chỉ lấy hàng
  readonly provinceSelect: Locator;
  readonly districtSelect: Locator;
  readonly wardSelect: Locator;
  readonly streetInput: Locator;

  readonly saveButton: Locator;
  readonly lastUpdated: Locator;

  // Đơn vị vận chuyển
  readonly carriers: Locator;
  readonly ghnSwitch: Locator;
  readonly ghtkSwitch: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Cài đặt cửa hàng', level: 1 });
    this.form = main.getByRole('form', { name: 'Cài đặt cửa hàng' });

    this.shopNameInput = this.form.getByRole('textbox', { name: 'Tên cửa hàng' });
    this.phoneInput = this.form.getByRole('textbox', { name: 'Số điện thoại (không bắt buộc)' });

    this.provinceSelect = this.form.getByRole('combobox', { name: 'Tỉnh/Thành' });
    this.districtSelect = this.form.getByRole('combobox', { name: 'Quận/Huyện' });
    this.wardSelect = this.form.getByRole('combobox', { name: 'Phường/Xã' });
    this.streetInput = this.form.getByRole('textbox', { name: 'Số nhà, tên đường (không bắt buộc)' });

    this.saveButton = this.form.getByRole('button', { name: 'Lưu' });
    this.lastUpdated = this.form.getByText(/^Cập nhật lần cuối/);

    this.carriers = this.form.getByRole('complementary', { name: 'Đơn vị vận chuyển' });
    this.ghnSwitch = this.carriers.getByRole('switch', { name: 'Bật GHN' });
    this.ghtkSwitch = this.carriers.getByRole('switch', { name: 'Bật GHTK' });
  }

  async goto() {
    await this.page.goto('/admin/settings');
  }
}
