import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  // ① Hero
  readonly heroHeading: Locator;
  readonly shopNowButton: Locator;
  readonly viewCollectionButton: Locator;

  // ③ Khu sản phẩm
  readonly searchBox: Locator;
  readonly productCount: Locator;
  readonly productItems: Locator;
  readonly emptyState: Locator;
  readonly showAllButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroHeading = page.getByRole('heading', { level: 1 });
    this.shopNowButton = page.getByRole('button', { name: 'Mua sắm ngay' });
    this.viewCollectionButton = page.getByRole('button', { name: 'Xem bộ sưu tập' });

    this.searchBox = page.getByRole('searchbox', { name: 'Tìm sản phẩm' });
    // "15 sản phẩm" hoặc khi tìm kiếm: "1 sản phẩm cho “abc”"
    this.productCount = page.getByText(/^\d+ sản phẩm/);
    this.productItems = page.getByRole('tabpanel').getByRole('listitem');
    this.emptyState = page.getByRole('heading', { name: 'Không tìm thấy sản phẩm phù hợp' });
    this.showAllButton = page.getByRole('button', { name: 'Xem tất cả sản phẩm' });
  }

  async goto() {
    await this.page.goto('/');
  }

  categoryTab(name: string) {
    return this.page.getByRole('tab', { name, exact: true });
  }

  productCard(name: string) {
    return this.productItems.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  async openProduct(name: string) {
    await this.productCard(name).getByRole('link').click();
  }

  async selectCategory(name: string) {
    await this.categoryTab(name).click();
  }

  async search(keyword: string) {
    await this.searchBox.fill(keyword);
  }
}

