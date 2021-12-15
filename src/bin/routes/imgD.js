const zipper = require ("../zipper"),
	scraper = require("../webScraper"),
	fs = require ("fs"),
	hlpr = require("../hlpr"),
	colors = require("colors")
	
module.exports = async ( req, res ) => {
	let url = req.body.url,
			pU = require("url").parse(url, true),
			h = pU.hostname;
		if ( ! h ) return res.json({process : ["Error : invalid url !"]})
	let host = h.split(".").length >= 2 ? h.split(".")[h.split(".").length - 2] : h,
			ddir = pU.pathname == "/" ? host : host+"_"+basename(pU.pathname),
			isDead = true,
			isDdir = isddir(ddir),
			isZip = iszip(ddir)
		//return log(h,h.length >= 2, ddir)
		let cr = { done : false , process : ["Searching for img tags"], url : false }// cr => client Response;
		if ( isDdir ){
			//log("\n", ddir, "exists :", isDdir);
			cr.process.push("Saving images in server !");
			let ctime = await hlpr.gct(sdirp("downloads", ddir))
			isDead = hlpr.te(ctime) > 120;
			log("isDead :", isDead, hlpr.te(ctime));
		}
		else if ( isZip ) {
			cr.done = true;
			cr.process.push("Saving images in server !", "Compressing Images into zip file", "DONE" );
			cr.url = "/download?file=zip/"+ddir+".zip"
		}
		if ( isZip && ! cr.done ) {
			cr.process.push("Compressing Images into zip file");
		}
		//return log("iszip : ", isZip , ", isddir :", isDdir , ", isDead : ", isDead)
		if ( ! isZip && isDead ) {
			setTimeout ( async () => {
				log(colors.green(req.method), req.url)
				await scraper.imgD (url, ddir);
				await zipper.cdir(ddir, ddir+".zip");
		},0)
		}
		res.json(cr)
}

const  sdirp = (...dirs) => j(__dirname, "..", "..", "static" , ...dirs), // sdirp => static dir path
	isddir = (ddir) => fs.existsSync (sdirp("downloads", ddir)),
	iszip = (ddir) => fs.existsSync(sdirp("files", "zip", ddir+".zip"))


