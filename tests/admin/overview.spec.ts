import { test, expect } from '../../fixtures/fixtures';
import { toISODate } from '../../utils/format';

test.describe('Admin - Tổng quan', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ adminOverviewPage }) => {
    await adminOverviewPage.goto();
  });

  test('mặc định xem 30 ngày, nhóm theo ngày', async ({ adminOverviewPage }) => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 29);

    await expect(adminOverviewPage.rangeButton('30 ngày')).toHaveAttribute('aria-pressed', 'true');
    await expect(adminOverviewPage.groupByButton('Ngày')).toHaveAttribute('aria-pressed', 'true');
    await expect(adminOverviewPage.fromDateInput).toHaveValue(toISODate(from));
    await expect(adminOverviewPage.toDateInput).toHaveValue(toISODate(today));
  });

  test('chọn "7 ngày" thì đổi khoảng ngày', async ({ adminOverviewPage }) => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 6);

    await adminOverviewPage.selectRange('7 ngày');

    await expect(adminOverviewPage.rangeButton('7 ngày')).toHaveAttribute('aria-pressed', 'true');
    await expect(adminOverviewPage.rangeButton('30 ngày')).toHaveAttribute('aria-pressed', 'false');
    await expect(adminOverviewPage.fromDateInput).toHaveValue(toISODate(from));
    await expect(adminOverviewPage.toDateInput).toHaveValue(toISODate(today));
  });

  test('chọn "Hôm nay" thì từ ngày = đến ngày = hôm nay', async ({ adminOverviewPage }) => {
    await adminOverviewPage.selectRange('Hôm nay');

    const today = toISODate(new Date());
    await expect(adminOverviewPage.fromDateInput).toHaveValue(today);
    await expect(adminOverviewPage.toDateInput).toHaveValue(today);
  });

  test('đổi nhóm theo tháng', async ({ adminOverviewPage }) => {
    await adminOverviewPage.selectGroupBy('Tháng');

    await expect(adminOverviewPage.groupByButton('Tháng')).toHaveAttribute('aria-pressed', 'true');
    await expect(adminOverviewPage.groupByButton('Ngày')).toHaveAttribute('aria-pressed', 'false');
  });

  test('hiển thị đủ 8 chỉ số chính', async ({ adminOverviewPage }) => {
    await expect(adminOverviewPage.kpiHeadings).toHaveText([
      'Doanh thu',
      'Lợi nhuận gộp',
      'Đơn đã thanh toán',
      'Đơn hàng mới',
      'Giá trị đơn trung bình',
      'Sản phẩm đã bán',
      'Khách hàng mới',
      'Tỷ lệ huỷ đơn',
    ]);
  });

  test('biểu đồ trạng thái đơn chuyển sang dạng bảng', async ({ adminOverviewPage }) => {
    const chart = 'Trạng thái đơn hàng';

    await adminOverviewPage.chartToggle(chart).click();

    await expect(adminOverviewPage.chartToggle(chart)).toHaveAttribute('aria-pressed', 'true');
    await expect(adminOverviewPage.chartToggle(chart)).toHaveText('Xem biểu đồ');
    await expect(adminOverviewPage.chartTable(chart).getByRole('rowheader')).toHaveText([
      'Chờ thanh toán',
      'Chờ xác nhận',
      'Đã xác nhận',
      'Đang giao',
      'Hoàn thành',
      'Đã huỷ',
    ]);
  });
});
