import { test, expect } from '../../fixtures/fixtures';
import { buildShippingInfo } from '../../data/checkoutFactory';
import { formatVnd } from '../../utils/format';

test.describe('Thanh toán', () => {
  test.beforeEach(async ({ cartPage, testProduct, productDetailPage, toast }) => {
    await cartPage.clear();
    await productDetailPage.goto(testProduct.slug);
    await productDetailPage.addToCart(testProduct.variants[0]);
    await expect(toast.message('Đã thêm vào giỏ hàng')).toBeVisible();
  });

  test('báo lỗi khi bỏ trống thông tin giao hàng', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await checkoutPage.selectPayment('COD');

    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.errorOf('receiverName')).toHaveText('Vui lòng nhập họ tên người nhận');
    await expect(checkoutPage.errorOf('phone')).toHaveText('Vui lòng nhập số điện thoại');
    await expect(checkoutPage.errorOf('email')).toHaveText('Vui lòng nhập email nhận xác nhận đơn');
    await expect(checkoutPage.errorOf('province')).toHaveText('Hãy chọn tỉnh/thành');
    await expect(checkoutPage.errorOf('district')).toHaveText('Hãy chọn quận/huyện');
    await expect(checkoutPage.errorOf('ward')).toHaveText('Hãy chọn phường/xã');
    await expect(checkoutPage.errorOf('address')).toHaveText('Vui lòng nhập địa chỉ giao hàng');
    await expect(checkoutPage.page).toHaveURL(/\/checkout$/);
  });

  test('chọn tỉnh rồi mới chọn được quận, chọn quận rồi mới chọn được phường', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    await expect(checkoutPage.districtSelect).toBeDisabled();
    await expect(checkoutPage.wardSelect).toBeDisabled();

    await checkoutPage.provinceSelect.selectOption('Hồ Chí Minh');
    await expect(checkoutPage.districtSelect).toBeEnabled();
    await expect(checkoutPage.wardSelect).toBeDisabled();

    await checkoutPage.districtSelect.selectOption('Quận 3');
    await expect(checkoutPage.wardSelect).toBeEnabled();
  });

  test('đổi phương thức thanh toán thì nút đặt hàng đổi theo', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    // mặc định là MoMo
    await expect(checkoutPage.momoRadio).toBeChecked();
    await expect(checkoutPage.placeOrderButton).toHaveText('Thanh toán với MoMo');

    await checkoutPage.selectPayment('COD');
    await expect(checkoutPage.placeOrderButton).toHaveText('Đặt hàng (COD)');
  });

  test('đặt hàng COD thành công', async ({ testProduct, checkoutPage, orderPage, header, page }) => {
    const variant = testProduct.variants[0];
    const shipping = buildShippingInfo();
    await checkoutPage.goto();
    await checkoutPage.fillShippingInfo(shipping);
    await checkoutPage.selectPayment('COD');

    const code = await checkoutPage.placeOrder();

    // chuyển sang trang chi tiết đơn
    await expect(page).toHaveURL(new RegExp(`/orders/${code}$`));
    await expect(orderPage.codeHeading).toHaveText(code);
    await expect(orderPage.successMessage).toBeVisible();
    // bước hiện tại có aria-current="step"
    await expect(orderPage.progressStep('Chờ xác nhận')).toHaveAttribute('aria-current', 'step');
    await expect(orderPage.items).toContainText(testProduct.name);
    await expect(orderPage.items).toContainText(`${variant.size} · ${variant.color}`);
    await expect(orderPage.paymentSummary).toContainText('Thanh toán khi nhận hàng (COD)');
    await expect(orderPage.paymentSummary).toContainText(`Tạm tính${formatVnd(Number(testProduct.price))}`);
    await expect(orderPage.shippingAddress).toContainText(shipping.receiverName);
    await expect(orderPage.shippingAddress).toContainText(shipping.phone);

    // giỏ hàng được làm trống
    await expect(header.cartButton).toHaveAccessibleName('Giỏ hàng');

    // đơn mới hiện trong "Đơn hàng của tôi"
    await orderPage.gotoList();
    await expect(orderPage.orderLink(code)).toContainText('Chờ xác nhận');
  });

  test('đặt hàng MoMo chuyển sang cổng thanh toán MoMo', async ({ checkoutPage, orderPage, page }) => {
    await checkoutPage.goto();
    await checkoutPage.fillShippingInfo(buildShippingInfo());
    await checkoutPage.selectPayment('MOMO');

    const code = await checkoutPage.placeOrder();

    await page.waitForURL(/test-payment\.momo\.vn/);

    // quay lại web: đơn đang chờ thanh toán, có nút thanh toán lại
    await orderPage.gotoDetail(code);
    await expect(orderPage.progressStep('Chờ thanh toán')).toHaveAttribute('aria-current', 'step');
    await expect(orderPage.pendingPaymentNotice).toBeVisible();
    await expect(orderPage.payWithMomoButton).toBeVisible();
    await expect(orderPage.paymentSummary).toContainText('MoMo');
  });
});
