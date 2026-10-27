import { type Page, type Locator } from "@playwright/test";

export class Header{
    readonly page: Page;
    readonly banner: Locator;
    readonly mainNav: Locator;
    readonly adminLink: Locator;
    readonly ordersLink: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;
    readonly logoutButton: Locator;

    constructor(page:Page){
        // trong constructor
    this.page = page;
    this.banner = page.getByRole('banner');
    this.mainNav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    this.adminLink = this.mainNav.getByRole('link', { name: 'Quản trị' });
    this.ordersLink = this.mainNav.getByRole('link', { name: 'Đơn hàng', exact: true });
    this.searchButton = this.banner.getByRole('button', { name: 'Tìm kiếm sản phẩm' });
    // tên nút là "Giỏ hàng" (trống) hoặc "Giỏ hàng, 2 sản phẩm"
    this.cartButton = this.banner.getByRole('button', { name: /^Giỏ hàng/ });
    // chỉ hiện sau khi mở menu user
    this.logoutButton = this.banner.getByRole('button', { name: 'Đăng xuất' });
    }

    userMenuButton(username: string) {
        return this.banner.getByRole('button', { name: username });
    }

    async goToAdmin() {
    await this.adminLink.click();
    }

    async openCart() {
        await this.cartButton.click();
    }

    async logout(username: string) {
        await this.userMenuButton(username).click();
        await this.logoutButton.click();
    }

}
