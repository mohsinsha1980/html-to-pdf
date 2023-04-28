const fs = require("fs");
const fx = require("fs-extra");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const path = require("path");
const data = require("./data.json");

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const html = fs.readFileSync(filePath, "utf-8");
  return hbs.compile(html)(data);
};

(async function () {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // const html = fs.readFileSync("sample.html", "utf-8");
    // const content = await page.setContent(html, {
    //   waitUntil: "domcontentloaded",
    // });
    const content = await compile("index", data);
    await page.setContent(content, {
      waitUntil: "domcontentloaded",
    });
    // await page.emulateMediaType("screen");

    const pdf = await page.pdf({
      path: "result.pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });
    console.log("Done creating pdf");
    await browser.close();
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
})();
