const fetch = require("node-fetch"),
	parse = require("node-html-parser").parse,
	log = (...a) => console.log(...a),
	Downloader = require("nodejs-file-downloader"),
	zipr = require('adm-zip-node'),
	bn = require("path").basename,
	ext = require("path").extname
	stdout = (...a) => process.stdout.write(a.join(" ")),
	fs = require("fs"),
	Url = require("url").URL,
	j = require("path").join

var ddir = "./imgD",
	upStats = (stats) => fs.writeFileSync(ddir+"/stats.json", JSON.stringify(stats))
	
function init ( dir ) {
	ddir += "/"+dir
	upStats = (stats) => fs.writeFileSync(ddir+"/stats.json", JSON.stringify(stats))
	if (fs.existsSync(ddir)) fs.rmSync(ddir, {recursive : true});
	if (! fs.existsSync(ddir)) fs.mkdirSync(ddir, {recursive : true});
}

async function imgD (url) {
	let u = new Url (url)
	let data = await fetch(url),
		html = await data.text();
		dom = parse(html),
		getN = img => {
			let alt = img.getAttribute("alt"),
				src = img.getAttribute("src"),
				extn = ext(bn(src))
			return typeof alt === "string" ? alt + extn : bn(src)
			//return bn(src)
		},
		getSrc = (img) => {
			let src = img.getAttribute("src")
			return src.startsWith("http") ? src : j(u.origin, src)
		},
		title = dom.querySelector("title").rawText

	let dd = j(u.hostname,u.pathname).split("/").join("_")
	init (dd, log(dd))
	
	let stats = {
			status : 1,
			done : false,
			imgs : 0,
			downloaded : 0,
			startedAt : Date.now(),
			failedUrls : [],
			lastD : 0
		},
		tick = setInterval(() => {
			stats.tick = Date.now()
			upStats (stats);
		}, 3000)
	upStats (stats);
			
	let imgs = dom.querySelectorAll("img").map( img => ({src : getSrc(img) , name : getN(img) }) )
	stats.imgs= imgs.length ; 
	upStats(stats);
	log("%i images found !", imgs.length)
	
	for( let img of imgs) {
		let { src , name } = img
		let status = await dl( src, ddir , name)
		if ( ! status ){ stats.failedUrls.push(src); continue }
		stats.downloaded += 1
		stats.lastD = Date.now()
		upStats(stats);
	}
	stats.status = 2
	upStats(stats)
	
	fs.readdir(ddir, (err, files ) => {
		if ( err ) return log(err)
		stats.status = 3
		upStats(stats);
		zip(files.map(file => ddir+"/"+file), ddir+"/"+title+".zip")
		stats.done = true
		upStats(stats);
		clearInterval(tick, log(stats))
	})
	
}

const dl = (url, dd, name ) => new Promise ( async res => {
	const downloader = new Downloader({
    url: url,
    directory: dd, 
    fileName : name
  });
  try {
    await downloader.download();
	res(true, stdout("."))
  } catch (error) {
      res(false, stdout(":"));
  }
})

const zip = ( files = [] , out = ddir + "/imgs.zip" ) => {
	if (! files.length ) return false;
	let st = Date.now()
	const zippr = new zipr();
	files.forEach( file => zippr.addLocalFile(file) )
	zippr.writeZip(out)
	let et = Date.now()
	log("\nCompressed in", ((et - st)/1000).toFixed(1)+" s")
	files.forEach( file => fs.rmSync(file) )
}


/*
status codes :-
 
 1 : Fetching Data
 2 : Downloading imgs
 3 : Zipping Files

*/

let url = process.argv[2] || "https://onepunch-manga.com/manga/onepunch-manreadchapters-manga-1-152/";
imgD(url)

module.exports = {
	imgD : imgD
}



