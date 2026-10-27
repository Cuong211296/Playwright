import { test, expect } from '../../fixtures/fixtures';
import { AdminOrdersPage } from '../../pages/admin/AdminOrdersPage';
import { Toast } from '../../pages/components/Toast';

// Customer đặt đơn (fixture codOrder, chạy trên `page`),
// admin xử lý đơn đó trên tab riêng (`adminPage`), rồi customer kiểm tra lại.
// Chỉ thao tác trên đơn do chính test tạo ra.
test.describe('Admin xử lý đơn hàng', () => {
  test('xem chi tiết đơn', async ({ codOrder, adminPage }) => {
    const adminOrders = new AdminOrdersPage(adminPage);
    await adminOrders.goto();

    await adminOrders.openDetails(codOrder.code);

    await expect(adminOrders.detailsToggle(codOrder.code)).toHaveAttribute('aria-expanded', 'true');
    await expect(adminOrders.detailsRow(codOrder.code)).toContainText(codOrder.product.name);
    await expect(adminOrders.detailsRow(codOrder.code)).toContainText('Thanh toán khi nhận hàng (COD)');
  });

  test('xác nhận → giao hàng → hoàn thành', async ({ codOrder, adminPage, orderPage }) => {
    const { code } = codOrder;
    const adminOrders = new AdminOrdersPage(adminPage);
    const adminToast = new Toast(adminPage);
    await adminOrders.goto();
    await expect(adminOrders.orderRow(code)).toContainText('Chờ xác nhận');

    await adminOrders.confirm(code);
    await expect(adminToast.message(`Đơn ${code}: Đã xác nhận`)).toBeVisible();
    await expect(adminOrders.orderRow(code)).toContainText('Đã xác nhận');

    await adminOrders.ship(code);
    await expect(adminToast.message(`Đơn ${code}: Đang giao`)).toBeVisible();
    await expect(adminOrders.orderRow(code)).toContainText('Đang giao');
    // đang giao thì không huỷ được nữa
    await expect(adminOrders.cancelButton(code)).toBeHidden();

    await adminOrders.complete(code);
    await expect(adminToast.message(`Đơn ${code}: Hoàn thành`)).toBeVisible();
    await expect(adminOrders.orderRow(code)).toContainText('Hoàn thành');
    await expect(adminOrders.orderRow(code)).toContainText('Đã thanh toán');

    // customer thấy đơn đã hoàn thành
    await orderPage.gotoDetail(code);
    await expect(orderPage.progressStep('Hoàn thành')).toContainText('(đã xong)');
    await expect(orderPage.paymentSummary).toContainText('Đã thanh toán');
  });

  test('huỷ đơn: bấm "Giữ đơn" thì không huỷ, bấm "Huỷ đơn" thì huỷ', async ({ codOrder, adminPage, orderPage }) => {
    const { code } = codOrder;
    const adminOrders = new AdminOrdersPage(adminPage);
    const adminToast = new Toast(adminPage);
    await adminOrders.goto();

    await adminOrders.cancelButton(code).click();
    await expect(adminOrders.cancelDialog).toContainText('Kho sẽ được hoàn lại và không thể hoàn tác.');
    await adminOrders.keepOrderButton.click();
    await expect(adminOrders.cancelDialog).toBeHidden();
    await expect(adminOrders.orderRow(code)).toContainText('Chờ xác nhận');

    await adminOrders.cancel(code);
    await expect(adminToast.message(`Đơn ${code}: Đã huỷ`)).toBeVisible();
    await expect(adminOrders.orderRow(code)).toContainText('Đã huỷ');

    await adminOrders.filterByStatus('Đã huỷ');
    await expect(adminOrders.orderRow(code)).toBeVisible();

    // customer thấy đơn bị huỷ
    await orderPage.gotoDetail(code);
    await expect(orderPage.cancelledNotice).toBeVisible();
  });
});
