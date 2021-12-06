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
},
	urlm = require("url")

module.exports = function (app) {

	app.use((a, b, c) => {
		log(colors.green(a.method), a.url);
		if ( Object.keys(routes).includes(a.url) && a.method == "GET" ) return b.render(routes[a.url]);
		c();
	})
	
	app.post("/imgD",  (req, res) => {
		let url = req.body.url,
			parsedUrl = urlm.parse(url),
			h = parsedUrl.host,
			host = h.length >= 2 ? h.split(".")[h.split(".").length - 2] : h;
			ddir = parsedUrl.pathname == "/" ? host : host+parsedUrl.pathname.substring(0, parsedUrl.pathname.length -1)
		//return log(ddir)
		setTimeout ( async () => {
		await scraper.imgD (url, ddir);
		let zipBuff = await zipper.cdir(j(__dirname, ".." , "static", "downloads", ddir), ddir+".zip");
		},0);
		res.json({url : "/download?did="+ddir+".zip"})
	})

	app.post("/fs/:opr", (req, res) => fs[req.params.opr + "File"](j(__dirname, "..", "static", "public", "file.txt"), req.body.data, (err) => {
			if (err) return res.json({ text: err.stack })
			res.json({ text: "File Written ! " })
		}))
	
	app.get("/fs/read", (req, res) => fs.readFile(j(__dirname, "..", "static", "public", "file.txt"), (err, txt) => {
			if (err) return res.json({ text: "File is Empty" })
			res.json({ text: txt.toString() })
		}))
		
	app.get("/download*" ,(req, res) => {
		if (req.query.file ) return res.download(j(__dirname, "..", "static", "files", "zip", req.query.file));
		res.render("download" , {filename : req.query.did })
	})
	
	
}