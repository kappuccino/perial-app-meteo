const puppeteer = require('puppeteer')

const city = process.argv[2] || 'paris'
console.log('City=', city)

;(async () => {
	console.log('Open Chrome')
	const browser = await puppeteer.launch({headless: true})


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

	await screenshotDOMElement('.vk_c.card-section');
	await browser.close()

	console.log('Done')
})()