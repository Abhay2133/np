const exp = require("express"),
	app = exp(),
	rh = require("./mods/routeHandler.js"),
	bodyParser = require('body-parser'),
	engine = require("express-handlebars").engine
	
global.log = ( ...args ) => console.log(...args);
global.j = require("path").join
global.basename = require("path"). basename

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', j(__dirname, "static", "views"));

app.locals.port = process.env.PORT || 3000
app.use(exp.static(j(__dirname, "static", "public")));
app.use(bodyParser.json())
rh(app);

app.listen(app.locals.port, () => log("Server started at port :", app.locals.port)) 