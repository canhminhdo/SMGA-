export function exportJson(fileName, data){
    var json = '\ufeff' + JSON.stringify(data,null,'  ');
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.style = "display: none";
    a.download    = fileName;
    a.href        = url;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}