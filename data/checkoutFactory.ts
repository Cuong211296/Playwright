import { faker } from '@faker-js/faker';

export function buildShippingInfo(overrides = {}) {
  return {
    receiverName: faker.person.fullName(),
    phone: `09${faker.string.numeric(8)}`,
    // email nhận xác nhận đơn, đặt trong .env (không đưa lên git)
    email: process.env.CHECKOUT_EMAIL!,
    province: 'Hồ Chí Minh',
    district: 'Quận 3',
    ward: 'Phường 1',
    address: faker.location.streetAddress(),
    note: 'Đơn test tự động',
    ...overrides,
  };
}
