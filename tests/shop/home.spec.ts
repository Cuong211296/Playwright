import { test, expect } from '../../fixtures/fixtures';

test.describe('Trang chủ - danh sách sản phẩm', () => {
  test.use({ storageState: 'playwright/.auth/customer.json' });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('tìm sản phẩm theo tên', async ({ homePage }) => {
    // lấy tên sản phẩm đầu tiên đang có trên trang để tìm
    const name = await homePage.productItems.first().getByRole('heading').innerText();

    await homePage.search(name);

    await expect(homePage.productCount).toContainText(`sản phẩm cho “${name}”`);
    await expect(homePage.productCard(name)).toBeVisible();
  });

  test('báo không tìm thấy khi từ khoá không khớp sản phẩm nào', async ({ homePage }) => {
    await homePage.search('khong-co-san-pham-nay-xyz');

    await expect(homePage.productCount).toHaveText('0 sản phẩm cho “khong-co-san-pham-nay-xyz”');
    await expect(homePage.emptyState).toBeVisible();

    await homePage.showAllButton.click();
    await expect(homePage.searchBox).toHaveValue('');
    await expect(homePage.productItems.first()).toBeVisible();
  });

  test('lọc theo danh mục', async ({ homePage }) => {
    await homePage.selectCategory('Quần Áo');

    await expect(homePage.categoryTab('Quần Áo')).toHaveAttribute('aria-selected', 'true');
    // mỗi thẻ sản phẩm đều ghi danh mục "Quần Áo"
    await expect(homePage.productItems.first()).toBeVisible();
    await expect(homePage.productItems.filter({ hasNotText: 'Quần Áo' })).toHaveCount(0);
  });

  test('bấm vào sản phẩm mở trang chi tiết', async ({ homePage, productDetailPage, page }) => {
    const name = await homePage.productItems.first().getByRole('heading').innerText();

    await homePage.openProduct(name);

    await expect(page).toHaveURL(/\/products\//);
    await expect(productDetailPage.heading).toHaveText(name);
  });
});
