import { type Page, type Locator } from '@playwright/test';

export class AdminShippingPage {
  readonly page: Page;
  readonly heading: Locator;

  // Form thêm tỉnh/thành
  readonly newProvinceInput: Locator;
  readonly newFeeInput: Locator;
  readonly addButton: Locator;

  // Tìm kiếm + bảng phí
  readonly searchBox: Locator;
  readonly clearSearchButton: Locator;
  readonly resultCount: Locator;
  readonly rateRows: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Phí vận chuyển', level: 1 });

    const addForm = main.getByRole('form', { name: 'Thêm tỉnh/thành' });
    this.newProvinceInput = addForm.getByRole('textbox', { name: 'Tỉnh/Thành mới' });
    this.newFeeInput = addForm.getByRole('spinbutton', { name: 'Phí (₫)' });
    this.addButton = addForm.getByRole('button', { name: 'Thêm' });

    this.searchBox = main.getByRole('searchbox', { name: 'Tìm tỉnh/thành' });
    // nút X trong ô tìm kiếm (khi không có kết quả còn 1 nút "Xoá tìm kiếm" nữa ở dưới)
    this.clearSearchButton = main.getByRole('search').getByRole('button', { name: 'Xoá tìm kiếm' });
    // "34 tỉnh/thành" hoặc khi tìm: "8 / 34 tỉnh/thành"
    this.resultCount = main.getByRole('status');
    // dòng dữ liệu là dòng có ô nhập phí (bỏ dòng tiêu đề)
    this.rateRows = main.getByRole('table').getByRole('row').filter({ has: page.getByRole('spinbutton') });
    this.emptyState = main.getByText('Không tìm thấy tỉnh/thành');
  }

  async goto() {
    await this.page.goto('/admin/shipping');
  }

  rateRow(province: string) {
    return this.rateRows.filter({ has: this.page.getByRole('cell', { name: province, exact: true }) });
  }

  feeInput(province: string) {
    return this.page.getByRole('spinbutton', { name: `Phí vận chuyển ${province} (₫)`, exact: true });
  }

  saveButton(province: string) {
    return this.page.getByRole('button', { name: `Lưu phí ${province}`, exact: true });
  }

  async search(keyword: string) {
    await this.searchBox.fill(keyword);
  }
}
