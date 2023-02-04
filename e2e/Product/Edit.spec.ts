import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { createProductsSeed } from "./createProductsSeed";

const client = 'http://localhost:3000';
const edit = '/product/1/edit';
const editPage = client + edit;
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';
const editEndpoint = server + '/product/1';

test.describe.parallel('Product (create page)', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.route(editEndpoint + '/isOwner', async (route) => {
            await route.fulfill(createProductsSeed('owner'));
        });

        await page.goto(editPage);
    });

    test('Fields load with the correct product data', async ({ page }) => {
        const nameField = await page.waitForSelector('#name');
        const priceField = await page.waitForSelector('#price');
        
        const name = await nameField.inputValue();
        const price = await priceField.inputValue();

        expect(name).toBe('1');
        expect(price).toBe('1');


    });

    test('Button becomes enabled when all fields are filled and disabled when at least one is empty', async ({ page }) => {
        const nameField = await page.waitForSelector('#name');
        const submit = page.getByText('Edit product');
        await expect(submit).toBeEnabled();

        await nameField.fill('');
        await expect(submit).toBeDisabled();

    });

    test('Redirects upon successfully editing a product', async ({ page }) => {
        await page.route(editEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('owner')); // the boolean properties are irrelevant here
        });

        const submit = await page.waitForSelector('text=Edit Product');
        await submit.click();

        await page.locator('.edit-button').waitFor();
        const title = await page.title();
        expect(title).toBe('1');
    });

    test('Does not redirect if the server rejects the request', async ({ page }) => {
        await page.route(editEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.BAD_REQUEST,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'Invalid data',
                }]),
            });
        });

        const nameField = await page.waitForSelector('#name');
        await nameField.fill('2');

        const priceField = await page.waitForSelector('#price');
        await priceField.fill('2');

        const submit = await page.waitForSelector('text=Edit Product');
        await submit.click();

        const title = await page.title();
        expect(title).toBe('Edit 1');
    });

    test('Displays all validation errors successfully', async ({ page }) => {
        const nameField = await page.waitForSelector('#name');
        const priceField = await page.waitForSelector('#price');

        await nameField.fill('a');
        await priceField.focus(); // make sure validation error appears
        await page.waitForSelector('text=Product name must be at least five characters');

        await nameField.fill('');
        await page.waitForSelector('text=Product name is required');

        await nameField.fill('a'.repeat(101));
        await page.waitForSelector('text=Product name must not be longer than 100 characters');

        await priceField.fill('0');
        await nameField.focus();
        await page.waitForSelector('text=Price must be at least $0.01');
    });

    test('Redirects to index page for a 403 error', async ({ page }) => {
        await page.goto(client);
        await page.route(editEndpoint + '/isOwner', async (route) => {
            await route.fulfill({
                status: HttpStatus.FORBIDDEN,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'You must be logged in',
                }]),
            });
        });

        await page.goto(editPage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title).toBe('Home');
    });

    test('Redirects to not found page for a 404 error', async ({ page }) => {
        await page.route(editEndpoint + '/isOwner', async (route) => {
            await route.fulfill({
                status: HttpStatus.NOT_FOUND,
                body: JSON.stringify([{
                    msg: 'Product does not exist'
                }]),
            });
        });

        await page.goto(editPage);
        const notFound = page.locator('text=Not Found');
        await notFound.waitFor();
        await expect(notFound).toBeVisible();
    });
});