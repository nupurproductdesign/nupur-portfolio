// Screenshots the top nav at desktop and phone widths, with WORK active and with the chat open.
// Usage: node scripts/shoot-nav.mjs [outDir]   (dev server must be running on :3000)
import { chromium } from "playwright";

const out = process.argv[2] || "screenshots";
const browser = await chromium.launch();
const report = [];
for (const width of [1440, 820, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const nav = page.locator(".topnav");
  await nav.screenshot({ path: `${out}/nav-${width}-work.png` });
  const tabsLeftClosed = await page.evaluate(() => document.querySelector(".tabs").getBoundingClientRect().left);
  await page.click(".askpill");
  await page.mouse.move(5, 600); // move off the pill so the × shows its resting state
  await page.waitForTimeout(900);
  await nav.screenshot({ path: `${out}/nav-${width}-chat.png` });
  report.push({ tabsLeftClosed, ...(
    await page.evaluate(() => {
      const r = (el) => el && el.getBoundingClientRect();
      const tab = document.querySelector('.tabs a[aria-current="true"]');
      const t = document.querySelector(".askpill .t"), pill = document.querySelector(".askpill");
      const navR = r(document.querySelector(".topnav"));
      return {
        width: innerWidth,
        navHeight: navR.height,
        overflowX: document.documentElement.scrollWidth > innerWidth,
        activeTab: tab?.textContent,
        tabUnderlineGapToTabBottom: parseFloat(getComputedStyle(tab, "::after").bottom),
        pillTop: r(pill).top, pillBottomGap: navR.bottom - r(pill).bottom,
        labelVisible: getComputedStyle(t).display !== "none",
        labelUnderlineGapToPillBottom: r(pill).bottom - (r(t).bottom - parseFloat(getComputedStyle(t, "::after").bottom)),
        tabsLeft: r(document.querySelector(".tabs")).left,
        tabsCenterY: (r(tab).top + r(tab).bottom) / 2, pillCenterY: (r(pill).top + r(pill).bottom) / 2,
      };
    }))
  });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
