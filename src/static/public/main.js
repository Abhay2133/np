window.log = (...a) => console.log(...a);
window.elog = (...a) => console.error(...a);
const wait = (n) => new Promise(res => setTimeout( res, n));

function pressed ( tag , bs = false){
    tag.style.transition = "0.2s";
    tag.style.transform = "translateY(3px)";
    if(bs) tag.style.boxShadow = "0px 1px 1px #666"
    setTimeout(() => {
        tag.style.transform = "translateY(0px)";
    	if(bs) tag.style.boxShadow = "0px 4px 1px #666"
    }, 250)
}

async function post (url){
	let data = document.querySelector("#data-in").value;
	if( ! data) return ;
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	let req = await fetch (url, {
			method : "POST",
			headers : myHeaders,
			body : JSON.stringify({ data : data })
		}),
		res = await req.json() || {};
	disp(res)
}

async function read (){
	let res = await fetch ("fs/read"),
		data = await res.json() || {}
	disp (data)
}

function disp ( {text = false} ) {
	if( ! text ) return ;
	let out = document.getElementById("data-out")
	tw.w(out, text)
}


const tw = { // tw means typeWriter
	live : false,
	w : async ( tag, txt ) => {
		if ( ! ( tag && txt )) return ;
		if ( tw.live ) await tw.kill ();
		tw.live = tw.live || true
		tag.textContent = ""
		for ( let i=0; i < txt.length ; i++ ) {
			if ( tw.stop ) break;
			tag.textContent += txt[i]
			await wait(0);
		}
		tw.live = false;
	},
	kill : () => new Promise ( async (res) => {
		tw.stop = true;
		while ( true ) {
			if( ! tw.live ) break;
			await wait(10);
		}
		tw.stop = false;
		return res();
	})
}

async function getImgs (){
	const siteURL = document.querySelector("#website_url").value;
	if( ! siteURL ) return log("Error : url is empty");
	//if( ! navigator.onLine ) return elog("U r offline");
	let req = await fetch("/imgD", {
		method : "POST",
		headers : new Headers ({"Content-Type" : "application/json"}),
		body : JSON.stringify({url : siteURL})
	}),
		res = await req.json();
	location.href = res.url;
}

function dwnld ( url, fn ) {
	fetch ( url )
	.then( resp => resp.blob ())
	.then ( blob => {
		var url = window.URL.createObjectURL(blob);
         var a = document.createElement('a');
        a.href = url;
        a.download = fn;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  
	})
	.then( txt => log(txt))
}