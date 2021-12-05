function downloadFile({url = false, name = false}) {
	if ( ! url ) return elog("downloadFile : url (", url, ") is not defined.")
	log("Downloading Zip");
    const link = document.createElement("a");
    link.style.display = "none";
	link.href = url
	link.target = "_blank"
	if( name ) link.download = name;
    document.body.appendChild(link);
    link.click();
    log("Link clicked");
    setTimeout(() => {
      link.parentNode.removeChild(link);
    }, 0);
  }