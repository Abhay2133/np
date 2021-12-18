window._upload = () => {
	let url = "/uploads",
		file = document.querySelector("#file").files[0],
		formData = new FormData()
		formData.append("file", file)
	fetch (url, {
		method : "POST", 
		body : formData
	})
	.then( res => res.json())
	.then( json => log(json))
	
	return false;
}

