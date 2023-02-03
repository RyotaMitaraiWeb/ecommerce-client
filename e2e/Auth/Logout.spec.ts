import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const logout = `${client}/logout`;

const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';
const logoutPage = client + '/logout';

const logoutEndpoint = '/user/logout';
const logoutPath = server + logoutEndpoint;

test.describe.parallel('Logout', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(client);
    });

    test('Redirects to index when logging out successfully', async ({ page }) => {
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

        await page.route(logoutPath, async (route) => {
            await route.fulfill({
                status: HttpStatus.NO_CONTENT,
            });
        });

        await page.goto(logoutPage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title.includes('Home')).toBe(true);
    });

    test('Redirects to login page when the user is not logged in', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.route(logoutPath, async (route) => {
            await route.fulfill({
                status: HttpStatus.UNAUTHORIZED,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'You must be logged in to perform this action'
                }])
            });
        });

        await page.goto(logoutPage);
        await page.locator('h1').locator('text=Login').waitFor();
        const title = await page.title();
        expect(title.includes('Login')).toBe(true);
    });
});