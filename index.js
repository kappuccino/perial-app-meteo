const puppeteer = require('puppeteer')

const city = process.env.CITY || process.argv[2] || 'paris'
console.log('City ==> ', city)

;(async () => {

	try{
		console.log('Open Chrome')

		const options = {
			headless: true,
			ignoreDefaultArgs: [
				'--disable-extensions'
			],
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',

				// debug logging
				'--enable-logging', '--v=1'
			]
		}

		// Pour Docker (crado)
		if(process.env.HOME === '/home/pptruser'){
			console.log('Using Docker')
			options.executablePath = '/usr/local/share/.config/yarn/global/node_modules/puppeteer/.local-chromium/linux-571375/chrome-linux/chrome'
		}

		const browser = await puppeteer.launch(options)

		console.log('New Page')
		const page = await browser.newPage()
		await page.setViewport({width: 1280, height: 1280});

		console.log(`Get "${city}" weather`)
		await page.goto(`https://www.google.fr/search?q=meteo+${city}`, {waitUntil: 'networkidle2'})

		async function screenshotDOMElement(selector, padding = 0) {

			const rect = await page.evaluate(selector => {
				const element = document.querySelector(selector);
				const {x, y, width, height} = element.getBoundingClientRect();
				return {left: x, top: y, width, height, id: element.id};
			}, selector);

			return await page.screenshot({
				path: `images/meteo-${city}.png`,
				clip: {
					x: rect.left - padding,
					y: rect.top - padding,
					width: rect.width + padding * 2,
					height: rect.height + padding * 2
				}
			});
		}

		await screenshotDOMElement('.vk_c.card-section>div:last-child')
		await browser.close()

	} catch (err) {
		console.log('🔥', err)
	}

	console.log('Done')
})()