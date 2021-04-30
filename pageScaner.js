const scraperObj = {
    url:'https://books.toscrape.com',
    async scraper(browser, category){

        let page = await browser.newPage();
        console.log(`Navigatingo to ${this.url}`);
        await page.goto(this.url);

        let selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links, _category) => {
            links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
            let link = links.filter(tx => tx !== null)[0];
            return link.href;
        }, category);

        await page.goto(selectedCategory);

        let scrapedData = [];
        async function scrapeCurrentPage(){
            await page.waitForSelector('.page_inner')
            let urls = await page.$$eval('section ol > li', links =>{
                links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "in stock" )
                links = links.map(el => el.querySelector('h3 > a').href)
                return links
            })
        

        let pagePromis = (link) => new Promise(async(resolve, reject)=>{
            let dataObj = {};
            let newPage= await browser.newPage();
            await newPage.goto(link);
            try {
                    dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text=> text.textContent)
                    dataObj['bookPrice'] = await newPage.$eval('.product_main > p', text => text.textContent)
                    dataObj['noAvailible'] = await newPage.$eval('.instock.availability', text=>  text.textContent)
                    dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
                    dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
                    dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);       
            } catch (error) {
                console.log("not all data provided for book ", link );
            }
                resolve(dataObj)
                await newPage.close()
            }) 



           for(link in urls){
               let curentPageData = await pagePromis(urls[link])
               scrapedData.push(curentPageData)
           } 


           let nextButtonExist  = false;
           
            try {
                const nextBtn = await page.$eval('.next > a', a => a.textContent)
                nextButtonExist  = true;
            } catch (error) {
                nextButtonExist  = false
            }

            if(nextButtonExist){
                await page.click('.next > a')
                console.log("Next page");
                return scrapeCurrentPage();
            }
            await page.close();
            return scrapedData;
        }

        let data = await scrapeCurrentPage()
        console.log(data)
        return data
    }
}
module.exports = scraperObj;
