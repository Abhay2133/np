const exp = require("express"),
	app = exp(),
	rh = require("./mods/routeHandler.js"),
	bodyParser = require('body-parser')
	
global.log = ( ...args ) => console.log(...args);
global.j = require("path").join
global.basename = require("path"). basename

app.locals.port = process.env.PORT || 3000
app.use(exp.static(j(__dirname, "static", "public")));
app.use(bodyParser.json())
rh(app);

app.listen(app.locals.port, () => log("Server started at port :", app.locals.port)) 