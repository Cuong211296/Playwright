import { type Page, type Locator, expect } from '@playwright/test';

type VariantData = {
  size: string;
  color: string;
  sku: string;
  stock: string;
  price?: string;      // không bắt buộc
};

type ProductData = {
  name: string;
  price: string;
  slug?: string;
  category?: string;
  costPrice?: string;
  weight?: string;
  imageUrl?: string;
  imagePath?: string;
  description?: string;
  onSale?: boolean;
  variants?: VariantData[];
};

export class AdminProductsPage {
  readonly page: Page;

  // Danh sách
  readonly addProductButton: Locator;
  readonly searchBox: Locator;
  readonly productRows: Locator;
  readonly newCategoryInput: Locator;
  readonly addCategoryButton: Locator;


  // Form trong popup
  readonly dialog: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly categorySelect: Locator;
  readonly priceInput: Locator;
  readonly descriptionInput: Locator;
  readonly onSaleSwitch: Locator;
  readonly createButton: Locator;
  readonly closeButton: Locator;  
  readonly costPriceInput: Locator;
  readonly weightInput: Locator;
  readonly imageUrlInput: Locator;
  readonly uploadImageButton: Locator;

    // Biến thể
    readonly variantForm: Locator;
    readonly variantSizeInput: Locator;
    readonly variantColorInput: Locator;
    readonly variantSkuInput: Locator;
    readonly variantStockInput: Locator;
    readonly variantPriceInput: Locator;
    readonly addVariantButton: Locator;
    readonly pendingVariants: Locator;



  constructor(page: Page) {
    this.page = page;

    this.addProductButton = page.getByRole('button', { name: 'Thêm sản phẩm' });
    this.searchBox = page.getByRole('main').getByRole('searchbox', { name: 'Tìm sản phẩm' });
    this.productRows = page.getByRole('table').getByRole('row');
    this.newCategoryInput = page.getByRole('textbox', { name: 'Danh mục mới' });
    this.addCategoryButton = page.getByRole('button', { name: 'Thêm danh mục' });


    this.dialog = page.getByRole('dialog');
    this.nameInput = this.dialog.getByRole('textbox', { name: 'Tên', exact: true });
    this.slugInput = this.dialog.getByRole('textbox', { name: 'Slug' });
    this.categorySelect = this.dialog.getByRole('combobox', { name: 'Danh mục' });
    this.priceInput = this.dialog.getByRole('spinbutton', { name: 'Giá gốc (₫)' });
    this.descriptionInput = this.dialog.getByRole('textbox', { name: 'Mô tả (không bắt buộc)' });
    this.onSaleSwitch = this.dialog.getByRole('switch', { name: 'Đang bán' });
    this.createButton = this.dialog.getByRole('button', { name: 'Tạo sản phẩm' });
    this.closeButton = this.dialog.getByRole('button', { name: 'Đóng' }).last();
    this.costPriceInput = this.dialog.getByRole('spinbutton', { name: 'Giá vốn (tuỳ chọn)' });
    this.weightInput = this.dialog.getByRole('spinbutton', { name: 'Cân nặng (g) (không bắt buộc)' });
    this.imageUrlInput = this.dialog.getByRole('textbox', { name: 'Link ảnh (không bắt buộc)' });
    this.uploadImageButton = this.dialog.getByRole('button', { name: 'Tải ảnh lên' });

    this.variantForm = this.dialog.getByRole('form', { name: 'Thêm biến thể' });
    this.variantSizeInput = this.variantForm.getByRole('textbox', { name: 'Size' });
    this.variantColorInput = this.variantForm.getByRole('textbox', { name: 'Màu' });
    this.variantSkuInput = this.variantForm.getByRole('textbox', { name: 'SKU' });
    this.variantStockInput = this.variantForm.getByRole('spinbutton', { name: 'Kho' });
    this.variantPriceInput = this.variantForm.getByRole('spinbutton', { name: 'Giá riêng (không bắt buộc)' });
    this.addVariantButton = this.variantForm.getByRole('button', { name: 'Thêm biến thể' });
    this.pendingVariants = this.dialog.getByRole('list', { name: 'Biến thể chờ lưu' }).getByRole('listitem');


  }

  async goto() {
    await this.page.goto('/admin/products');
  }

  productRow(name: string) {
    return this.productRows.filter({ hasText: name });
  }

  async createCategory(name: string){
    await this.newCategoryInput.fill(name);
    await this.addCategoryButton.click();
  }

  variants?: VariantData[];
  async addVariant(variant: VariantData) {
  await this.variantSizeInput.fill(variant.size);
  await this.variantColorInput.fill(variant.color);
  await this.variantSkuInput.fill(variant.sku);
  await this.variantStockInput.fill(variant.stock);
  if (variant.price) {
    await this.variantPriceInput.fill(variant.price);
  }
  await this.addVariantButton.click();

  // chờ biến thể xuất hiện trong danh sách chờ lưu
  await expect(this.pendingVariants.filter({ hasText: variant.sku })).toBeVisible();
}





  async createProduct(product: ProductData) {
    
    await this.addProductButton.click();
    await this.nameInput.fill(product.name);
    if (product.slug){
        await this.slugInput.fill(product.slug);
    }
    if (product.category) {
        await this.categorySelect.selectOption(product.category);
    }
    if (product.description) {
        await this.descriptionInput.fill(product.description);
    }
    if (product.onSale !== undefined) {
        await this.onSaleSwitch.setChecked(product.onSale);
    }
    await this.priceInput.fill(product.price);
    if (product.costPrice) {
        await this.costPriceInput.fill(product.costPrice);
    }   
    if (product.weight) {
        await this.weightInput.fill(product.weight);
    }
    if (product.imageUrl) {
        await this.imageUrlInput.fill(product.imageUrl);
    }
    // if (product.imagePath) {
    // const fileChooserPromise = this.page.waitForEvent('filechooser');
    // await this.uploadImageButton.click();
    // const fileChooser = await fileChooserPromise;
    // await fileChooser.setFiles(product.imagePath);

    // chờ upload xong: ô Link ảnh được tự điền link Cloudinary
    // await expect(this.imageUrlInput).toHaveValue(/cloudinary/, { timeout: 15000 });
    // }
    

    if (product.variants) {
    for (const variant of product.variants) {
        await this.addVariant(variant);
    }
    }

    await this.createButton.click();
}

}
