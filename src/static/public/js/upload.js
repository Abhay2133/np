let qsa = (q) => document.querySelectorAll(q),
	qs = (q) => document.querySelector(q),
	ntag = (tag) => document.createElement(tag);

window._upload = () => {
	let url = "/uploads",
		file = document.querySelector("#file").files[0],
		formData = new FormData();
	formData.append("file", file);
	fetch(url, {
		method: "POST",
		body: formData,
	})
		.then((res) => res.json())
		.then((json) => log(json, _getUploads(true)));

	return false;
};

window._getUploads = (render = false) =>
	new Promise(async (res) => {
		let files = await (await fetch("/getuploads")).json();
		if (render) {
			qs(
				".files"
			).innerHTML = `<h3 class="m-s p-s rc-s bg-FF6600 t-c">Uploaded Files ...</h3>`;
			files.forEach((file) => {
				qs(
					".files"
				).innerHTML += `<div> <img data-src="/icons/file.png" class="icon" >
			<span>${file} </span>
		</div>`;
			});
		}
		return res(files);
	});
