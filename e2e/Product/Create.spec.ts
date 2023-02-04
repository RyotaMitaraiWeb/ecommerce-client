import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { createCardsSeed } from "../createCardsSeed";
import { authorizeRequest } from "../userAuthorization";
import { createProductsSeed } from "./createProductsSeed";

const client = 'http://localhost:3000';
const create = '/product/create';
const createPage = client + create;
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';
const createEndpoint = server + '/product';

test.describe.parallel('Product (create page)', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.goto(createPage);
    });

    test('Button becomes enabled when all fields are filled and disabled when at least one is empty', async ({ page }) => {
        const nameField = await page.waitForSelector('#name');
        const priceField = await page.waitForSelector('#price');
        const imageField = await page.waitForSelector('#image');

        const submit = page.getByText('Create product');
        await expect(submit).toBeDisabled();

        await nameField.fill('a');
        await expect(submit).toBeDisabled();

        await priceField.fill('3');
        await expect(submit).toBeDisabled();

        await imageField.fill('a');
        await expect(submit).toBeEnabled();
    });

    test('Redirects upon successfully creating a product', async ({ page }) => {
        await page.route(createEndpoint, async (route) => {
            await route.fulfill(createProductsSeed('owner')); // the boolean properties are irrelevant here
        });

        await page.route(server + '/product/1', async (route) => {
            await route.fulfill(createProductsSeed('owner'));
        });

        const nameField = await page.waitForSelector('#name');
        await nameField.fill('1');

        const priceField = await page.waitForSelector('#price');
        await priceField.fill('1');

        const imageField = await page.waitForSelector('#image');
        await imageField.fill('a');

        const submit = await page.waitForSelector('text=Create Product');
        await page.waitForTimeout(3000); // make sure the button is enabled
        await submit.click();

        await page.locator('text=Edit').waitFor();
        const title = await page.title();
        expect(title).toBe('1');
    });

    test('Does not redirect if the server rejects the request', async ({ page }) => {
        await page.route(createEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.BAD_REQUEST,
                contentType: 'application/json',
                body: JSON.stringify([{
                    msg: 'Invalid data',
                }]),
            });
        });

        const nameField = await page.waitForSelector('#name');
        await nameField.fill('1');

        const priceField = await page.waitForSelector('#price');
        await priceField.fill('1');

        const imageField = await page.waitForSelector('#image');
        await imageField.fill('a');

        const submit = await page.waitForSelector('text=Create Product');
        await page.waitForTimeout(3000); // make sure the button is enabled
        await submit.click();

        const title = await page.title();
        expect(title).toBe('Create a new product');
    });

    test('Displays all validation errors successfully', async ({ page }) => {
        const nameField = await page.waitForSelector('#name');
        const priceField = await page.waitForSelector('#price');
        const imageField = await page.waitForSelector('#image');

        await nameField.fill('a');
        await priceField.focus(); // make sure validation error appears
        await page.waitForSelector('text=Product name must be at least five characters');

        await nameField.fill('');
        await page.waitForSelector('text=Product name is required');

        await nameField.fill('a'.repeat(101));
        await page.waitForSelector('text=Product name must not be longer than 100 characters');

        await priceField.fill('0');
        await imageField.focus();
        await page.waitForSelector('text=Price must be at least $0.01');

        await imageField.fill('');
        await nameField.focus();
        await page.waitForSelector('text=Image is required');
    });

    test('Redirects to the login page if the user is a guest', async ({ page }) => {
        await page.goto(client);
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '');
        });

        await page.goto(createPage);
        await page.waitForSelector('text=Login');
        const title = await page.title();
        expect(title).toBe('Login');
    })
});