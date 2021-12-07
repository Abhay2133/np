window.log = (...a) => console.log(...a);
window.elog = (...a) => console.error(...a);
const wait = (n) => new Promise(res => setTimeout( res, n));

window.pressed = function ( tag , bs = false){
    tag.style.transition = "0.2s";
    tag.style.transform = "translateY(3px)";
    if(bs) tag.style.boxShadow = "0px 1px 1px #666"
    setTimeout(() => {
        tag.style.transform = "translateY(0px)";
    	if(bs) tag.style.boxShadow = "0px 4px 1px #666"
    }, 250)
}

window.post = async function (url){
	let data = document.querySelector("#data-in").value;
	if( ! data) return 
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

window.read = async function (){
	let res = await fetch ("fs/read"),
		data = await res.json() || {}
	disp (data)
}

window.disp = function ( {text = false} ) {
	if( ! text ) return ;
	let out = document.getElementById("data-out")
	tw.w(out, text)
}


window.tw = { // tw means typeWriter
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
		tw.live = false
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

window.getImgs = async function (){
	const siteURL = document.querySelector("#website_url").value;
	if( ! siteURL ) return log("Error : url is empty");
	//if( ! navigator.onLine ) return elog("U r offline");
	let req, res;
	const psh = new psH();
	
	while(true){
		try {
		req = await fetch("/imgD", {
			method : "POST",
			headers : new Headers ({"Content-Type" : "application/json"}),
			body : JSON.stringify({url : siteURL})
		})
		} catch (e) { await wait(2000); continue; };
		res = await req.json();
		let process = res.process;
		//cnsol.innerHTML = ""
		//process.forEach ( (txt) => cnsol.innerHTML += "<div>"+txt+"</div>" );
		psh.h(process, res.done);
		if( ! ! res.done ) break;
		await wait(3000);
	}
	setTimeout(()=> {
		let a = document.querySelector("#dN");
		a.style.opacity = "0";
		a.style.display = "inline-block";
		a.href = res.url
		setTimeout ( () => {a.style.opacity = "1" }, 0)
	}, 500)
	//log(res.url)
}

window.dwnld = function ( url) {
	let fn = document.querySelector("#filename").value || "file"+Date.now();
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
	.then( txt => log("Download Started !"))
}

function cnsl () {
	const me = this;
	this.cnsl = document.querySelector("#console")
	this.cnsl.style.display = "block"
	this.cnsl.innerHTML = ''
	this.process = newTag("div");
	this.log = (txt) => {
		if ( ! ! me.process.children.length) me.done ()
		me.process  = newTag("div")
		let d = me.process
		d.innerHTML += "<div class='spnr' ></div>" + txt
		this.cnsl.appendChild(d);
	}
	this.done = () => {
		//log(me.process.children.length)
		me.process.children[0].className = "tick";
	}
}

function psH () {
	this.cnsl = new cnsl ();
	const me = this;
	this.len = 0;
	this.h = async ( ps , done ) => {
		
		for ( let i = me.len ; i < ps.length ; i++) {
			me.cnsl.log( ps[i])
			await wait(100);
		}
		me.len = ps.length;
		log("done :", done)
		if ( done ) me.cnsl.done();
	}
}

const newTag = ( name ) => document.createElement(name)