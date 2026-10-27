import { test, expect } from '../../fixtures/fixtures';

// Chỉ đọc danh sách, KHÔNG bấm xác nhận/huỷ: ở đây có đơn thật của khách.
// Test xử lý đơn nằm ở tests/purchase/admin-orders.spec.ts (chỉ đụng đơn do test tạo).
test.describe('Admin - Đơn hàng', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ adminOrdersPage }) => {
    await adminOrdersPage.goto();
  });

  test('mặc định hiện tab "Tất cả"', async ({ adminOrdersPage }) => {
    await expect(adminOrdersPage.heading).toBeVisible();
    await expect(adminOrdersPage.statusTab('Tất cả')).toHaveAttribute('aria-selected', 'true');
  });

  for (const status of ['Chờ xác nhận', 'Hoàn thành', 'Đã huỷ'] as const) {
    test(`lọc tab "${status}" chỉ hiện đơn ${status}`, async ({ adminOrdersPage }) => {
      await adminOrdersPage.filterByStatus(status);

      await expect(adminOrdersPage.statusTab(status)).toHaveAttribute('aria-selected', 'true');
      // không còn dòng nào khác trạng thái đang lọc
      await expect(adminOrdersPage.orderRows.filter({ hasNotText: status })).toHaveCount(0);
    });
  }
});
