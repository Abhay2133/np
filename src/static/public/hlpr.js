function downloadFile(file) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = file.url
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);
    }, 0);
  }