module.exports = async () => {
console.clear()
global.log = (...args) => console.log(...args);
global.j = require("path").join
global.basename = require("path").basename
global.sdir = j(__dirname, "..", "static"),
global._port = process.env.PORT || 3000

const exp = require("express"),
	app = exp(),
	rh = require("./routeHandler.js"),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	hlpr = require("./hlpr"),
	exec = require("child_process").exec,
	engine = await require("./templateEngine")()

app.locals.env = process.env.NODE_ENV == "production" ? "pro" : "dev"
app.locals.port = _port

let imgs = hlpr.readdir 

app.engine('.hbs', engine);
app.set('view engine', '.hbs');
app.set('views', j(__dirname, "..", "static", "views"));

if( app.locals.env == "dev") exec("termux-open-url http://"+require("os").hostname() + ":" + _port + " && cdn", (err, stdout, stderr) => {
	log("Starting chrome")
	log(stdout, stderr)
});

app.use(exp.static(j(sdir, "public")));
app.use(bodyParser.json())
app.use(compression())
rh(app);

app.listen(app.locals.port, () => log("Server started at "+require("os").hostname() + ":" + _port, `in ${app.locals.env} mode`))

}