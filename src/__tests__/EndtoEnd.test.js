/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';

describe('show/hide event details', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page    = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  }, 30000);

  afterAll(() => browser.close());

  test('An event element is collapsed by default', async () => {
    const details = await page.$('.event .details');
    expect(details).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const details = await page.$('.event .details');
    expect(details).toBeDefined();
  });

  test('User can collapse an event to hide details', async () => {
    await page.click('.event .details-btn');
    const details = await page.$('.event .details');
    expect(details).toBeNull();
  });
});

describe('filter events by city', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page    = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  }, 30000);

  afterAll(async () => browser.close());

  test("When user hasn't searched for a city, show upcoming events from all cities", async () => {
    const count = await page.$$eval('.event', evs => evs.length);
    expect(count).toBe(32);
  });

  test('User should see a list of suggestions when they search for a city', async () => {
    await page.click('#city-search input');
    await page.type('#city-search input', 'Berlin');
    await page.waitForSelector('.suggestions li', { timeout: 10000 });

    const suggestions = await page.$$('.suggestions li');
    expect(suggestions.length).toBeGreaterThan(0);

    const hasBerlin = await page.$eval('.suggestions', ul =>
      Array.from(ul.querySelectorAll('li')).some(li =>
        li.textContent.includes('Berlin')
      )
    );
    expect(hasBerlin).toBe(true);
  }, 15000);

  test('User can select a city from the suggested list', async () => {
    await page.click('#city-search input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#city-search input', 'Berlin');
    await page.waitForSelector('.suggestions li', { timeout: 10000 });

    await page.evaluate(() => {
      const items = document.querySelectorAll('.suggestions li');
      items.forEach(li => {
        if (li.textContent.includes('Berlin')) li.click();
      });
    });

    await page.waitForTimeout(2000);

    const inputVal = await page.$eval('#city-search input', i => i.value);
    expect(inputVal).toBe('Berlin, Germany');

    const locations = await page.$$eval(
      '.event p:nth-child(3)',
      nodes => nodes.map(n => n.textContent)
    );

    locations.forEach(loc => expect(loc).toContain('Berlin'));
    expect(locations.length).toBeGreaterThan(0);
    expect(locations.length).toBeLessThan(32);
  }, 19000);

/*
  test('User can clear the city filter to see all events again', async () => {
    await page.click('#city-search input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.click('#city-search input');
    await page.waitForSelector('.suggestions li', { timeout: 10000 });

    await page.evaluate(() => {
      const items = document.querySelectorAll('.suggestions li');
      items.forEach(li => {
        if (li.textContent.includes('See all cities')) li.click();
      });
    });

    await page.waitForTimeout(2000);

    const count = await page.$$eval('.event', evs => evs.length);
    expect(count).toBe(32);

    const locs = await page.$$eval(
      '.event p:nth-child(3)',
      nodes => nodes.map(n => n.textContent)
    );

    const unique = Array.from(new Set(locs));
    expect(unique.length).toBeGreaterThan(1);
  }, 20000);
  */
});
