import test from "@playwright/test";
import { expect } from "@playwright/test";
import { HttpStatus } from "../../src/util/httpstatus.enum";

const client = 'http://localhost:3000';
const server = 'http://localhost:5000';
const loadAuthEndpoint = '/user';

test.describe.parallel('Mobile navigation + burger menu', async () => {
    test('Burger menus are invisible if the viewport width is higher than 780px', async ({ page }) => {
        await page.setViewportSize({ width: 781, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const mobileNav = page.locator('#mobile-nav');
        const burgerMenu = page.locator('#mobile-menu-button');

        expect(await mobileNav.isHidden()).toBe(true);
        expect(await burgerMenu.isHidden()).toBe(true);
    });

    test('Clicking the burger menu button opens the mobile navigation menu', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const nav = await page.waitForSelector('#mobile-nav');
        expect(await nav.isVisible()).toBe(true);
    });

    test('Displays four links when the user is not logged in', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const nav = await page.waitForSelector('text=Close');
        const links = await page.locator('#mobile-nav a').count();

        expect(links).toBe(4);
    });

    test('Displays five links when the user is logged in', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.fulfill({
                status: HttpStatus.OK,
                body: JSON.stringify({
                    _id: '1',
                    username: '1',
                    palette: 'indigo',
                    theme: 'light',
                }),
                contentType: 'application/json',
            });
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const nav = await page.locator('#mobile-nav').locator('text=Logout').waitFor();
        const links = await page.locator('#mobile-nav a').count();

        expect(links).toBe(5);
    });

    test('Closes the mobile menu when the Close button is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const close = await page.waitForSelector('text=Close');
        await close.click();
        await page.waitForTimeout(5000); // ensure that the menu has closed
        const nav = page.locator('#mobile-nav');
        expect(await nav.isHidden()).toBe(true);
    });

    test('Closes the menu when one of the links is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const homeLink = page.locator('#mobile-nav').locator('text=Home');
        await homeLink.waitFor();
        await homeLink.click();

        await page.waitForTimeout(5000); // ensure that the menu has closed
        const nav = page.locator('#mobile-nav');
        expect(await nav.isHidden()).toBe(true);
    });

    test('Closes the menu when the overlay is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 780, height: 500 });
        await page.route(server + loadAuthEndpoint, async (route) => {
            await route.abort();
        });

        await page.goto(client);
        const burgerMenu = page.locator('#mobile-menu-button');
        await burgerMenu.click();
        const nav = await page.waitForSelector('#mobile-nav');
        await page.mouse.click(700, 50);

        await page.waitForTimeout(5000); // ensure that the menu has closed
        expect(await nav.isHidden()).toBe(true);
    });
});