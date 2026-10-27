import { faker } from '@faker-js/faker';

export function buildProduct(overrides = {}) {
  const id = Date.now();
  const price = faker.number.int({ min: 50000, max: 200000 });

  return {
    name: `${faker.commerce.productName()} ${id}`,
    slug: `test-${id}`,
    category: 'Quần Áo',
    price: price.toString(),
    costPrice: Math.round(price * 0.6).toString(),
    weight: faker.number.int({ min: 50, max: 1000 }).toString(),
    // imageUrl: `https://placehold.co/600x800/png?text=TEST+${id}`,
    imageUrl: `https://picsum.photos/seed/${Date.now()}/600/800`,
    // imagePath: 'data/images/test-product.png',
    description: faker.commerce.productDescription(),
    onSale: true,
    variants: [
  {
    size: 'M',
    color: faker.color.human(),
    sku: `SKU-${id}-M`,
    stock: faker.number.int({ min: 1, max: 100 }).toString(),
  },
  {
    size: 'L',
    color: faker.color.human(),
    sku: `SKU-${id}-L`,
    stock: faker.number.int({ min: 1, max: 100 }).toString(),
  },
],
    ...overrides,
  };
}
