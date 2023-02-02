import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe('Navigation component', async () => {
    test('Displays four links when the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const nav = await page.waitForSelector('nav');
        const links = await page.locator('nav a').count();

        expect(links).toBe(4);
    });

    test('Displays five links when the user is logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify({
                    _id: '1',
                    username: '1',
                    palette: 'indigo',
                    theme: 'light',
                }),
                contentType: 'application/json',
            });
        });

        await page.goto(client);
        await page.waitForSelector('text=Logout')
        const links = await page.locator('nav a').count();
        expect(links).toBe(5);
    });

    test('Navigation menu is (initially) invisible if the viewport width is <= 780px', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.goto(client);
        const nav = page.locator('nav');
        expect(await nav.isHidden()).toBe(true);
    });
});