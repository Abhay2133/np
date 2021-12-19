const fs = require("fs");

module.exports = () => {
  return {
    "/": { view: "index", title: false, mainHeading: "" },
    "/?": { view: "index", title: false, mainHeading: "" },
    "/fs": {
      view: "fs",
      title: "FS module Testing",
      mainHeading: "FS module Testing",
    },
    "/imgD": { view: "imgD", title: "Image Downloader", mainHeading: "" },
    "/fm": { view: "fm", title: "File Manager", mainHeading: "File Manager" },
    "/uploads": {
      view: "uploads",
      title: "Uploads",
      mainHeading: "Uploads",
      files: fs.readdirSync(j(sdir, "files", "uploads")),
    },
  };
};
