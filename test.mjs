import { chromium } from "playwright";

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    } else {
      console.log(`PAGE LOG: ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    console.log(`UNCAUGHT EXCEPTION: ${exception}`);
  });

  console.log("Navigating to page...");
  try {
    const response = await page.goto("http://localhost:8081/post/jupyter-lab-setup", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000); // give it a sec to run react
    console.log(`Status: ${response?.status()}`);
    
    // Check if body is empty or has React error overlay
    const content = await page.content();
    console.log("Length of HTML:", content.length);
    if (content.includes("404 - Post Not Found")) {
      console.log("Page says 404 POST NOT FOUND");
    } else if (content.includes("Getting Started: JupyterLab")) {
      console.log("Page RENDERED CONTENT CORRECTLY!");
    } else {
      console.log("Something else rendered.");
    }
  } catch (e) {
    console.log("FAILED to fetch", e);
  }

  await browser.close();
})();
