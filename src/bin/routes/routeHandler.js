const { Stream } = require("stream");
const { getVQ, save } = require("../ytdl");
const scraper = require("../webScraper.js"),
	colors = require("colors"),
	fs = require("fs"),
	zipper = require("../zipper"),
	hlpr = require("../hlpr.js"),
	urlm = require("url"),
	{getInfo} = require("../ydl")
	
const img = require("image-to-base64");

module.exports = function (app) {
	app.use((req, res, next) => {
		let mc = {
			GET: "green",
			POST: "yellow",
			PUT: "blue",
			DELETE: "red",
		};
		process.stdout.write("\n" + colors[mc[req.method]](req.method)+" "+ req.url);
		next();
	});

	app.use((req, res, next) => {
		let ts = require("./templates.js")(req, res);
		for (let url in ts) {
			app.get(url, (_req, _res) => {
				let t = ts[url](_req);
				_res.render(t.view, t);
			});
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
			return res.download(file_path, (err) =>log(err || "\nDownloading %s !",req.query.file ));
		}
		res.render("download");
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

	app.post("/img", async (req, res) => {
		let { url } = req.body;
		if (url[0] == "/") url = j(pdir, url);
		img(url)
			.then((data) => res.send(data))
			.catch((err) => res.send(err));
	});

	app.post("/ytdl/getVQ", async (req, res) => {
		let { url } = req.body;
		let vq = await getVQ(url);
		if(fs.existsSync(j(sdir, "ytdl", vq.videoId))) fs.rmSync(j(sdir, "ytdl", vq.videoId), {recursive : true })
		res.json(vq);
	});

	app.post("/ytdl/save", async (req, res) => {
		let { id, quality } = req.body;
		if (fs.existsSync(j(sdir, "ytdl", id, "stats.json"))) {
			let data = false;
			stdout(" "+ true);
			try {
				data = JSON.parse(fs.readFileSync(j(sdir, "ytdl", id, "stats.json")));
			} catch (e) {
				data = false;
				log(e);
			}
			if (data) return res.json(data);
		}
		stdout("Starting Job")
		let info = await save(id, quality);
		res.json(info);
	});

	app.get("/ytdl/download/:id", (req, res) => {
		let id = req.params.id;
		if (!fs.existsSync(j(sdir, "ytdl", id)))
			return res.json({ error: "Video doesn't exists" });
		let name = require(j(sdir, "ytdl", id, "stats.json")).name;
		let uri = j(sdir, "ytdl", id, name);
		res.download(uri, () => {
			setTimeout(
				() => fs.rmSync(j(sdir, "ytdl", id), { recursive: true }),
				10000
			);
		});
	});
	
	app.get("/ydl/q/:id",async (req, res) => {
		let id = req.params.id,
			data = await getInfo(id, req.query.extra)
		res.json(data);
	})
	
};
