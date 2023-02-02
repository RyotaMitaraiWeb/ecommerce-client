import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const loginPage = `${client}/login`;

const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe('Login', async () => {
    test('Submit button is disabled if at least one field is empty and enabled when both are active', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(loginPage);

        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('a');

        const passwordField = page.locator('[type="password"]');
        await passwordField.focus();

        const button = page.locator('[type="submit"]');
        expect(await button.isDisabled()).toBe(true);

        passwordField.fill('a');
        await page.waitForTimeout(2000);
        expect(await button.isDisabled()).toBe(false);
    });

    test('Toggle password visibility button toggles the password field\'s type successfully', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(loginPage);
        const showButton = page.getByLabel(/Show password/i);
        await showButton.click();
        await page.waitForSelector('.fa-eye-slash'); // this is the icon that is displayed when the password is visible
        const passwordField = page.locator('#password');
        const passwordIsVisible = await passwordField.evaluate(el => {
            return (el as HTMLInputElement).type === 'text';
        });

        expect(passwordIsVisible).toBe(true);

        const hideButton = page.getByLabel(/Hide password/i);
        await hideButton.click();
        await page.waitForSelector('.fa-eye'); // this is the icon that is displayed when the password is not visible
        const passwordIsInvisible = await passwordField.evaluate(el => {
            return (el as HTMLInputElement).type === 'password';
        });

        expect(passwordIsInvisible).toBe(true);
    });

    test('Login page is not accessible to logged in users', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.goto(loginPage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title.includes('Home')).toBe(true);
    });

    test('Successfully redirects when the user logs in successfully', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.route(server + '/user/login', async (route) => {
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

        await page.goto(loginPage);
        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('a');

        const passwordField = page.locator('[type="password"]');
        passwordField.fill('a');
        await page.waitForTimeout(2000);
        const button = page.locator('[type="submit"]');
        await button.click();
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title.includes('Home')).toBe(true);
    });

    test('Displays an error snackbar and does not redirect when login fails', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.route(server + '/user/login', async (route) => {
            await route.fulfill({
                status: HttpStatus.BAD_REQUEST,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        msg: 'Wrong username or password',
                    }
                ])
            });
        });

        await page.goto(loginPage);
        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('a');

        const passwordField = page.locator('[type="password"]');
        passwordField.fill('a');
        await page.waitForTimeout(2000);
        const button = page.locator('[type="submit"]');
        await button.click();
        await page.waitForSelector('text=Wrong');
        const title = await page.title();
        expect(title.includes('Login')).toBe(true);
    });
});