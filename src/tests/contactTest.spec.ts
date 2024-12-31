import { test } from "@playwright/test";
import { decrypt } from "../utils/CryptojsUtil";
import logger from "../utils/LoggerUtils";
import cdata from "../testdata/contacts.json";
import { convertCsvFileToJsonFile } from "../utils/CsvtoJsonUtil";
import LoginPage from "../pages/LoginPage";
import { demoOutput } from "../utils/fakersample";
import { exportToCsv, exportToJson, generateTestData } from "../utils/FakerDataUtil";
// Data-driven tests using contact data
for (const contact of cdata) {
  test.skip(`Advance DD test for ${contact.firstName} `, async ({ page }) => {
    logger.info("Test for Contact Creation is started...");
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fillUsername(decrypt(process.env.userid!));
    await loginPage.fillPassword(decrypt(process.env.password!));
    const homePage = await loginPage.clickLoginButton();
    await homePage.expectServiceTitleToBeVisible();
    const contactsPage = await homePage.navigateToContactTab();
    await contactsPage.createNewContact(contact.firstName, contact.lastName);
    await contactsPage.expectContactLabelContainsFirstNameAndLastName(
      contact.firstName,
      contact.lastName
    );
    logger.info("Test for Contact Creation is completed");
  });
}

test.skip("csv to json", async () => {
   convertCsvFileToJsonFile("data.csv", "datademo.json"); 
});

test("demo faker", async () => {
  console.log(demoOutput);
});

test("faker", async () => {
  // Generate test data
  const testData = generateTestData(20);

  // Export data to JSON file
  exportToJson(testData, 'testData_en.json');

  // Export data to CSV file
  exportToCsv(testData, 'testData_en.csv'); 
});