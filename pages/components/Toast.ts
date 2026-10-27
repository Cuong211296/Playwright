import { type Page, type Locator } from '@playwright/test';

export class Toast {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.ui-toasts');
  }

  message(text: string) {
    return this.container.getByText(text);
  }
}
