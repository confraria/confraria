const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `file://${path.resolve(__dirname, "..", "build", "cv", "index.html")}`,
    { waitUntil: "networkidle2" }
  );
  await page.pdf({
    path: "build/confraria.cv.pdf",
    format: "A4",
    printBackground: true,
    margin: {
      top: "50px",
      left: "50px",
      right: "50px",
      bottom: "50px",
    },
  });
  await browser.close();
})();
