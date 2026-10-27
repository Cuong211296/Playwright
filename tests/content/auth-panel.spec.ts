import { test, expect } from "../../fixtures/fixtures";

const expectedPanel = `
  - complementary "Giới thiệu Quini Bear":
    - link "Quini Bear, về trang chủ":
      - /url: /
      - text: Quini·Bear
    - paragraph:
      - text: Chất liệu tử tế,
      - emphasis: phong cách
      - text: của riêng bạn.
    - list:
      - listitem:
        - strong: Giao nhanh toàn quốc
        - text: Theo dõi đơn hàng từng bước, ngay trong tài khoản.
      - listitem:
        - strong: Đổi trả trong 8 ngày
        - text: Không vừa ý? Chúng tôi đổi size hoặc hoàn tiền.
      - listitem:
        - strong: Thanh toán an toàn
        - text: MoMo hoặc COD, thông tin của bạn luôn được bảo mật.
        `;

test.describe("Noi dung panel gioi thieu", () => {
  test("trang dang ky hien thi dung chinh sach", async ({
    openedSigupPage,
    authPanel,
  }) => {
    await expect(authPanel.root).toMatchAriaSnapshot(expectedPanel);
  });

  test("trang đăng nhập hiển thị đúng chính sách", async ({
    openedLoginPage,
    authPanel,
  }) => {
    await expect(authPanel.root).toMatchAriaSnapshot(expectedPanel);
  });
});
