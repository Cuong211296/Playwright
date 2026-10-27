import { test, expect } from '../../fixtures/fixtures';

const expectedFooter = `
- heading "Mua sắm" [level=2]
- list:
  - listitem:
    - link "Tất cả sản phẩm"
  - listitem:
    - link "Giỏ hàng"
  - listitem:
    - link "Đơn hàng của tôi"
- heading "Hỗ trợ" [level=2]
- list:
  - listitem: Đổi trả miễn phí trong 30 ngày
  - listitem: Giao hàng toàn quốc 2–5 ngày
  - listitem: Hướng dẫn chọn size
- heading "Liên hệ" [level=2]
- list:
  - listitem: 339 Lê Văn Sỹ, Quận 3, TP Hồ Chí Minh
  - listitem: Hotline 1900 0000 (8:00 – 21:00)
  - listitem: hotro@quinibear.vn
- paragraph: © 2026 Quini Bear. Mọi quyền được bảo lưu.
- list "Phương thức thanh toán":
  - listitem: MoMo
  - listitem: COD
`;

test.describe('Footer', () => {
  test.use({ storageState: 'playwright/.auth/customer.json' });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('hiển thị đúng nội dung', async ({ footer }) => {
    await expect(footer.root).toMatchAriaSnapshot(expectedFooter);
  });

  test('link Giỏ hàng mở trang giỏ hàng', async ({ footer, cartPage, page }) => {
    await footer.link('Giỏ hàng').click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartPage.heading).toBeVisible();
  });

  test('link Đơn hàng của tôi mở trang đơn hàng', async ({ footer, orderPage, page }) => {
    await footer.link('Đơn hàng của tôi').click();

    await expect(page).toHaveURL(/\/orders$/);
    await expect(orderPage.listHeading).toBeVisible();
  });
});
