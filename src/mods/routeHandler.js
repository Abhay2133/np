const scraper = require("./webScraper.js"),
	colors = require("colors"),
	fs = require("fs")

module.exports = function (app) {
	
	app.use( (a, b, c) => {
		log(colors.green(a.method), a.url);
		c();
	})
	
	app.get("/", (req, res) => {
		res.sendFile(j(__dirname, "..", "static", "views", "index.htm"))
	})
	
	app.post("/imgD", async (req, res) => {
		let url = req.body.url || false;
		let data = {};
		if(url) data = await scraper.id(url);
		res.json(data);
	})
	
	app.get("/fs", (req, res) => {
		res.sendFile(j(__dirname, "..", "static", "views", "fs.htm"));
	})
	
	app.post ( "/fs/write" , ( req, res ) => {
		let json = req.body;
		//log(json);
		fs.writeFile(j(__dirname, "..", "file.txt"), json.data, (err) => {
			if (err) return res.json({ text : err.stack})
			res.json({ text : "File Written ! "})
		})
	})
	
	app.get("/fs/read", (req, res) => {
		fs.readFile(j(__dirname, "..", "file.txt"), ( err, txt ) => {
			if (err) return res.json({ text : err.stack})
			res.json({text : txt.toString()})
		})
	})
	
}