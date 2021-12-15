const fs = require("fs"),
	hlpr = require("../hlpr")

module.exports = async (req, res) => {
	let photos = await hlpr.readir(j(sdir, "public", "gallery")),
		photosrc = photos.map((img) => j("/gallery", img));
	
	res.render("gallery", { photos : photosrc });
}