const fetch = require("node-fetch"),
	parse = require("node-html-parser").parse,
	dwn = require('nodejs-file-downloader')

async function imgDownloader ( url ) {
	
log("url :", url);
const htm = await fetch (url),
	html = await htm.text()
	dom = parse(html),
	imgs = dom.querySelectorAll("img");
	
log(imgs.length)
setTimeout (async ()=>{
	for(let img of imgs ) {
		try {
process.stdout.write(".");
let name = img.getAttribute("alt") || basename(img.getAttribute("src"))
let d = new dwn({
url : img.getAttribute("src"),
directory : j(__dirname, "..", "imgs"),
cloneFiles : false,
fileName :  name + ".png"
})
			await d.download()
		} catch (e) {
			log({error : img.getAttribute("src")})
		}
	}
},100);

return { files2Download: imgs.length}
}

module.exports = {
	id : imgDownloader
}