window.getVQ = () => {
	let url = document.querySelector("#url").value.trim() || ""
	if ( url.length < 1 ) return;
	console.log(url)
	fetch("/ytdl/getvq",{
		method : "POST",
		body : JSON.stringify({url : url}),
		headers : new Headers({"Content-Type" : "application/json"})
	})
	.then ( res => res.json())
	.then ( data => renderVQ (data));
}

var qNode //= document.querySelector(".quality").cloneNode(true);

async function hogya () {
	while (! (["complete","interactive"].includes(document.readyState))) await (new Promise (res => setTimeout( res , 100)))
	qNode = document.querySelector(".quality").cloneNode(true);
}
hogya ()

function renderVQ ( data ) {
	document.querySelector("#vt").src = data.thumbnail.pop()
	document.querySelector("#vn").textContent = data.title
	let qp = document.querySelector("#qPanel")
	qp.innerHTML = ""
	for(let q of data.qualities) {
		let qBar = qNode.cloneNode(true);
		qBar.children[0].textContent = q;
		qBar.children[1].addEventListener ("click", () => { downloadV(data.videoId, q) })
		qp.appendChild(qBar);
	}
	document.querySelector("#panel").style.opacity = "1"
}

window.downloadV = function (id, q) {
	fetch("/ytdl/save",{
		method : "POST",
		body : JSON.stringify({id : id, quality : q}),
		headers : new Headers({"Content-Type" : "application/json"})
	})
	.then ( res => res.json())
	.then ( data => renderDP (data, id, q))
	.catch ( err => console.error(err) )
}

async function renderDP ( data , id, q) {
	console.log(data)
	await (new Promise (res => setTimeout( res , 3000)))
	if ( ! data.done ) return downloadV (id, q)
	location.href += "/"+data.url
}








