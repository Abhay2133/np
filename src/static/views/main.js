
function pressed ( tag , bs = false){
    tag.style.transition = "0.2s";
    tag.style.transform = "translateY(3px)";
    if(bs) tag.style.boxShadow = "0px 1px 1px #666"
    setTimeout(() => {
        tag.style.transform = "translateY(0px)";
    	if(bs) tag.style.boxShadow = "0px 4px 1px #666"
    }, 250)
}

async function post (){
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	let data = document.querySelector("#data-in").value,
		res = await fetch ("/write", {
			method : "POST",
			headers : myHeaders,
			body : JSON.stringify({ data : data })
		});
}

async function read (){
	let out = document.querySelector("#data-out").value,
		res = await fetch ("/read"),
		data = res.json();
	out.textContent = data.text || out.textContent;
}