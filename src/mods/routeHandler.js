const { Stream } = require("stream");
const scraper = require("./webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require("./zipper"),
	hlpr = require("./hlpr.js"),
	routes = {
	"/" : "index",
	"/fs" : "fs",
	"/imgD" : "imgD"
}

module.exports = function (app) {

	app.use((a, b, c) => {
		log(colors.green(a.method), a.url);
		if ( Object.keys(routes).includes(a.url) && a.method == "GET" ) return b.render(routes[a.url]);
		c();
	})
	
	app.post("/imgD", async (req, res) => {
		let url = req.body.url;
		log("url :", url);
		await scraper.imgD (url);
		let zipBuff = await zipper.cdir(j(__dirname, ".." , "static", "downloads", "img"), "img.zip");
		res.download(j(__dirname, ".." , "static", "files", "zip", "img.zip"))
	})

	app.post("/fs/:opr", (req, res) => fs[req.params.opr + "File"](j(__dirname, "..", "static", "files", "file.txt"), req.body.data, (err) => {
			if (err) return res.json({ text: err.stack })
			res.json({ text: "File Written ! " })
		}))
	
	app.get("/fs/read", (req, res) => fs.readFile(j(__dirname, "..", "static", "files", "file.txt"), (err, txt) => {
			if (err) return res.json({ text: err.stack })
			res.json({ text: txt.toString() })
		}))
	
}