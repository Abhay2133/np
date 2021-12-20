function _loadjs () {
	const me = this; this.logs = []
	this.init =  (c4u = false) => new Promise( async res => {
		for(let file of me.files) {
			let name = file.split("/")[file.split("/").length -1], ls = localStorage
			data = await me.getFile(name,file, c4u)
			if ( c4u && data === ls.getItem(name)) continue;
			try { eval(data); } catch (e) { console.log("url :", file, "\nData :", data, "\nError :", e); continue}
			ls.setItem(name, data, me.logs.push((c4u?"U ":"L ")+name))
		}
		if(c4u) return res();
		await me.init(true, me.logs.push("c4u"));
		res (console.log("loadjs :", me.logs))
	})
	this.getFile = ( name, url, c4u = false) => new Promise ( res => {
		let lsc = localStorage.getItem(name) || false;
		if ( lsc && ! c4u) return res(lsc);
		fetch( url ).then ( data => data.text())
		.then( txt => res(txt))
	})
}