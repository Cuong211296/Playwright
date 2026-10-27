import { test, expect } from '../../fixtures/fixtures';
import { formatVnd } from '../../utils/format';

// Project "purchase": đã login customer sẵn (xem playwright.config.ts)
test.describe('Giỏ hàng', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.clear();
  });

  test('giỏ hàng trống', async ({ cartPage, header, cartDrawer }) => {
    await expect(cartPage.emptyHeading).toBeVisible();
    await expect(cartPage.continueShoppingLink).toBeVisible();
    await expect(header.cartButton).toHaveAccessibleName('Giỏ hàng');

    await header.openCart();
    await expect(cartDrawer.emptyHeading).toBeVisible();
  });

  test('thêm sản phẩm vào giỏ từ trang chi tiết', async ({ testProduct, productDetailPage, toast, header, cartDrawer }) => {
    const variant = testProduct.variants[0];
    await productDetailPage.goto(testProduct.slug);

    await productDetailPage.addToCart(variant, 2);

    await expect(toast.message('Đã thêm vào giỏ hàng')).toBeVisible();
    await expect(header.cartButton).toHaveAccessibleName('Giỏ hàng, 2 sản phẩm');

    await header.openCart();
    const item = cartDrawer.item(testProduct.name);
    await expect(item).toContainText(`${variant.size} · ${variant.color}`);
    await expect(item.getByRole('textbox', { name: /^Số lượng/ })).toHaveValue('2');
  });

  test('tăng giảm số lượng thì tạm tính thay đổi theo', async ({ testProduct, productDetailPage, toast, cartPage }) => {
    const price = Number(testProduct.price);
    await productDetailPage.goto(testProduct.slug);
    await productDetailPage.addToCart(testProduct.variants[0]);
    await expect(toast.message('Đã thêm vào giỏ hàng')).toBeVisible();
    await cartPage.goto();

    await expect(cartPage.summary).toContainText(`Tạm tính (1 sản phẩm)${formatVnd(price)}`);

    await cartPage.increase(testProduct.name);
    await expect(cartPage.quantityInput(testProduct.name)).toHaveValue('2');
    await expect(cartPage.summary).toContainText(`Tạm tính (2 sản phẩm)${formatVnd(price * 2)}`);

    await cartPage.decrease(testProduct.name);
    await expect(cartPage.quantityInput(testProduct.name)).toHaveValue('1');
    await expect(cartPage.summary).toContainText(`Tạm tính (1 sản phẩm)${formatVnd(price)}`);
  });

  test('xoá sản phẩm khỏi giỏ', async ({ testProduct, productDetailPage, toast, cartPage }) => {
    await productDetailPage.goto(testProduct.slug);
    await productDetailPage.addToCart(testProduct.variants[0]);
    await expect(toast.message('Đã thêm vào giỏ hàng')).toBeVisible();
    await cartPage.goto();
    await expect(cartPage.item(testProduct.name)).toBeVisible();

    await cartPage.remove(testProduct.name);

    await expect(cartPage.item(testProduct.name)).toBeHidden();
    await expect(cartPage.emptyHeading).toBeVisible();
  });
});
