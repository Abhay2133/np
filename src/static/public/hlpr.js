window.downloadFile = function(file) {
 return new Promise ( res => {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  if(file.name) link.download = file.name;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
    res("Download Started !")
  }, 0);
  
  })
}