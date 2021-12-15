const hbs = require("express-handlebars"),
	fs = require("fs")


module.exports = async () => {
	let loadjs = await getloadjs();
	let engine = hbs.create({
		defaultLayout: 'main',
		helpers: {
			hn () {
				let host = process.env.NODE_ENV === "production" ? "https://nexpp.herokuapp.com/" : "http://localhost:" + _port;
				return host;
			},
			isDev () {
				return (! ( process.env.NODE_ENV === "production" ))
			},
			loadjs () {
				return loadjs;
			}
		},
		extname: '.hbs'
	}).engine;
	return engine;
}


let getloadjs = () => new Promise( res => {
	fs.readFile(j(sdir, "public", "loadjs.js"), (err, data) => {
		if (err) return res("")
		res(data.toString());
	})
})