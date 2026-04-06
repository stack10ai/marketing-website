import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://staging-141f28ad.stack10.ai/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Extract the actual computed background colours of every card on the page
  const cardData = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="card"], [class*="bento"], [class*="approach"]');
    const results = [];
    for (const card of cards) {
      const s = getComputedStyle(card);
      const bg = s.backgroundColor;
      const text = (card.querySelector('h3, h4') || {}).textContent || '';
      const rect = card.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 50 && text) {
        // Get parent section bg
        let parent = card.parentElement;
        let parentBg = 'unknown';
        while (parent) {
          const pbg = getComputedStyle(parent).backgroundColor;
          if (pbg && pbg !== 'rgba(0, 0, 0, 0)') { parentBg = pbg; break; }
          parent = parent.parentElement;
        }
        results.push({ title: text.trim(), cardBg: bg, sectionBg: parentBg, width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    }
    return results;
  });

  console.log(JSON.stringify(cardData, null, 2));

  // Screenshot each card section tightly
  const sections = ['approach', 'services', 'why'];
  for (const keyword of ['discovery to production', 'Everything you need', 'Built differently']) {
    await page.evaluate((kw) => {
      const h2s = document.querySelectorAll('h2');
      for (const h2 of h2s) {
        if (h2.textContent.includes(kw)) { h2.scrollIntoView({ block: 'start' }); break; }
      }
    }, keyword);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/cards-${sections.shift()}.png` });
  }

  await browser.close();
})();
