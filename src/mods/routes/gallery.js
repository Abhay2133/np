const fs = require("fs"),
	hlpr = require("../hlpr")

module.exports = async (req, res) => {
	let photos = await hlpr.readir(j(sdir, "public", "imgs")),
		photosrc = photos.map((img) => j("imgs", img));
	res.render("gallery", { photos : photosrc });
}