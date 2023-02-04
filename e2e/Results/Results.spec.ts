import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { createCardsSeed } from "../createCardsSeed";
import { rejectRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const all = client + '/product/all';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

// Since the results use the same component, you can test both at once with one endpoint
test.describe.parallel('All + search results', async () => {
    test.beforeEach(async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });
    });

    test('Displays a special message if there are no products', async ({ page }) => {
        await page.route(server + '/product/all?page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify({
                    products: [],
                    total: 0,
                }),
                contentType: 'application/json',
            });
        });

        await page.goto(all);
        const text = await page.waitForSelector('text=No products found!');
        expect(await text.isVisible()).toBe(true);
    });

    test('Displays cards of products successfully', async ({ page }) => {
        await page.route(server + '/product/all?page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify(createCardsSeed(2)),
                contentType: 'application/json',
            });
        });

        await page.goto(all);
        const cards = await page.waitForSelector('article.card');
        const amount = await page.locator('article.card').count();
        expect(amount).toBe(2);
    });

    test('Displays the paginator if there are more than six products on the server', async ({ page }) => {
        await page.route(server + '/product/all?page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify(createCardsSeed(6, 7)),
                contentType: 'application/json',
            });
        });

        await page.goto(all);
        await page.getByLabel(/page 1/i).first().waitFor();
        const cards = await page.locator('article.card').count();
        expect(cards).toBe(6);
    });
});