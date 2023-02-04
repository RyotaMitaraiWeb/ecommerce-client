import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Profile (purchases)', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.goto(client);
        await page.waitForSelector('.indigo');

        await page.route(server + '/user/transactions', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify([{
                    _id: '1',
                    buyer: 'a',
                    product: {
                        _id: '1',
                        name: '1',
                        price: 1,
                        image: 'a',
                        owner: '',
                    },
                    createdAt: '2023-01-12T17:39:37.090+00:00',
                }]),
            });
        });

        await page.goto(client + '/profile/purchases');
    });

    test('Displays a table successfully', async ({ page }) => {
        await page.waitForSelector('table');
        const rows = await page.locator('tr').count();
        const td = await page.locator('td').count();
        expect(rows).toBe(2);
        expect(td).toBe(4); // product name + transaction id + date + link to the product
    });
});