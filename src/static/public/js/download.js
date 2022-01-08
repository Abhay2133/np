window.dwnld = (url) => {
	let fn = document.querySelector("input").value;
	url = url || "/download?file="+fn
	if ( ! url ) return console.log("url empty")
	fetch(url)
		.then((res) => res.blob())
		.then((blob) => {
			var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = fn ;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();
		});
};
