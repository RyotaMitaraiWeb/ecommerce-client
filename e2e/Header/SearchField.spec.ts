import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { rejectRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Search field component', async () => {
    test.beforeEach(async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(client);
    });

    test('Inputs a value successfully', async ({ page }) => {
        const search = await page.waitForSelector('#search');
        await search.fill('a');
        await page.waitForTimeout(2000);
        const value = await search.inputValue();
        expect(value).toBe('a');
    });

    test('Successfully redirects for a non-empty value after the button is clicked', async ({ page }) => {
        await page.route(server + '/product/search?name=a&page=1&sort=asc&by=name', async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify({
                    products: [],
                    total: 0,
                }),
                contentType: 'application/json',
            });
        });

        const search = await page.waitForSelector('#search');
        await search.fill('a');
        await page.waitForTimeout(2000);
        const searchButton = page.getByLabel(/Search products/i);
        await searchButton.click();
        await page.waitForTimeout(2000);
        const title = await page.title();
        expect(title.includes('Search')).toBe(true);
    });

    test('Does not redirect if the field is empty', async ({ page }) => {
        const search = await page.waitForSelector('#search');
        await page.waitForTimeout(2000);
        const searchButton = page.getByLabel(/Search products/i);
        await searchButton.click();
        await page.waitForTimeout(2000);
        const title = await page.title();
        expect(title.includes('Search')).toBe(false);
    });
});