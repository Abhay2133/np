const fs = require("fs");

module.exports = () => {
	return {
		"/": (req) => ({ view: "index", title: false, mainHeading: "" }),
		"/?": (req) => ({ view: "index", title: false, mainHeading: "" }),
		"/fs": (req) => ({
			view: "fs",
			title: "FS module Testing",
			mainHeading: "FS module Testing",
		}),
		"/imgD": (req) => ({ view: "imgD", title: "Image Downloader", mainHeading: "" }),
		"/fm*": (req) => ({
			view: "fm",
			title: "File Manager",
			mainHeading: "File Manager",
			ls: require("./fm").ls(req.params["0"]),
		}),
		"/uploads": (req) => ({
			view: "uploads",
			title: "Uploads",
			mainHeading: "Uploads",
			files: fs.readdirSync(j(sdir, "files", "uploads")),
		}),
	};
};
