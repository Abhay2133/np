const { Stream } = require("stream");
const scraper = require("../webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require("../zipper"),
	hlpr = require("../hlpr.js"),
	urlm = require("url");
const img = require("image-to-base64");

module.exports = function (app) {
	app.use((req, res, next) => {
		let mc = {
			GET: "green",
			POST: "yellow",
			PUT: "blue",
			DELETE: "red",
		};
		log(colors[mc[req.method]](req.method), req.url);
		next();
	});

	app.use((req, res, next) => {
		let ts = require("./templates.js")(req, res);
		for( let url in ts ) {
			app.get( url, (_req, _res) => {
				let t = ts[url](_req);
				_res.render( t.view, t )
			 })
		}
		next();
	});

	app.post("/uploads", (...args) => require("./uploads")(...args));
	
	app.post("/imgD", (...args) => {
		require("./imgD.js")(...args);
	});

	app.post("/fs/:opr", (req, res) =>
		fs[req.params.opr + "File"](
			j(sdir, "public", "file.txt"),
			req.body.data,
			(err) => {
				if (err) return res.json({ text: err.stack });
				res.json({ text: "File Written ! " });
			}
		)
	);

	app.post("/fm", (...a) => require("./fm").api(...a));

	app.get("/fs/read", (req, res) =>
		fs.readFile(j(sdir, "public", "file.txt"), (err, txt) => {
			if (err) return res.json({ text: "File is Empty" });
			res.json({ text: txt.toString() });
		})
	);

	app.get("/download*", (req, res) => {
		if (req.query.file) {
			let file_path = j(sdir, "files", req.query.file);
			return res.download(file_path, (err) =>
				fs.unlink(file_path, (err) => log("Deleted", basename(file_path)))
			);
		}
		res.render("download", {
			filename: basename(req.query.did),
			url: req.query.did,
		});
	});

	app.get("/fstat", async (req, res) => {
		let ctime = await hlpr.gct(j(__dirname, "..", "static", "downloads")),
			et = hlpr.te(ctime) + " s";
		log(et);
		res.send(et);
	});

	app.get("/gallery", (...args) => {
		require("./gallery.js")(...args);
	});

	app.get("/getUploads", (req, res) =>
		res.json(fs.readdirSync(j(sdir, "files", "uploads")))
	);
	
	app.post("/img", async ( req, res ) => {
		let {url} = req.body;
		if ( url[0] == "/" ) url = j(pdir, url)
		img(url)
		.then( data => res.send(data))
		.catch ( err => res.send(err))
	})
}
