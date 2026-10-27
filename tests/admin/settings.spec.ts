import { test, expect } from '../../fixtures/fixtures';

// KHÔNG bấm Lưu: địa chỉ lấy hàng dùng để tính phí ship thật.
test.describe('Admin - Cài đặt cửa hàng', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ adminSettingsPage }) => {
    await adminSettingsPage.goto();
  });

  test('hiển thị đủ các phần cài đặt', async ({ adminSettingsPage }) => {
    await expect(adminSettingsPage.heading).toBeVisible();
    await expect(adminSettingsPage.shopNameInput).toBeVisible();
    await expect(adminSettingsPage.phoneInput).toBeVisible();
    await expect(adminSettingsPage.provinceSelect).toBeVisible();
    await expect(adminSettingsPage.streetInput).toBeVisible();
    await expect(adminSettingsPage.saveButton).toBeVisible();
    await expect(adminSettingsPage.ghnSwitch).toBeVisible();
    await expect(adminSettingsPage.ghtkSwitch).toBeVisible();
  });

  test('chọn tỉnh rồi mới chọn được quận, chọn quận rồi mới chọn được phường', async ({ adminSettingsPage }) => {
    await adminSettingsPage.provinceSelect.selectOption('Hồ Chí Minh');
    await expect(adminSettingsPage.districtSelect).toBeEnabled();

    await adminSettingsPage.districtSelect.selectOption('Quận 3');
    await expect(adminSettingsPage.wardSelect).toBeEnabled();
  });
});
