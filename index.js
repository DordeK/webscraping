const browserObj = require('./browser.js')
const scraperController = require('./pageController.js')

let browserInstance =  browserObj.startBrowser()
scraperController(browserInstance)
