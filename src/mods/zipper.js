const adm = require("adm-zip");

function compress ( files = [], out = false) {
	return new Promise ( res => {
	out = out ? out : j(__dirname, "..", "static", "files", "zip", "new.zip");
	const zip = new adm();
	files.forEach( (file) => zip.addLocalFile(file) );
	zip.writeZip ( out )
	res({ text : files.length + " files compressed ! "})
	});
}

module.exports = {
	c : compress
}