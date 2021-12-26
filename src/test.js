const img = require("image-to-base64");
console.clear()
let url = "http://cdn1.bigboobspictures.com/59/0/5906a5b74.jpg"
img(url)
.then( data => console.log(data))
.catch ( err => console.log(err))