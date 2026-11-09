// Full-viewport screenshots at several widths, chat closed and open, plus an overflow check.
// Usage: node scripts/shoot-pages.mjs <outDir> [widths...]   (dev server must be running on :3000)
import { chromium } from "playwright";

const out = process.argv[2] || "screenshots";
const widths = process.argv.slice(3).map(Number);
const browser = await chromium.launch();
const report = [];
for (const width of widths.length ? widths : [1440, 1024, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: `${out}/page-${width}.png` });
  await page.screenshot({ path: `${out}/page-${width}-full.png`, fullPage: true });
  const closed = await overflow();
  await page.click(".askpill");
  await page.mouse.move(5, 890);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${out}/page-${width}-chat.png` });
  report.push({ width, overflowClosed: closed, overflowChat: await overflow() });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(report));
