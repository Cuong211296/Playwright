import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  // 1. Khai báo: trang này có những gì
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  // 2. Gán locator: chỉ khai báo, CHƯA tìm phần tử ngay
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Tên đăng nhập');
    this.passwordInput = page.getByLabel('Mật khẩu', { exact: true });
    this.submitButton = page.getByRole('button', { name: 'Đăng nhập' });
  }

  // 3. Hành động
  async goto() {
    await this.page.goto('/');
    await this.page.getByText('Đăng nhập').click();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
