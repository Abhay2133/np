const formidable = require("formidable")

module.exports = (req, res) => {
	const form = new formidable.IncomingForm({uploadDir : j(sdir, "files", "uploads")})
	form.parse( req, (err, fields, files) => {
		if (err) return res.json(err);
		res.json({ status : "Done" });
	});
}