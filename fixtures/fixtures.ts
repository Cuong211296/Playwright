import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SigupPage';
import { AuthPanel } from '../pages/components/AuthPanel';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminShippingPage } from '../pages/admin/AdminShippingPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { Header } from '../pages/components/Header';
import { Footer } from '../pages/components/Footer';
import { AdminSidebar } from '../pages/components/AdminSidebar';
import { CartDrawer } from '../pages/components/CartDrawer';
import { Toast } from '../pages/components/Toast';
import { HomePage } from '../pages/shop/HomePage';
import { ProductDetailPage } from '../pages/shop/ProductDetailPage';
import { CartPage } from '../pages/shop/CartPage';
import { CheckoutPage } from '../pages/shop/CheckoutPage';
import { OrderPage } from '../pages/shop/OrderPage';
import { buildProduct } from '../data/productFactory';
import { buildShippingInfo } from '../data/checkoutFactory';

export const ADMIN_STATE = 'playwright/.auth/admin.json';
export const CUSTOMER_STATE = 'playwright/.auth/customer.json';

type Product = ReturnType<typeof buildProduct>;

type MyFixtures = {
  loginPage: LoginPage;
  openedLoginPage: LoginPage;
  openedSigupPage: SignupPage;
  authPanel: AuthPanel;
  header: Header;
  footer: Footer;
  toast: Toast;

  // Shop
  homePage: HomePage;
  productDetailPage: ProductDetailPage;
  cartDrawer: CartDrawer;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderPage: OrderPage;

  // Admin
  adminSidebar: AdminSidebar;
  adminProductPage: AdminProductsPage;
  adminOverviewPage: AdminOverviewPage;
  adminOrdersPage: AdminOrdersPage;
  adminShippingPage: AdminShippingPage;
  adminSettingsPage: AdminSettingsPage;

  // Tab trình duyệt riêng đã login admin (dùng khi test đang chạy bằng account customer)
  adminPage: Page;
  // Sản phẩm mới tạo bằng admin, có 2 biến thể, mỗi biến thể kho 50
  testProduct: Product;
  // Đơn COD do customer đặt (chứa testProduct size M x1)
  codOrder: { code: string; product: Product };
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

  header: async ({ page }, use) => {
    await use(new Header(page));
  },

  footer: async ({ page }, use) => {
    await use(new Footer(page));
  },

  toast: async ({ page }, use) => {
    await use(new Toast(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartDrawer: async ({ page }, use) => {
    await use(new CartDrawer(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  },

  adminSidebar: async ({ page }, use) => {
    await use(new AdminSidebar(page));
  },

  adminProductPage: async({page}, use) => {
    const adminProductPage = new AdminProductsPage(page);
    await use(adminProductPage);
  },

  adminOverviewPage: async ({ page }, use) => {
    await use(new AdminOverviewPage(page));
  },

  adminOrdersPage: async ({ page }, use) => {
    await use(new AdminOrdersPage(page));
  },

  adminShippingPage: async ({ page }, use) => {
    await use(new AdminShippingPage(page));
  },

  adminSettingsPage: async ({ page }, use) => {
    await use(new AdminSettingsPage(page));
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: ADMIN_STATE });
    await use(await context.newPage());
    await context.close();
  },

  testProduct: async ({ browser }, use) => {
    const product = buildProduct();
    product.variants = product.variants.map((variant) => ({ ...variant, stock: '50' }));

    // tạo bằng tab admin riêng, xong thì đóng lại
    const context = await browser.newContext({ storageState: ADMIN_STATE });
    const adminPage = await context.newPage();
    const productsPage = new AdminProductsPage(adminPage);
    const toast = new Toast(adminPage);

    await productsPage.goto();
    await productsPage.createProduct(product);
    await expect(toast.message('Đã tạo sản phẩm')).toBeVisible();
    await expect(toast.message(`Đã thêm ${product.variants.length} biến thể`)).toBeVisible();
    await context.close();

    await use(product);
  },

  codOrder: async ({ testProduct, cartPage, productDetailPage, checkoutPage, toast }, use) => {
    await cartPage.clear();
    await productDetailPage.goto(testProduct.slug);
    await productDetailPage.addToCart(testProduct.variants[0]);
    await expect(toast.message('Đã thêm vào giỏ hàng')).toBeVisible();

    await checkoutPage.goto();
    await checkoutPage.fillShippingInfo(buildShippingInfo());
    await checkoutPage.selectPayment('COD');
    const code = await checkoutPage.placeOrder();
    await checkoutPage.page.waitForURL(`**/orders/${code}`);

    await use({ code, product: testProduct });
  },
});

export { expect } from '@playwright/test';
