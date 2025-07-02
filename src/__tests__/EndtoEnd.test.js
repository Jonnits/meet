/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';

describe('show/hide event details', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  }, 30000);

  afterAll(() => {
    browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });
});

describe('filter events by city', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  test('When user hasn\'t searched for a city, show upcoming events from all cities', async () => {

    const eventCount = await page.$$eval('.event', (events) => events.length);
    expect(eventCount).toBe(32);
  });

  test('User should see a list of suggestions when they search for a city', async () => {

    await page.click('#city-search input');
    
    await page.type('#city-search input', 'Berlin');
    
    await page.waitForSelector('.suggestions li', { timeout: 3000 });
    
    const suggestions = await page.$$('.suggestions li');
    expect(suggestions.length).toBeGreaterThan(0);
    
    const berlinSuggestion = await page.$eval('.suggestions', (suggestionsList) => {
      const items = Array.from(suggestionsList.querySelectorAll('li'));
      return items.some(item => item.textContent.includes('Berlin'));
    });
    expect(berlinSuggestion).toBe(true);
  });

  test('User can select a city from the suggested list', async () => {
    await page.click('#city-search input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#city-search input', 'Berlin');
    
    await page.waitForSelector('.suggestions li');
    
    await page.evaluate(() => {
      const suggestions = document.querySelectorAll('.suggestions li');
      for (let suggestion of suggestions) {
        if (suggestion.textContent.includes('Berlin')) {
          suggestion.click();
          break;
        }
      }
    });
    
    await page.waitForTimeout(1000);
    
    const inputValue = await page.$eval('#city-search input', (input) => input.value);
    expect(inputValue).toBe('Berlin, Germany');
    
    const eventLocations = await page.$$eval('.event p:nth-child(3)', (locationElements) => {
      return locationElements.map(element => element.textContent);
    });
    
    eventLocations.forEach(location => {
      expect(location).toContain('Berlin');
    });
    
    expect(eventLocations.length).toBeLessThan(32);
    expect(eventLocations.length).toBeGreaterThan(0);
  });

  test('User can clear the city filter to see all events again', async () => {

    await page.click('#city-search input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    await page.waitForSelector('.suggestions li');
    
    await page.evaluate(() => {
      const suggestions = document.querySelectorAll('.suggestions li');
      for (let suggestion of suggestions) {
        if (suggestion.textContent.includes('See all cities')) {
          suggestion.click();
          break;
        }
      }
    });
    
    await page.waitForTimeout(1000);
    
    const eventCount = await page.$$eval('.event', (events) => events.length);
    expect(eventCount).toBe(32);
    
    const eventLocations = await page.$$eval('.event p:nth-child(3)', (locationElements) => {
      return locationElements.map(element => element.textContent);
    });
    
    const uniqueCities = [...new Set(eventLocations)];
    expect(uniqueCities.length).toBeGreaterThan(1);
  });
});