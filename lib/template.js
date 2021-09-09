module.exports = {
    HTML:function(title, list, body, control){ // template about HTML / The control parameter is create, update and delete btns 
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    }, list:function(filelist){ // Get filelist dynamically with the readdir func
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
            // list = list + `<li>${filelist[i]}</li>`; // not hypertext
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}
