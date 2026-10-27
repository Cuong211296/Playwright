import { test, expect } from '../../fixtures/fixtures';

const menus = [
  { name: 'Tổng quan', url: /\/admin\/overview$/ },
  { name: 'Sản phẩm', url: /\/admin\/products$/ },
  { name: 'Đơn hàng', url: /\/admin\/orders$/ },
  { name: 'Phí vận chuyển', url: /\/admin\/shipping$/ },
  { name: 'Cài đặt cửa hàng', url: /\/admin\/settings$/ },
] as const;

test.describe('Menu quản trị', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('vào /admin thì mở trang Tổng quan', async ({ page, adminOverviewPage }) => {
    await expect(page).toHaveURL(/\/admin\/overview$/);
    await expect(adminOverviewPage.heading).toBeVisible();
  });

  // 1 vòng lặp sinh ra 5 test, mỗi menu 1 test
  for (const menu of menus) {
    test(`menu "${menu.name}" mở đúng trang`, async ({ adminSidebar, page }) => {
      await adminSidebar.goTo(menu.name);

      await expect(page).toHaveURL(menu.url);
      await expect(page.getByRole('heading', { name: menu.name, level: 1 })).toBeVisible();
    });
  }
});
