const puppeteer  = require('puppeteer');
startBrowser = async () => {
    let browser;
    try {
        console.log('opening browser...');
        browser = await puppeteer.launch({
                headless: false,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
        })
    } catch (error) {
    console.log("upss could not create browser instance => :", error); 
    }
    return browser
}

module.exports = {startBrowser}