import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { createCardsSeed } from "../createCardsSeed";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Profile (my products)', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify({
                    _id: '1',
                    username: '1',
                    palette: 'indigo',
                    theme: 'light',
                })
            });
        });

        await page.goto(client);
        await page.waitForSelector('.indigo');
    });

    test('Displays a list of products successfully', async ({ page }) => {
        await page.route('http://localhost:5000/product/own?page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify(createCardsSeed(2))
            });
        });

        await page.goto(client + '/profile/products');
        await page.waitForSelector('article.card');
        const cards = await page.locator('article.card').count();
        expect(cards).toBe(2);
    });

    test('Displays the paginator when the server has more than six products', async ({ page }) => {
        await page.route('http://localhost:5000/product/own?page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify(createCardsSeed(6, 7))
            });
        });

        await page.goto(client + '/profile/products');
        await page.waitForSelector('article.card');
        await page.getByLabel(/page 1/i).first().waitFor();
        const cards = await page.locator('article.card').count();
        expect(cards).toBe(6);
    });
});