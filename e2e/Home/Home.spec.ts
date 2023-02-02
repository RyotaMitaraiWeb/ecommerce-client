import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe('Home page', () => {
    test('Renders welcome heading', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const welcome = page.getByText(/Welcome/i);
        expect(welcome).toBeDefined();
    });

    test('Renders two buttons when the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        await page.waitForSelector('.action-button');
        const buttons = await page.locator('.action-button').count();
        expect(buttons).toBe(2);
    });

    test('Renders three buttons when the user is logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {            
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify({
                    _id: '1',
                    username: '1',
                    palette: 'deepPurple',
                    theme: 'light',
                }),
                contentType: 'application/json',
            });
        });

        await page.goto(client, { waitUntil: 'networkidle' });
        await page.waitForSelector('.user-action');
        const buttons = await page.locator('.action-button').count();
        expect(buttons).toBe(3);
    });
});