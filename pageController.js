const pageScanner = require('./pageScaner.js')
const scrapeAll = async (browserInstance)=>{
    let browser;
    try {
        browser = await browserInstance;
        let scrapedData={}
        scrapedData['travel'] = await pageScanner.scraper(browser, 'Travel');
        await browser.close();
        console.log(scrapedData);
    } catch (error) {
        console.log("could not resolve browser instance", error);
    }
}

module.exports = (browserInstance)=> scrapeAll(browserInstance)