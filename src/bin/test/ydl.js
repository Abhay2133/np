const create = require("youtube-dl-exec").create,
	log = (...a) => console.log(...a)

const _getInfo = (url) =>
	new Promise((res) => {
		let ydl = create("/data/data/com.termux/files/usr/bin/youtube-dl")
		ydl(url, {
			dumpSingleJson: true,
			noWarnings: true,
			noCallHome: true,
			noCheckCertificate: true,
			preferFreeFormats: true,
			youtubeSkipDashManifest: true,
			referer: url,
		}).then(async (out) => {
			let q = {};
			out.formats.forEach((f) => {
				if (!f.filesize) return;
				if (!f.format_note.endsWith("p")) return;
				q[f.format_note] = {
					filesize: f.filesize,
					vcodec: f.vcodec,
					acodec: f.acodec,
					fps: f.fps,
					url: f.url,
					ext : f.ext,
					container : f.container
				};
			});
			res({title : out.title, q : q})
		});
	});

module.exports = {
	getInfo : _getInfo,
	log : log
}
