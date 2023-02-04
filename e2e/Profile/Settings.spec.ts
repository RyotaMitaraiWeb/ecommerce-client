import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Profile (settings)', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.route(server + '/user/palette', async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.route(server + '/user/theme', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify({ // doesn't matter what you return, the component uses the props to update the palette
                    theme: 'dark',
                })
            })
        });

        await page.goto(client);
        await page.waitForSelector('.indigo');
        await page.goto(client + '/profile/settings');
    });

    test('Changes palette successfully', async ({ page }) => {
        await page.getByLabel('Pink').waitFor();
        const pinkControl = page.getByLabel('Pink');

        await pinkControl.check();
        const header = await page.waitForSelector('.pink');
        expect(await header.isVisible()).toBe(true);
    });

    test('Changes theme successfully', async ({ page }) => {
        await page.getByLabel('Dark').waitFor();
        const darkControl = page.getByLabel('Dark');

        await darkControl.check();
        const main = await page.waitForSelector('main.dark');
        expect(await main.isVisible()).toBe(true);
    });
});