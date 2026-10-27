import { type Page, type Locator } from '@playwright/test';

type RangeName = 'Hôm nay' | '7 ngày' | '30 ngày' | 'Tháng này' | 'Năm nay';
type GroupByName = 'Ngày' | 'Tháng' | 'Năm';

export class AdminOverviewPage {
  readonly page: Page;
  readonly heading: Locator;

  // Bộ lọc thời gian
  readonly rangeGroup: Locator;
  readonly groupByGroup: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly refreshButton: Locator;

  // Số liệu
  readonly kpiRegion: Locator;
  readonly kpiHeadings: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { name: 'Tổng quan', level: 1 });

    const filter = main.getByRole('region', { name: 'Bộ lọc thời gian' });
    // "Tháng" và "Tháng này" trùng chữ -> phải khoanh vùng theo group
    this.rangeGroup = filter.getByRole('group', { name: 'Khoảng thời gian' });
    this.groupByGroup = filter.getByRole('group', { name: 'Nhóm theo' });
    this.fromDateInput = filter.getByRole('textbox', { name: 'Từ ngày' });
    this.toDateInput = filter.getByRole('textbox', { name: 'Đến ngày' });
    this.refreshButton = filter.getByRole('button', { name: 'Làm mới' });

    this.kpiRegion = main.getByRole('region', { name: 'Chỉ số chính' });
    this.kpiHeadings = this.kpiRegion.getByRole('heading');
  }

  async goto() {
    await this.page.goto('/admin/overview');
  }

  rangeButton(name: RangeName) {
    return this.rangeGroup.getByRole('button', { name, exact: true });
  }

  groupByButton(name: GroupByName) {
    return this.groupByGroup.getByRole('button', { name, exact: true });
  }

  async selectRange(name: RangeName) {
    await this.rangeButton(name).click();
  }

  async selectGroupBy(name: GroupByName) {
    await this.groupByButton(name).click();
  }

  // Mỗi biểu đồ là 1 figure, vd: chart('Trạng thái đơn hàng')
  chart(name: string) {
    return this.page.getByRole('figure', { name });
  }

  // Nút "Xem dạng bảng" <-> "Xem biểu đồ" (cùng 1 nút, chỉ đổi chữ)
  chartToggle(name: string) {
    return this.chart(name).getByRole('button', { name: 'Xem dạng bảng' });
  }

  chartTable(name: string) {
    return this.chart(name).getByRole('table');
  }
}
