const fs = require("fs");

function readir(path) {
  return new Promise((res) => {
    fs.readdir(path, (err, files) => {
      if (err) return res([]);
      res(files);
    });
  });
}

function delDdir(dir, m = false) {
  return new Promise((res) => {
    m = m || "\nDeleting dir : " + dir;
    process.stdout.write(m);
    let path = j(__dirname, "..", "static", "downloads", dir);
    fs.rm(path, { recursive: true }, (err) => {
      fs.rmdir(path, (err) => res(process.stdout.write(" ! \n")));
    });
  });
}

function timeElapsed(time) {
  return (
    parseInt((Date.now() / 1000).toString().split(".")[0]) -
    parseInt((time / 1000).toString().split(".")[0])
  );
}

const getctime = (file) =>
  new Promise((res) =>
    fs.stat(file, (err, stat) => {
      if (err) return log("\ngetctime > file", err);
      //log("\ngetctime > file : ", file);
      res(stat.ctimeMs);
    })
  );

module.exports = {
  delDdir: delDdir,
  readir: readir,
  te: timeElapsed,
  gct: getctime,
};
