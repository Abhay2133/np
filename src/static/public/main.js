const log = (...a) => console.log(...a);
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

async function post (){
	let data = document.querySelector("#data-in").value;
	if( ! data) return ;
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	let req = await fetch ("fs/write", {
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