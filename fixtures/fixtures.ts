import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SigupPage';
import { AuthPanel } from '../pages/components/AuthPanel';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { Header } from '../pages/components/Header';
import { AdminSidebar } from '../pages/components/AdminSidebar';
import { Toast } from '../pages/components/Toast';

type MyFixtures = {
  loginPage: LoginPage;
  openedLoginPage: LoginPage;
  openedSigupPage: SignupPage;
  authPanel: AuthPanel;
  adminProductPage: AdminProductsPage;
  header: Header;
  adminSidebar: AdminSidebar;
  toast: Toast;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  openedLoginPage: async ({page}, use) => {
    const openedLoginPage = new LoginPage(page);
    await openedLoginPage.goto();
    await use(openedLoginPage);
  },

  openedSigupPage: async ({page}, use) => {
    const openedSigupPage = new SignupPage(page);
    await openedSigupPage.goToSignup();
    await use(openedSigupPage);

  },
  
  authPanel: async({page}, use) => {
    await use(new AuthPanel(page));
  },

  adminProductPage: async({page}, use) => {
    const adminProductPage = new AdminProductsPage(page);
    await use(adminProductPage);
  },

  header: async ({ page }, use) => {
    await use(new Header(page));
  },

  adminSidebar: async ({ page }, use) => {
    await use(new AdminSidebar(page));
  },

  toast: async ({ page }, use) => {
    await use(new Toast(page));
  },




  
});

export { expect } from '@playwright/test';
