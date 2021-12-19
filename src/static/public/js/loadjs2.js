
window._loadjs = function (files = []){
  const me = this;
  this.files = files;
  this.ufs = [];
  this.init = (files = false, cb = () => null) =>
    new Promise(async (res) => {
      me.files = files || me.files;
      for (let file of me.files) {
        let [name, url] = file;
        let js = (await me.getJs(name, url)) || false;
        if (!js) continue;
        eval(js);
        localStorage.setItem(name, js);
      }
      res(me.c4u(cb));
    });
  this.getJs = (name, url) =>
    new Promise(async (res) => {
      console.log("getJs :", name);
      let lsc = localStorage.getItem(name) || false;
      if (lsc) return res(lsc);
      console.log("getJs : fetching", url);
      let req = await fetch(url);
      txt = (await req.text()) || "";
      res(txt);
    });

  this.c4u = (cb = () => null) =>
    new Promise(async (res) => {
      let n = me.files.length > 1 ? "files" : "file";
      console.log("loadjs.c4u : Checking for update of", me.files.length, n);
      for (let file of me.files) {
        let [name, url] = file,
          lsc = localStorage.getItem(name) || false;
        let js = (await (await fetch(url)).text()) || false;
        if (!js || js === lsc) continue;
        eval(js);
        localStorage.setItem(name, js);
        me.ufs.push(name);
      }
      let m =
        me.ufs.lengh > 0
          ? "loadjs.c4u : updated files are" + JSON.stringify(me.ufs)
          : "All Files are Up-to-date !";
      console.log(m);
      res(cb());
    });
}
