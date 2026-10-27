import { buildProduct } from '../../data/productFactory';
import { test, expect} from '../../fixtures/fixtures';

test.describe('create a product', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' });

    test('admin vào trang sản phẩm qua menu', async ({ header, adminSidebar, page }) => {
    await page.goto('/');
    await header.goToAdmin();
    await adminSidebar.goTo('Sản phẩm');

    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.getByRole('heading', { name: 'Sản phẩm', level: 1 })).toBeVisible();
});

    

    test('Tao san pham moi', async ({ adminProductPage, toast }) => {
    const product = buildProduct();

    await adminProductPage.goto();
    await adminProductPage.createProduct(product);

    await expect(toast.message('Đã tạo sản phẩm')).toBeVisible();
    await expect(toast.message(`Đã thêm ${product.variants.length} biến thể`)).toBeVisible();

    await adminProductPage.closeButton.click();
    await expect(adminProductPage.productRow(product.name)).toBeVisible();
    });


})