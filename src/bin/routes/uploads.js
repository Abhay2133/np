const formidable = require("formidable"),
  fs = require("fs");

module.exports = async (req, res) => {
  const udir = j(sdir, "files", "uploads").toString();
  const form = new formidable.IncomingForm({ uploadDir: udir });
  form.parse(req, (err, fields, files) => {
    if (err) return res.json(err);
    let newFilename = j(udir, files.file.newFilename),
      originalFilename = j(udir, files.file.originalFilename);
    fs.rename(newFilename, originalFilename, (err) => {
      if (err) log(err);
    });
    res.json(files);
  });
};
