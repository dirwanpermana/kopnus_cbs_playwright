import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default class BasePage {
    constructor(protected page: Page) {}

    public async open(): Promise<void> {
        await this.page.goto(`${process.env.RCS_URL_LOGIN}`);
    }

    protected escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
