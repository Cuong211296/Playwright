import { test, expect } from '../../fixtures/fixtures';   // ← đổi chỗ import

test.describe('Login', () => {

  test('báo lỗi khi sai mật khẩu', async ({ openedLoginPage, page }) => {
    await openedLoginPage.login(process.env.ADMIN_USERNAME!, 'process.env.ADMIN_PASSWORD!');

    await expect(page.getByRole('alert')).toContainText(
      'Sai tên đăng nhập hoặc mật kh'
    );
  });

  test('báo lỗi khi bỏ trống username', async ({ openedLoginPage, page }) => {
    await openedLoginPage.login('', process.env.ADMIN_PASSWORD!);

    await expect(page.getByText('Vui lòng nhập tên đăng nhập')).toBeVisible();
  });

  test('báo lỗi khi bỏ trống password', async ({ openedLoginPage, page }) => {
    await openedLoginPage.login(process.env.ADMIN_USERNAME!, '');

    await expect(page.getByText('Vui lòng nhập mật khẩu')).toBeVisible();
  });

  //   test('login thành công với user hợp lệ', async ({ page }) => {
  //   await page.getByText('Đăng nhập').click();
  //   await page.getByLabel('Tên đăng nhập').fill('admin');
  //   await page.getByLabel('Mật khẩu', { exact: true }).fill('process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!');
  //   await page.getByRole('button', { name: 'Đăng nhập' }).click();
    test('login thành công với user hợp lệ', async ({ openedLoginPage, page }) => {
    await openedLoginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  });

  //   await expect(page).toHaveURL(/conjectural-margrett-nonsubversively.ngrok-free.dev/);
  //   await expect(page.locator('//*[@id="root"]/header/div/div/div/div/button/span[2]')).toHaveText('admin');
  //   await page.pause;
  // });
});
