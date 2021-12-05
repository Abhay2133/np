const exp = require("express"),
	app = exp(),
	rh = require("./mods/routeHandler.js"),
	bodyParser = require('body-parser'),
	hbs = require("express-handlebars").create({
		defaultLayout: 'main',
		helpers: {
			hn () {
				let host = app.locals.env == "pro" ? "https://nexpp.herokuapp.com/" : "http://localhost:" + app.locals.port;
				return host;
			}
		}
	});

global.log = (...args) => console.log(...args);
global.j = require("path").join
global.basename = require("path").basename
app.locals.env = process.env.NODE_ENV == "production" ? "pro" : "dev"
app.locals.port = process.env.PORT || 3000

// hbs.create({
// 	defaultLayout: 'main',
// 	helpers: {
// 		hn: function () {
// 			let host = app.locals.env == "pro" ? "https://nexpp.herokuapp.com/" : "http://localhost:" + app.locals.port;
// 			return host;
// 		},
// 	}
// })
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', j(__dirname, "static", "views"));

app.use(exp.static(j(__dirname, "static", "public")));
app.use(bodyParser.json())
rh(app);

app.listen(app.locals.port, () => log("Server started at port :", app.locals.port))