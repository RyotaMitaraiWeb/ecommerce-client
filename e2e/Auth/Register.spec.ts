import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";
import { authorizeRequest, rejectRequest } from "../userAuthorization";

const client = 'http://localhost:3000';
const registerPage = `${client}/register`;

const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Register', async () => {
    test('Submit button is disabled if at least one field is empty and enabled when both are filled', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(registerPage);

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
            await page.route(server + loadAuthEndpoint, async (route) => {
                await route.fulfill(rejectRequest());
            });
        });

        await page.goto(registerPage);
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

    test('Register page is not accessible to logged in users', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', '1');
        });

        await page.goto(registerPage);
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title.includes('Home')).toBe(true);
    });

    test('Successfully redirects when the user registers successfully', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.route(server + '/user/register', async (route) => {
            await route.fulfill(authorizeRequest());
        });

        await page.goto(registerPage);
        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('ryota1');

        const passwordField = page.locator('[type="password"]');
        passwordField.fill('123456');
        await page.waitForTimeout(2000);
        const button = page.locator('[type="submit"]');
        await button.click();
        await page.waitForSelector('text=Welcome');
        const title = await page.title();
        expect(title.includes('Home')).toBe(true);
    });

    test('Displays an error snackbar and does not redirect when register fails', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.route(server + '/user/register', async (route) => {
            await route.fulfill({
                status: HttpStatus.BAD_REQUEST,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        msg: 'Invalid username',
                    }
                ])
            });
        });

        await page.goto(registerPage);
        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('a');

        const passwordField = page.locator('[type="password"]');
        passwordField.fill('a');
        await page.waitForTimeout(2000);
        const button = page.locator('[type="submit"]');
        await button.click();
        await page.waitForSelector('text=Invalid username');
        const title = await page.title();
        expect(title.includes('Register')).toBe(true);
    });

    test('Username field displays validation errors successfully', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(registerPage);
        const usernameField = page.getByLabel(/Username/i);
        await usernameField.fill('@');

        const passwordField = await page.waitForSelector('#password');
        await passwordField.focus(); // validation errors do not display until the focus is lost for the first time

        await page.waitForSelector('text=Username must be at least five characters');
        await page.waitForSelector('text=Username must start with an English letter and contain only alphanumeric values');;
        await usernameField.fill('');
        await page.waitForSelector('text=Username is required');
        await usernameField.fill('a'.repeat(11));
        await page.waitForSelector('text=Username must be no longer than 10 characters');
    });

    test('Password field displays validation errors successfully', async ({ page }) => {
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill(rejectRequest());
        });

        await page.goto(registerPage);
        const usernameField = page.getByLabel(/Username/i);

        const passwordField = await page.waitForSelector('#password');
        await passwordField.fill('1');
        await usernameField.focus(); // validation errors do not display until the focus is lost for the first time
        await page.waitForSelector('text=Password must be at least six characters');

        await passwordField.fill('');
        await page.waitForSelector('text=Password is required');
    });
});