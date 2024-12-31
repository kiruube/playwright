import { test } from '@playwright/test';
import LoginPage from "../pages/LoginPage";
import { decrypt } from "../utils/CryptojsUtil";
import { encryptEnvFile } from "../utils/EncryptEnvFile";
import logger from '../utils/LoggerUtils';

test('login test', async ({ page }) => {  
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername(decrypt(process.env.userid!));
  await loginPage.fillPassword(decrypt(process.env.password!));
  const homePage = await loginPage.clickLoginButton();
  await homePage.expectServiceTitleToBeVisible();
  logger.info('Login test successful');
});

test('encrypt environment variables', async () => {
  encryptEnvFile();
});