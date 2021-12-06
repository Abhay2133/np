const fs = require("fs")

function readir (path) {
	return new Promise ( res =>{
		fs.readir(path, (err, files) =>{
			if (err) return res ([])
			res(files);
		})
	})
}

function delDdir ( dir ) {
	return new Promise ( res => {
		process.stdout.write("\nDeleting " + dir);
		let path = j(__dirname, "..", "static", "downloads", dir);
		fs.rm(path, {recursive : true}, (err) => {
			fs.rmdir( path , (err) => res(process.stdout.write(" ! \n")))
		})
	})
}

module.exports = {
	delDdir : delDdir,
	readir : readir
}