const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:8765/contact/', { waitUntil: 'networkidle2' });
    
    // Find all triggers
    const trigger = await page.$('.btn-maincolor');
    if (trigger) {
        console.log("Clicking trigger...");
        await trigger.click();
        // wait for modal
        await new Promise(r => setTimeout(r, 1000));
        console.log("Modal class list:", await page.evaluate(() => document.querySelector('.signup-modal-backdrop') ? document.querySelector('.signup-modal-backdrop').className : 'No Modal'));
    } else {
        console.log("No trigger found");
    }
    
    await browser.close();
})();
