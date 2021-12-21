const hbs = require("express-handlebars"),
	fs = require("fs");

module.exports = async () => {
	let loadFiles = fs.readFileSync(j(sdir, "public", "js", "loadFiles.js")) || "";
	let css = fs.readFileSync(j(sdir, "public", "css", "ui.css")) || "";
	let engine = hbs.create({
		defaultLayout: "main",
		helpers: {
			hn() {
				let host =
					process.env.NODE_ENV === "production"
						? "https://nexpp.herokuapp.com/"
						: "http://localhost:" + _port;
				return host;
			},
			cdn () {
				let cdn =
					process.env.NODE_ENV === "production"
						? "https://cdn2132.herokuapp.com"
						: "http://localhost:9000";
				return cdn;
			},
			isDev() {
				return !(process.env.NODE_ENV === "production");
			},
			loadFiles() {
				return loadFiles;
			},
			style() {
				return css;
			},
		},
		extname: ".hbs",
	}).engine;
	return engine;
};
