import { test as setup, expect } from '../fixtures/fixtures';

const adminFile = 'playwright/.auth/admin.json';
const customerFile = 'playwright/.auth/customer.json';

setup('login admin', async ({ openedLoginPage, header, page }) => {
  await openedLoginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  await expect(header.userMenuButton(process.env.ADMIN_USERNAME!)).toBeVisible();

  await page.context().storageState({ path: adminFile });
});

setup('customer login', async ({ openedLoginPage, header, page }) => {
  await openedLoginPage.login(process.env.CUSTOMER_USERNAME!, process.env.CUSTOMER_PASSWORD!);
  await expect(header.userMenuButton(process.env.CUSTOMER_USERNAME!)).toBeVisible();

  await page.context().storageState({ path: customerFile });
});
