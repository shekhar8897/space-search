const puppeteer=require('puppeteer');

const URL='https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json';
function extractItems(){
    const extractedItems=Array.from(document.querySelectorAll("pre"));
    //const extractedItems=Array.from(document.querySelectorAll("#boxes > div.box"))
    const items=extractedItems.map(ele=>ele.innerText);
    return items;
}

async function scrapeInfiniteScrollItems(page,extractItems,delay=1000){
    let items=[];
    try{
        
        let previousHeight;
        while(items)
        {
            items=await page.evaluate(extractItems);
            previousHeight=await page.evaluate("document.body.scrollHeight");
            await page.evaluate("window.scrollTo(0,document.body.scrollHeight)");
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`)
            await page.waitFor(delay);
            
        }
    }catch(error)
    {
        console.error(error);
    }
    return items;
}

async function main(){
     const browser= await puppeteer.launch({headless:false});
     const page = await browser.newPage();
     page.setViewport({width:1280,height:1000});
     await page.goto(URL);

    // const targetItemCount=4154;

    
     const items= await scrapeInfiniteScrollItems(
         page,
         extractItems,
        //targetItemCount
     );

     console.log(items);

}

main();
