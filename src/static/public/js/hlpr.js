window.downloadFile = function (file) {
	return new Promise((res) => {
		const link = document.createElement("a");
		link.style.display = "none";
		link.href = URL.createObjectURL(file);
		if (file.name) link.download = file.name;
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			URL.revokeObjectURL(link.href);
			link.parentNode.removeChild(link);
			res("Download Started !");
		}, 0);
	});
};

window.tsp = function () {
	const sp = document.querySelector("#sidePanel");
	if (!window.spOn) {
		sp.style.width = "200px";
		window.spOn = true;
	} else {
		sp.style.width = "0px";
		window.spOn = false;
	}
	return false;
};

window.thmbgr = function (cb = false) {
	let hmbgr = document.querySelector("#hmbgr");
	let [hr1, hr2, hr3] = hmbgr.children;

	if (!window.hmbgrOn) {
		hr1.style.transform = "translateY(10.5px) rotate(-45deg)";
		hr2.style.transform = "rotate(45deg)";
		hr3.style.transform = "translateY(-10.5px) rotate(-45deg)";
		window.hmbgrOn = true;
	} else {
		hr1.style.transform = "translateY(0px) rotate(0deg)";
		hr2.style.transform = "rotate(0deg)";
		hr3.style.transform = "translateY(0px) rotate(0deg)";
		window.hmbgrOn = false;
	}

	if (cb) return cb();
};

window._getH = (tag) => window.getComputedStyle(tag).getPropertyValue("height")

window._toggleHeight = function ( id, height , toggle){
	const me = this; 
	this.id = id;
	this.tag = i => document.querySelector( i );
	this.tag(id).style.transition = "0.2s"
	this.h = height || _getH(this.tag(id))
	this.t = () => {me.tag(me.id).style.height = me.tag(me.id).style.height == "0px" ? me.h : "0px";}
	if(toggle) this.t ()
}

