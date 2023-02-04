import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { createProductsSeed } from "./createProductsSeed";

const client = 'http://localhost:3000';
const product = '/product/1';
const productPage = client + product;
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';
const productEndpoint = server + product;

test.describe.parallel('Product (details page)', () => {
    test.beforeEach(async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });
    });

    test('Page renders with the correct product data', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('guest'));
        });

        await page.goto(productPage);
        const h1 = await page.waitForSelector('h1');
        expect(await h1.textContent()).toBe('1');

        const price = await page.waitForSelector('text=Price: $1.00'); // ensure that the price is rounded to the second decimal
        expect(await price.isVisible()).toBe(true);

        const image = await page.waitForSelector('img');
        const src = await image.evaluate(async (el) => {
            return el.src === 'http://localhost:3000/product/a' && el.alt === '1';
        });

        expect(src).toBe(true);
    });

    test('Page renders correctly for guest users', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('guest'));
        });

        await page.goto(productPage);
        await page.waitForSelector('text=Log in to interact');
        const text = page.locator('text=Log in to interact');
        await expect(text).toBeVisible();
    });

    test('Page renders correctly for logged in user that has not bought the product', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('user'));
        });

        await page.goto(productPage);
        await page.waitForSelector('text=Buy');
        const text = page.locator('text=Buy');
        await expect(text).toBeVisible();
    });

    test('Page renders correctly for users that have bought the product', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('bought'));
        });

        await page.goto(productPage);
        await page.waitForSelector('text=Bought');
        const text = page.locator('text=Bought');
        await expect(text).toBeVisible();
    });

    test('Page renders correctly for users that have created the product', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('owner'));
        });

        await page.goto(productPage);
        await page.waitForSelector('text=Edit');
        const text = page.locator('text=Edit');
        await expect(text).toBeVisible();
    });

    test('Text changes successfully when the user buys the product', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('user'));
        });

        await page.goto(productPage);
        const buyButton = await page.waitForSelector('text=Buy');

        await page.route(productEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('bought'));
        });

        await page.route(productEndpoint + '/buy', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                contentType: 'application/json',
                body: JSON.stringify({ _id: '1' }),
            });
        });

        await buyButton.click();
        const text = await page.waitForSelector('text=Bought');
        expect(await text.isVisible()).toBe(true);
    });

    test('Redirects to the login page if buying results in a 401 error', async ({ page }) => {
        await page.route(productEndpoint + '/buy', async (route) => {
            await route.fulfill({
                status: HttpStatus.UNAUTHORIZED,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'You must be logged in',
                }]),
            });
        });

        await page.goto(productPage + '/buy');
        await page.waitForSelector('text=Login');
        const title = await page.title();
        expect(title).toBe('Login');
    });

    test('Redirects to the index page if buying results in a 403 error', async ({ page }) => {
        await page.route(productEndpoint + '/buy', async (route) => {
            await route.fulfill({
                status: HttpStatus.FORBIDDEN,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'You cannot buy the product',
                }]),
            });
        });

        await page.goto(productPage + '/buy');
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title).toBe('Home');
    });

    test.only('Redirects to not found page for a 404 error', async ({ page }) => {
        await page.route(productEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.NOT_FOUND,
                body: JSON.stringify([{
                    msg: 'Product does not exist'
                }]),
            });
        });

        await page.goto(productPage);
        const notFound = page.locator('text=Not Found');
        await notFound.waitFor();
        await expect(notFound).toBeVisible();
    });
});