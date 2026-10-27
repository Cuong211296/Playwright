import { type Page, type Locator } from "@playwright/test";

export class Header{
    readonly page: Page;
    readonly banner: Locator;
    readonly mainNav: Locator;
    readonly adminLink: Locator;

    constructor(page:Page){
        // trong constructor
    this.page = page;
    this.banner = page.getByRole('banner');
    this.mainNav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    this.adminLink = this.mainNav.getByRole('link', { name: 'Quản trị' });
    }

    userMenuButton(username: string) {
        return this.banner.getByRole('button', { name: username });
    }

    async goToAdmin() {
    await this.adminLink.click();
    }

}


