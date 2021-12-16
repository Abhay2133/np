const fetch = require("node-fetch"),
	parse = require("node-html-parser").parse,
	dwn = require('nodejs-file-downloader'),
	fs = require("fs"),
	hlpr = require("./hlpr")

function imgDownloader(url, ddir = "imgs") { // ddir => download dir
return new Promise (async ( res ) => {
	if ( ! url ) return res ({status : "dead"});
	url = require("url").parse(url);
	log("webScraper.imgDownloader : Downloading Images !")
	var htm;
	try {
	htm = await fetch(url.href)
	} catch (e) {
		res({done : false})
		 return log("imgDownloader > fetch :", e.stack);
	}
	const html = await htm.text(),
	dom = parse(html),
		imgs = dom.querySelectorAll("img");
	log( { files2Download: imgs.length })
	await hlpr.delDdir(ddir, "Deleting older " + ddir);
	process.stdout.write("dwnld progress : ");
		for (let img of imgs) {
			let ds = "."
			let src = img.getAttribute("src"),
				origin = url.protocol + "//" + url.host
			if( ! src ) continue;
			let name = img.getAttribute("alt") || basename(src)
			if ( ! src.startsWith("http")) src = src.startsWith("/") ? (origin + src) : (origin + "/" + src);
			//log(src);
			try {
				let d = new dwn({
					url: src,
					directory: j(sdir, "downloads", ddir),
					cloneFiles: false,
					fileName: name + ".png"
				})
				await d.download()
			} catch (e) {
				ds = "\n! : "+ src
			}
			process.stdout.write(ds);
		}
		res ({ status : "done" })
	});
}

module.exports = {
	imgD : imgDownloader
}