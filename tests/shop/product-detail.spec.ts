import { test, expect } from '../../fixtures/fixtures';
import { formatVnd } from '../../utils/format';

// Chỉ xem, không bấm "Thêm vào giỏ" -> không đụng tới giỏ hàng (test giỏ hàng nằm ở tests/purchase)
test.describe('Trang chi tiết sản phẩm', () => {
  test.use({ storageState: 'playwright/.auth/customer.json' });

  test('hiển thị đúng thông tin sản phẩm', async ({ testProduct, productDetailPage }) => {
    await productDetailPage.goto(testProduct.slug);

    await expect(productDetailPage.heading).toHaveText(testProduct.name);
    await expect(productDetailPage.main).toContainText(formatVnd(Number(testProduct.price)));
    await expect(productDetailPage.breadcrumb).toContainText(testProduct.category);
    for (const variant of testProduct.variants) {
      await expect(productDetailPage.sizeButton(variant.size)).toBeVisible();
    }
  });

  test('phải chọn size và màu mới thêm vào giỏ được', async ({ testProduct, productDetailPage }) => {
    const variant = testProduct.variants[0];
    await productDetailPage.goto(testProduct.slug);

    // chưa chọn gì
    await expect(productDetailPage.addToCartButton).toBeDisabled();
    await expect(productDetailPage.chooseVariantHint).toBeVisible();
    await expect(productDetailPage.chooseSizeFirstHint).toBeVisible();

    // chọn size -> hiện màu, nhưng vẫn chưa thêm được
    await productDetailPage.sizeButton(variant.size).click();
    await expect(productDetailPage.sizeButton(variant.size)).toHaveAttribute('aria-pressed', 'true');
    await expect(productDetailPage.colorButton(variant.color)).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeDisabled();

    // chọn màu -> hiện tồn kho và bật nút
    await productDetailPage.colorButton(variant.color).click();
    await expect(productDetailPage.stockText).toHaveText(`Còn ${variant.stock} sản phẩm`);
    await expect(productDetailPage.addToCartButton).toBeEnabled();
    await expect(productDetailPage.chooseVariantHint).toBeHidden();
  });

  test('tăng giảm số lượng', async ({ testProduct, productDetailPage }) => {
    const variant = testProduct.variants[0];
    await productDetailPage.goto(testProduct.slug);
    await productDetailPage.selectVariant(variant.size, variant.color);

    await expect(productDetailPage.quantityInput).toHaveValue('1');
    await expect(productDetailPage.decreaseButton).toBeDisabled();

    await productDetailPage.increaseButton.click();
    await productDetailPage.increaseButton.click();
    await expect(productDetailPage.quantityInput).toHaveValue('3');

    await productDetailPage.decreaseButton.click();
    await expect(productDetailPage.quantityInput).toHaveValue('2');
  });
});
