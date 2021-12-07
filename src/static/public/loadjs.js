const loadjs = {
	runJS : function (jsFiles = false) {
		jsFiles = jsFiles || loadjs.files;
		return new Promise ( res => {
			jsFiles.forEach ( async (file) => {
				let fn = file.name,
					js = await loadjs.getJS(fn, file.url);
				if ( ! js ) return;
				eval(js);
				localStorage.setItem(fn , js);
			});
		res();
		})
	},
	init : async function ( jsObjs = [] ) {
	 	jsObjs = jsObjs.concat(loadjs.files);
		await loadjs.runJS(jsObjs);
		await loadjs.check4update(jsObjs);
	},
	files : [],
	getJS : function ( name = false, url = false, force = false) {
		return new Promise ( async (res) => {
			if ( (! force) && localStorage.getItem( name )) return res(localStorage.getItem( name ));
			let req;
			try { req = await fetch(url) } catch (e) { console.error("loadjs.getJS error : ", e.stack); return res(false); }
			let txt = await req.text();
			return res(txt)
		})
	},
	addFile : function ( name, url ) {
		if( ! ( name && url ) ) return console.error("loadjs.addFile error : name / url not defined !");
		loadjs.files.push( {name : name , url : url} );
	},
	addFiles : function ( objs ) {
		if(! Array.isArray(objs)) return console.error("loadjs.addFiles error : required an array of objs { name, url } !");
		loadjs.files = loadjs.files.concat(objs);
	},
	check4update : (objs) => new Promise (async (res) => {
		let ufs = new Array ();
		console.log("loadjs : Checking for Update of ", objs.length, "files" );
		//if ( ! navigator.onLine) return res(console.error("loadjs.check4update error : u r offline...."))
			for(let i=0; i < objs.length ; i++) {
				let obj = objs[i];
				let lsc = localStorage.getItem( obj.name) || false;
				if ( ! lsc ) return;
				let fn = obj.name,
					js = await loadjs.getJS(fn, obj.url, true)
				if ( ! js ) continue;
				if ( lsc == js ){  console.log(obj.name, "is up-to-date"); continue}
				 localStorage.setItem(fn, js);
				ufs.push(obj.name);
			}
			res(console.log("updated :", JSON.stringify(ufs)))
	})
}
	