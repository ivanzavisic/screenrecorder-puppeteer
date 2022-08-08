const express = require('express');
const puppeteer = require('puppeteer');
const {PuppeteerScreenRecorder} = require("puppeteer-screen-recorder");
const {installMouseHelper} = require('./install-mouse-helper');

const app = express();

//runam sa node index.js

const port = 5000;

app.get('/content', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});
//ako želim na chromu


//ako želim puppeteer , onda ova ruta
app.get('/execute', async (req, res) => {
    res.json({message: 'ok'});
    const browser = await puppeteer.launch({
        headless: false
    });
    const SavePath = './test/demo.mp4';
    const page = await browser.newPage();
    await installMouseHelper(page);
    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(SavePath);
    await page.goto(`http://localhost:${port}/content`);
    await page.click('[aria-label="Alles akzeptieren"]');

    await page.waitForTimeout(10 * 1000);
    await recorder.stop();
    await browser.close();
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

