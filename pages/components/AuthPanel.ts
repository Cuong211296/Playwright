import { type Page, type Locator } from "@playwright/test";

export class AuthPanel {
    readonly page: Page;
    readonly root: Locator;

    constructor(page:Page) {
        this.page = page;
        this.root = page.getByRole('complementary', { name: 'Giới thiệu Quini Bear' });
    }
}