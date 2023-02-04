import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest, rejectRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Home page', () => {
    test('Renders welcome heading', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(client);
        const welcome = page.getByText(/Welcome/i);
        expect(welcome).toBeDefined();
    });

    test('Renders two buttons when the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(client);
        await page.waitForSelector('.action-button');
        const buttons = await page.locator('.action-button').count();
        expect(buttons).toBe(2);
    });

    test('Renders three buttons when the user is logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {            
            await route.fulfill(authorizeRequest());
        });

        await page.goto(client, { waitUntil: 'networkidle' });
        await page.waitForSelector('.user-action');
        const buttons = await page.locator('.action-button').count();
        expect(buttons).toBe(3);
    });
});