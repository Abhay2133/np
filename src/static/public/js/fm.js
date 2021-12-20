
window._qsa = ( q ) => document.querySelectorAll(q)
window._qs = ( q ) => document.querySelector(q);

window._fileManager = function (pwd = false) {
	this.history = []
	this.bn = location.href.split("/")[location.href.split("/").length -1]
	const me = this;
	this.pwd = pwd || ""
	this.ce = (name ,ih) => {let tag = document.createElement(name) ; tag.innerHTML = ih ; return tag}
	
	this.setPwd = (pwd) => {
		var pwd = pwd.split("");
		pwd.shift();
		pwd = pwd.join("").split("/");
		let _pwd = document.querySelector("#pwd");
		let fdir = pwd.shift();
		fdir = fdir.length > 0 ? fdir : "/"
		_pwd.innerHTML = "<span>" + fdir + "</span>";
		for (let d of pwd)
			_pwd.innerHTML +=
				'<div class="rightArrow"></div><span> ' + d + " </span>";
	};
	this.open = async ( dir ) => {
		let ls = await ( await fetch ("/fm" , {
			method : "POST",
			headers : (new Headers({"Content-Type" : "application/json"})),
			body : JSON.stringify({opr : "ls", path : dir})
		})).text() || false;
		try {
			ls = JSON.parse(ls)
		} catch (e) { return log (ls)}
		if( ls.error ) return log(ls.error);
		me.pwd = ls.pwd
		if ( ls ) me.render(ls)
	};
	
	this.wait = n => new Promise( res => setTimeout( res, n) );
	
	this.render = ls => {
		var barsP = document.querySelector(".fad"),
			bars = barsP.children ,
			n = bars.length
		while ( n-- ) barsP.removeChild(bars[n]); 
		let pwd = me.pwd.split("/"); pwd.pop()
		let upDir = pwd.pop()
		//log( upDir )
		barsP.appendChild(me.newgb(upDir))
		ls.dirs.forEach( dir => barsP.appendChild(me.newDir(dir)) )
		ls.files.forEach( file => barsP.appendChild(me.newFile(file)) )
		me.configLinks (me.pwd);
	}
	
	this.newDir = name => {
		let div = document.createElement("div")
		div.className = "dir ovrflw-hdn pos-rel hbr(chd-div(right-0p))"
		div.innerHTML = "<img src='/icons/folder.png' /> <span> "+ name +"</span> <div> Open </div> "
		return div;
	}
	
	this.newFile = name => {
		let section = document.createElement("section")
		section.innerHTML = "<img src='/icons/file.png' /> <span> "+ name +"</span>"
		return section;
	}
	
	this.newgb = name => {
		//log(name)
		let div = document.createElement("div")
		div.className = "gb ovrflw-hdn pos-rel hbr(chd-div(right-0p))"
		div.style.display = name.length < 1 || name == "emulated" ? "none" : "block"
		div.innerHTML = "<img src='/icons/back.png' /> <span> "+ name +"</span>"
		let bb = me.ce("div", "Back")
		bb.addEventListener("click", () => {
			let pwd = me.pwd.split("/"); pwd.pop()
			me.open(pwd.join("/"))
		})
		div.appendChild(bb)
		return div;
	}
	
	this.configLinks = (pwd) => {
		let dirs = _qsa(".dir")
		dirs.forEach( dir => dir.children[2].addEventListener("click", () => {
			me.open(me.pwd + "/" + dir.children[1].textContent.trim())
			//history.replaceState("", "Title", "/fm" + me.pwd)
		}))
		me.setPwd(pwd)
		history.pushState("", "Title", "/fm" + me.pwd)
		me.history.push(me.pwd);
	}
};









