const hbs = require("express-handlebars"),
	fs = require("fs");

module.exports = async () => {
	let loadjs = fs.readFileSync(j(sdir, "public", "js", "loadjs.js")) || "";
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
			isDev() {
				return !(process.env.NODE_ENV === "production");
			},
			loadjs() {
				return loadjs;
			},
			style() {
				return css;
			},
		},
		extname: ".hbs",
	}).engine;
	return engine;
};
