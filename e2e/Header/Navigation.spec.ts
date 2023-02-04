import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest, rejectRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Navigation component', async () => {
    test('Displays four links when the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(client);
        const nav = await page.waitForSelector('nav');
        const links = await page.locator('nav a').count();

        expect(links).toBe(4);
    });

    test('Displays five links when the user is logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
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