const fs = require("fs");

function api(req, res, next) {
	let { opr, path = false} = req.body;
	if (opr == "ls") return res.json(ls(path));
	return res.json({ error: "invalid 'opr' !" });
}

function ls(path = j(sdir, "..")) {
	let dirs = [],
		files = [];
	path = path || j(sdir, "..")
	fs.readdirSync(path).forEach((file) => {
		if (fs.statSync(j(path, file)).isFile()) files.push(file);
		else dirs.push(file);
	});
	return { dirs: dirs, files: files, pwd: path };
}

module.exports = {
	ls: ls,
	api: api,
};
