const fetch = require("node-fetch"),
	parse = require("node-html-parser").parse,
	dwn = require('nodejs-file-downloader')

function imgDownloader(url) {
return new Promise (async ( res ) => {
	log("url :", url);
	var htm;
	try {
	htm = await fetch(url)
	} catch (e) {
		res({done : false})
		 return log("imgDownloader > fetch :", e.stack);
	}
	const html = await htm.text(),
	dom = parse(html),
		imgs = dom.querySelectorAll("img");
	log( { files2Download: imgs.length })
		for (let img of imgs) {
			let ds = "."
			try {
				let name = img.getAttribute("alt") || basename(img.getAttribute("src"))
				let d = new dwn({
					url: img.getAttribute("src"),
					directory: j(__dirname, "..", "static", "downloads", "imgs"),
					cloneFiles: false,
					fileName: name + ".png"
				})
				await d.download()
			} catch (e) {
				ds = "!"
			}
			process.stdout.write(ds);
		}
		res ({ done : true })
	});
}

module.exports = {
	imgD : imgDownloader
}