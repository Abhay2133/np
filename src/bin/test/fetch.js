const https = require("https"),
os = require("os"),
fs = require("fs"),
bn = require("path").basename,
j = require("path").join,
ddr = require("nodejs-file-downloader"),
stdout = (...a) => process.stdout.write(a.join(" "))

const _get = (url, parse = false) => new Promise( res => {
	https.get(
		url,
		{headers : {"User-Agent" : os.platform()}},{headers : {"User-Agent" : os.platform()}},
		(r) => {
			let data = ""
			r.on("data", chuck => data += chuck)
			r.on("end", () => res(parse ? JSON.parse(data) : data));
	})
})

const dl = (url, ddir = "./", name ) => new Promise( res => {
	name = name || bn(url).split("?")[0]
	console.log(url, ddir, name)
	https.get(
		url,
		{headers : {"User-Agent" : os.platform()}},
		(r) => {
			r.on("error", (err) => res(err))
			let out = fs.createWriteStream(j(ddir, name))
			r.pipe(out)
			r.on("end", () => res(true))
		}
	)
})

module.exports = {
	_get : _get,
	dl : dl
}
/*
async function test (){
	let url = process.argv[2] || "https://api.github.com/users"
	let data = await dl(url, "./", "video.mp4");
	console.log(data)
}
test()
*/

 