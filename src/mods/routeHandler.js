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
			pU = urlm.parse(url),
			h = pU.host,
			host = h.length >= 2 ? h.split(".")[h.split(".").length - 2] : h;
			ddir = pU.pathname == "/" ? host : host+"_"+basename(pU.pathname)
		//return log(ddir)
		setTimeout ( async () => {
		await scraper.imgD (url, ddir);
		let zipBuff = await zipper.cdir(ddir, ddir+".zip");
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
		if (req.query.file ){
			let file_path = j(__dirname, "..", "static", "files", "zip", req.query.file);
			return res.download(file_path, (err) => fs.unlink(file_path, (err) => log("Deleted", basename(file_path))))
		}
		res.render("download" , {filename : req.query.did })
	})
	
	
}