import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Header component', async () => {
    test('Has a deep purple background if the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const header = await page.waitForSelector('header');
        const backgroundColor = await header.evaluate((el => {
            return el.classList.contains('deepPurple');
        }));

        expect(backgroundColor).toBe(true);
    });

    test('Has the preferred color theme for a logged in user', async ({ page }) => {
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
        const header = await page.waitForSelector('.indigo');
        const backgroundColor = await header.evaluate((el => {
            return el.classList.contains('indigo');
        }));

        expect(backgroundColor).toBe(true);
    });
});