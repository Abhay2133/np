const { Stream } = require("stream");
const scraper = require("../webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require("../zipper"),
	hlpr = require("../hlpr.js"),
	templates = require("./templates.js")(),
	urlm = require("url");

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

	app.post("/uploads", (...args) => require("./uploads")(...args));

	app.use((req, res, next) => {
		if (Object.keys(templates).includes(req.url) && req.method == "GET") {
			let template = templates[req.url];
			return res.render(template.view, template);
		}
		next();
	});

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

	app.post("/fm", (...args) => require("./fm")());

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
};
