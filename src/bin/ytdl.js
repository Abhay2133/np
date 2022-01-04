const ytdl = require("ytdl-core"),
    ff = require("ffmpeg"),
    fs = require("fs"),
	write = fs.createWriteStream

async function getvideoquality ( url) {
    let info = await ytdl.getInfo(url)
    let format = await ytdl.chooseFormat(info.formats, {quality :"highestvideo"})
    let mkset = (arr) => { let r = []; arr.forEach( a => (a && ! r.includes(a) ? r.push(a) : a)); return r}
    return { highestVideo :format.qualityLabel, 
		thumbnail : info.videoDetails.thumbnail.thumbnails.map( t => t.url),
		//qualities : info.formats.map( f => f.qualityLabel),
		qualities : sorter(mkset(info.formats.map( f => parseInt(f.qualityLabel)))).map( q => q + "p" ),
		duration : info.videoDetails.lengthSeconds,
		videoId : info.videoDetails.videoId,
		title : info.videoDetails.title
	}
}

const  save = ( id, qualityLabel ) => new Promise( async res => {
	let ydir = j(sdir, "ytdl", id );
	if ( fs.existsSync(ydir) ) fs.rmdirSync( ydir );
	if ( ! fs.existsSync(ydir)) fs.mkdirSync(ydir, { recursive : true })
	
	var stats = { status : 1, done : false, startedAt : Date.now()}
	await upStats(stats, ydir);
	res ( stats );
	let info = await ytdl.getInfo(id)
    let format = await ytdl.chooseFormat(info.formats, {filter : f => f.qualityLabel == qualityLabel })
	let videoS = ytdl( id , { quality : format.itag })
	let vout = write(j(ydir, "video.mp4"))
	videoS.pipe(vout);
	log("Video Piped ! ")
	let title = info.videoDetails.title
	stats.name = title.split(".").join("") +".mp4"
	stats.status = 2;
	await upStats(stats, ydir);
	
	vout.on("finish" , async () => {
		log("Video Downloaded")
		stats.status = 3;
		await upStats(stats, ydir);
		let sound = await hasAudio(j(ydir, "video.mp4"))
		log("checking for sound :", sound)
		if ( sound ) {
			log("Video has Audio")
			stats.done = true;
			stats.url = j("ytdl", "download", id);
			fs.renameSync( j(ydir, "video.mp4"), j(ydir, stats.name));
			await upStats(stats, ydir);
			log(stats);
			return stats;
		}
		log("Video has no audio")
		
		let aformat = ytdl.chooseFormat( info.formats, { quality : "highestaudio" });
		let audioS = ytdl(id, { quality : aformat.itag });
		let aout = write(j(ydir, "audio.mp3"))
		audioS.pipe(aout);
		log("Piping audio !")
		aout.on("finish", async () =>{
			log("audio downloaded ")
			stats.status = 4
			await upStats(stats, ydir)
			let video = await (new ff(j(ydir, "video.mp4")))
			video.addCommand("-i", j(ydir, "audio.mp3"))
			video.addCommand("-map","0:v -map 1:a -c:v copy -c:a copy");
			await video.save(j(ydir, `"${stats.name}"`))
			
			log("video - audio merged !")
			stats.status = 5 ; stats.done = true;
			stats.url = j("download", id);
			await upStats(stats, ydir)
			log(stats)
		})
	})
	
})

const upStats = (stats, ydir) => new Promise ( res => fs.writeFile(j(ydir, "stats.json") , JSON.stringify(stats), res))
const hasAudio = ( path ) => new Promise ( async res => {
	let video = await (new ff(path));
	let audio = (!!video.metadata.audio.bitrate)
	//log(audio)
	return res( audio )
})

module.exports = {
    getVQ : getvideoquality,
    save : save
}

function sorter ( arr ) {
	for(let i = 0 ; i < arr.length -1 ; i++ )
		for(let j = 0 ; j < arr.length - i -1 ; j++ ){
			if ( arr[j] > arr[j+1] ) {
				let a = arr[j] ;
				arr[j] = arr[j+1]
				arr[j+1] = a
			}
	}
	return arr;
}


/*

stats.status value meanings

1 : download job initiated 
2 : piping / writing started
3 : video downloaded
4 : audio download
5 : video - audio merged

*/