const { Stream } = require("stream");
const scraper = require("./webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require("./zipper"),
	hlpr = require("./hlpr.js"),
	routes = {
	"/" : "index",
	"/fs" : "fs",
	"/imgD" : "imgD",
	"/fm" : "fm"
},
	urlm = require("url")

module.exports = function (app) {

	app.post("/imgD",  (...args) => {
		require("./routes/imgD.js")(...args);
	})

	app.post("/fs/:opr", (req, res) => fs[req.params.opr + "File"](j(__dirname, "..", "static", "public", "file.txt"), req.body.data, (err) => {
			if (err) return res.json({ text: err.stack })
			res.json({ text: "File Written ! " })
		}))
	
	app.post("/fm", (...args) => require("./routes/fm")() )
	
	app.get("/fs/read", (req, res) => fs.readFile(j(__dirname, "..", "static", "public", "file.txt"), (err, txt) => {
			if (err) return res.json({ text: "File is Empty" })
			res.json({ text: txt.toString() })
		}))
		
	app.get("/download*" ,(req, res) => {
		if (req.query.file ){
			let file_path = j(__dirname, "..", "static", "files", req.query.file);
			return res.download(file_path, (err) => fs.unlink(file_path, (err) => log("Deleted", basename(file_path))))
		}
		res.render("download" , {filename : basename(req.query.did), url : req.query.did })
	})
	
	app.get("/fstat",async (req, res ) => {
		let ctime = await hlpr.gct(j(__dirname, "..", "static", "downloads")),
			et = hlpr.te(ctime) + " s"
		log(et); res.send(et);
	})
	
	app.get("/gallery",  (...args) => {
		require("./routes/gallery.js")(...args);
	})
	
	app.use((a, b, c) => {
		//log(colors.green(a.method), a.url);
		if ( Object.keys(routes).includes(a.url) && a.method == "GET" ) return b.render(routes[a.url]);
		c();
	})
	
}