const exp = require("express"),
	app = exp(),
	rh = require("./mods/routeHandler.js"),
	bodyParser = require('body-parser'),
	hbs = require("express-handlebars"),
	compression = require('compression'),
	hlpr = require("./mods/hlpr")

global.log = (...args) => console.log(...args);
global.j = require("path").join
global.basename = require("path").basename
app.locals.env = process.env.NODE_ENV == "production" ? "pro" : "dev"
app.locals.port = process.env.PORT || 3000

let imgs = hlpr.readdir
let engine = hbs.create({
		defaultLayout: 'main',
		helpers: {
			hn () {
				let host = app.locals.env == "pro" ? "https://nexpp.herokuapp.com/" : "http://localhost:" + app.locals.port;
				return host;
			},
			eruda () {
				let eruda = process.env.NODE_ENV == "production" ? "" : "eruda"
				return eruda;
			}
		},
		extname: '.hbs'
	}).engine

app.engine('.hbs', engine);
app.set('view engine', '.hbs');
app.set('views', j(__dirname, "static", "views"));

app.use(exp.static(j(__dirname, "static", "public")));
app.use(bodyParser.json())
app.use(compression())
rh(app);

app.listen(app.locals.port, () => log("Server started at port :", app.locals.port))