const adm = require("adm-zip-node"),
	fs = require("fs"),
	hlpr = require("./hlpr");

function compress(files = [], out = false) {
	return new Promise(res => {
		const zip = new adm();
		files.forEach((file) => zip.addLocalFile(file));
		if (out) {
			zip.writeZip(out)
			log("\n", files.length, "files compressed !")
			return res({ text: files.length + " files compressed ! " })
		}
		return res(zip.toBuffer())
	});
}

function compressDir(dir = false, out = false) {
	return new Promise( async (res) => {
		if (!dir) return res({ error: "Dir is not defined !" })
		let cdir = j(__dirname, ".." , "static", "downloads", dir)
		let files = await(new Promise(resolve => {
			fs.readdir(cdir, (err, files) => {
				if (err) { return resolve([]) }
				resolve(files.map(file => j(cdir, file)));
			});
		}))
		let data = await compress (files, j(__dirname, "..", "static", "files", "zip", out));
		if(out) await hlpr.delDdir(dir);
		res(data)
	})
}

module.exports = {
	c: compress,
	cdir : compressDir
}