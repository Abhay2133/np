const adm = require("adm-zip-node");

function compress(files = [], out = false) {
	return new Promise(res => {
		const zip = new adm();
		files.forEach((file) => zip.addLocalFile(file));
		if (out) {
			zip.writeZip(out)
			return res({ text: files.length + " files compressed ! " })
		}
		return res(zip.toBuffer())
	});
}

function compressDir(dir = false, out = false) {
	return new Promise( async (res) => {
		if (!dir) return res({ error: "Dir is not defined !" })
		let files = await(new Promise(resolve => {
			fs.readdir(dir, (err, files) => {
				if (err) { log(err); return resolve([]) }
				resolve(files.map(file => j(dir, file)));
			});
		}))
		let data = await compress (files, j(__dirname, "..", "static", "files", "zip", out));
		res(data)
	})
}

module.exports = {
	c: compress,
	cdir : compressDir
}