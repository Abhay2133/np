const fetch = require("node-fetch"),
	parse = require("node-html-parser").parse,
	dwn = require('nodejs-file-downloader')

function imgDownloader(url) {
return new Promise (async ( res ) => {
	log("url :", url);
	const htm = await fetch(url),
		html = await htm.text()
	dom = parse(html),
		imgs = dom.querySelectorAll("img");

	log(imgs.length)
	setTimeout(async () => {
		for (let img of imgs) {
			try {
				process.stdout.write(".");
				let name = img.getAttribute("alt") || basename(img.getAttribute("src"))
				let d = new dwn({
					url: img.getAttribute("src"),
					directory: j(__dirname, "..", "static", "downloads", "imgs"),
					cloneFiles: false,
					fileName: name + ".png"
				})
				await d.download()
			} catch (e) {
				log({ error: img.getAttribute("src") })
			}
		}
		res ({ done : true })
	}, 100);
	log( { files2Download: imgs.length })
	});
}

module.exports = {
	imgD : imgDownloader
}