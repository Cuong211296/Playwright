import { test, expect } from '../../fixtures/fixtures';

// Chỉ đọc và tìm kiếm, KHÔNG bấm Lưu/Thêm: bảng phí đang dùng thật khi khách đặt hàng.
test.describe('Admin - Phí vận chuyển', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ adminShippingPage }) => {
    await adminShippingPage.goto();
  });

  test('hiển thị bảng phí theo tỉnh/thành', async ({ adminShippingPage }) => {
    await expect(adminShippingPage.heading).toBeVisible();
    await expect(adminShippingPage.resultCount).toHaveText(/^\d+ tỉnh\/thành$/);
    await expect(adminShippingPage.rateRow('Hà Nội')).toBeVisible();
    await expect(adminShippingPage.feeInput('Hà Nội')).toHaveValue(/^\d+$/);
    await expect(adminShippingPage.saveButton('Hà Nội')).toBeVisible();
  });

  test('tìm tỉnh/thành', async ({ adminShippingPage }) => {
    await adminShippingPage.search('Hà Nội');

    await expect(adminShippingPage.resultCount).toHaveText(/^\d+ \/ \d+ tỉnh\/thành$/);
    await expect(adminShippingPage.rateRow('Hà Nội')).toBeVisible();
    await expect(adminShippingPage.rateRow('Cà Mau')).toBeHidden();
  });

  test('báo không tìm thấy, bấm xoá tìm kiếm thì hiện lại tất cả', async ({ adminShippingPage }) => {
    await adminShippingPage.search('khong-co-tinh-nay');

    await expect(adminShippingPage.resultCount).toHaveText(/^0 \/ \d+ tỉnh\/thành$/);
    await expect(adminShippingPage.rateRows).toHaveCount(0);
    await expect(adminShippingPage.emptyState).toBeVisible();

    await adminShippingPage.clearSearchButton.click();
    await expect(adminShippingPage.searchBox).toHaveValue('');
    await expect(adminShippingPage.resultCount).toHaveText(/^\d+ tỉnh\/thành$/);
  });
});
