import { type Page, type Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly main: Locator;
  readonly breadcrumb: Locator;
  readonly heading: Locator;
  readonly sizeGroup: Locator;
  readonly colorGroup: Locator;
  readonly chooseSizeFirstHint: Locator;
  readonly stockText: Locator;
  readonly quantityInput: Locator;
  readonly increaseButton: Locator;
  readonly decreaseButton: Locator;
  readonly addToCartButton: Locator;
  readonly chooseVariantHint: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.breadcrumb = this.main.getByRole('navigation', { name: 'Breadcrumb' });
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.sizeGroup = this.main.getByRole('group', { name: 'Chọn size' });
    this.colorGroup = this.main.getByRole('group', { name: 'Chọn màu' });
    this.chooseSizeFirstHint = this.main.getByText('Chọn size trước để xem các màu.');
    this.stockText = this.main.getByText(/^Còn \d+ sản phẩm$/);

    const quantity = this.main.getByRole('group', { name: 'Số lượng' });
    this.quantityInput = quantity.getByRole('textbox', { name: 'Số lượng' });
    this.increaseButton = quantity.getByRole('button', { name: 'Tăng số lượng' });
    this.decreaseButton = quantity.getByRole('button', { name: 'Giảm số lượng' });

    this.addToCartButton = this.main.getByRole('button', { name: 'Thêm vào giỏ' });
    this.chooseVariantHint = this.main.getByText('Vui lòng chọn size và màu để thêm vào giỏ.');
  }

  async goto(slug: string) {
    await this.page.goto(`/products/${slug}`);
  }

  sizeButton(size: string) {
    return this.sizeGroup.getByRole('button', { name: size, exact: true });
  }

  colorButton(color: string) {
    return this.colorGroup.getByRole('button', { name: color, exact: true });
  }

  async selectVariant(size: string, color: string) {
    await this.sizeButton(size).click();
    await this.colorButton(color).click();
  }

  async addToCart(variant: { size: string; color: string }, quantity = 1) {
    await this.selectVariant(variant.size, variant.color);
    for (let i = 1; i < quantity; i++) {
      await this.increaseButton.click();
    }
    await this.addToCartButton.click();
  }
}
