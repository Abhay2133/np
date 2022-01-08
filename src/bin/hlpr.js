const fs = require("fs");

function readir(path) {
	return new Promise((res) => {
		fs.readdir(path, (err, files) => {
			if (err) return res([]);
			res(files);
		});
	});
}

function delDdir(dir, m = false) {
	return new Promise((res) => {
		m = m || "\nDeleting dir : " + dir;
		process.stdout.write(m);
		let path = j(__dirname, "..", "static", "downloads", dir);
		fs.rm(path, { recursive: true }, (err) => {
			fs.rmdir(path, (err) => res(process.stdout.write(" ! \n")));
		});
	});
}

function timeElapsed(time) {
	return (
		parseInt((Date.now() / 1000).toString().split(".")[0]) -
		parseInt((time / 1000).toString().split(".")[0])
	);
}

const getctime = (file) =>
	new Promise((res) =>
		fs.stat(file, (err, stat) => {
			if (err) return log("\ngetctime > file", err);
			//log("\ngetctime > file : ", file);
			res(stat.ctimeMs);
		})
	);

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
	delDdir: delDdir,
	readir: readir,
	te: timeElapsed,
	gct: getctime,
	_get : _get,
	dl : dl
};
