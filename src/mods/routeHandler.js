const scraper = require("./webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require ("./zipper");

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
		fs.writeFile(j(__dirname, "..","static","files", "file.txt"), json.data, (err) => {
			if (err) return res.json({ text : err.stack})
			res.json({ text : "File Written ! "})
		})
	})
	
	app.post ( "/fs/append" , ( req, res ) => {
		let json = req.body;
		//log(json);
		fs.appendFile(j(__dirname, "..","static","files", "file.txt"), json.data, (err) => {
			if (err) return res.json({ text : err.stack})
			res.json({ text : "File Written ! "})
		})
	})
	
	app.get("/fs/read", (req, res) => {
		fs.readFile(j(__dirname, "..","static","files", "file.txt"), ( err, txt ) => {
			if (err) return res.json({ text : err.stack})
			res.json({text : txt.toString()})
		})
	})
	
	app.post("/zip/files", (req ,res) => {
		let files = false, out = false;
		({files, out }= req.body);
		if ( ! ( out && files)) return res.json({error : "files / out missing ! "})
		setTimeout ( async () => {let txt = await zipper.c( files, j(__dirname, "..", "static", "files", "zip", out)); log(txt)}, 0);
		res.json({text : "Compression started for " + JSON.stringify(files)})
	})
	
	app.post("/zip/dir", (req ,res) => {
		let dir = false, out = false;
		({dir, out }= req.body);
		if ( ! ( out && dir)) return res.json({error : "files / out missing ! "})
		setTimeout ( async () => {

let files = await ( new Promise ( resolve => {	
	fs.readdir(dir , (err, files) =>{
		if( err) { log(err); return resolve([])}
		resolve(files.map(file => j(dir, file)) );
	});
}))
let txt = await zipper.c( files, j(__dirname, "..", "static", "files", "zip", out));
log(txt)}, 0);
		res.json({text : "Compression started for " + JSON.stringify(dir)})
	})
	
}