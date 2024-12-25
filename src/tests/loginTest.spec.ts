import { expect, test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import logger from "../utils/LoggerUtils";
import { decrypt, verifyEnvironment } from "../utils/CryptojsUtil";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('Environment variables loaded:', {
  hasUsername: !!process.env.username,
  hasPassword: !!process.env.password,
  hasSalt: !!process.env.SALT
});

const authFile = "src/config/auth.json";

test.beforeAll(async () => {
  try {
    verifyEnvironment();
  } catch (error) {
    console.error('Environment verification failed:', error);
    throw error;
  }
});

test("simple login test with self heal", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername_selfheal("demo_selfheal");
});

test("simple login test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  if (!process.env.username || !process.env.password) {
    throw new Error('Username or password environment variables are not set');
  }
  
  try {
    await loginPage.navigateToLoginPage();
    await loginPage.fillUsername(decrypt(process.env.username));
    await loginPage.fillPassword(decrypt(process.env.password));
    const homePage = await loginPage.clickLoginButton();
    await homePage.expectServiceTitleToBeVisible();
    logger.info("Test for login is completed");
    await page.context().storageState({ path: authFile });
    logger.info("Auth state is saved");
  } catch (error) {
    logger.error(`Login test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
});

test.skip("Login with auth file", async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  await page.goto(
    // "https://mukunthanr2-dev-ed.lightning.force.com/lightning/page/home"
    'https://refactory-dev-ed.develop.lightning.force.com/lightning/setup/SetupOneHome/home'
  );
  await expect(page.getByRole("link", { name: "Accounts" })).toBeVisible();
});