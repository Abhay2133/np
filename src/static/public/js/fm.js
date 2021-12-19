window._fileManager = function (root) {
	const me = this;

	this.setPwd = (pwd) => {
		var pwd = "{{ls.pwd}}".split("");
		pwd.shift();
		pwd = pwd.join("").split("/");
		let _pwd = document.querySelector("#pwd");
		_pwd.innerHTML = "<span>" + pwd.shift() + "</span>";
		for (let d of pwd)
			_pwd.innerHTML +=
				'<div class="rightArrow"></div><span> ' + d + " </span>";
	};
	this.open = (tag) => {};
};
