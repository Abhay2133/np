// Testing ydl and dl from fetch

const { dl } = require("./fetch"),
	{ log, getInfo } = require("./ydl");

(async () => {
	let url = "https://youtu.be/QuV9iPaZTBU";
	log("fetching %s", url);

	getInfo(url)
		.then((data) => dl(data.q["360p"].url, "./", "video.mp4", log(data)))
		.then((stat) => log(stat));
})()
