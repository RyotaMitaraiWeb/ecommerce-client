import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest } from "../userAuthorization";
import { createProductsSeed } from "./createProductsSeed";

const client = 'http://localhost:3000';
const del = '/product/1/delete';
const deletePage = client + del;
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';
const deleteEndpoint = server + '/product/1/delete';

test.describe.parallel('Product (create page)', () => {
    test.beforeEach(async ({ page }) => {
        // await page.addInitScript(() => {
        //     window.localStorage.setItem('accessToken', '1');
        // });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
        });

        // await page.route(editEndpoint + '/isOwner', async (route) => {
        //     await route.fulfill(createProductsSeed('owner'));
        // });

        // await page.goto(editPage);
    });

    test('Redirects to home page if the product is deleted successfully', async ({ page }) => {
        await page.route(server + '/product/1', async (route) => {
            await route.fulfill(createProductsSeed('owner'));
        });

        await page.route(deleteEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.NO_CONTENT,
                body: JSON.stringify([{
                    _id: '1',
                }]),
            });
        });

        await page.goto(deletePage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title).toBe('Home');
    });

    test('Redirects to home page for a 403 error', async ({ page }) => {
        await page.route(server + '/product/1', async (route) => {
            await route.fulfill({
                status: HttpStatus.FORBIDDEN,
                body: JSON.stringify([{
                    msg: 'Cannot delete'
                }]),
            });
        });

        await page.route(deleteEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.FORBIDDEN,
                body: JSON.stringify([{
                    msg: 'Cannot delete'
                }]),
            });
        });

        await page.goto(deletePage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title).toBe('Home');
    });

    test('Redirects to login page for a 401 error', async ({ page }) => {
        await page.route(server + '/product/1', async (route) => {
            await route.fulfill({
                status: HttpStatus.UNAUTHORIZED,
                body: JSON.stringify([{
                    msg: 'Unauthorized'
                }]),
            });
        });

        await page.route(deleteEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.FORBIDDEN,
                body: JSON.stringify([{
                    msg: 'You must log in to perform this operation'
                }]),
            });
        });

        await page.goto(deletePage);
        await page.locator('h1').locator('text=Login').waitFor();
        const title = await page.title();
        expect(title).toBe('Login');
    });

    test('Redirects to not found page for a 404 error', async ({ page }) => {
        await page.route(server + '/product/1', async (route) => {
            await route.fulfill({
                status: HttpStatus.NOT_FOUND,
                body: JSON.stringify([{
                    msg: 'Product does not exist'
                }]),
            });
        });

        await page.route(deleteEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.NOT_FOUND,
                body: JSON.stringify([{
                    msg: 'Product does not exist'
                }]),
            });
        });

        await page.goto(deletePage);
        const notFound = page.locator('text=Not Found');
        await notFound.waitFor();
        await expect(notFound).toBeVisible();
    });
});