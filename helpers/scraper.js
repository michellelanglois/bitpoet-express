/*
Functions related to scraping text of submitted webpages
 */

var puppeteer = require('puppeteer');

// gets inner text from provided path; calls callback function with innertext of scraped page
exports.scrape = async (path, callback) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    // so that puppeteer will not load images and media
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'document') {
            request.continue();
        } else {
            request.abort();
        }
    });
    await page.goto(path).catch(e => console.error(e));
    const innertext = await page.evaluate(() => {
        return document.querySelector('body').innerText;
    });
    await browser.close();
    callback(null, innertext);
}


