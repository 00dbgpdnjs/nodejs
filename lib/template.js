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
    }, list:function(topics){ // Get topics dynamically with the readdir func
        var list = '<ul>';
        var i = 0;
        while(i < topics.length){
            // list = list + `<li>${topics[i]}</li>`; // not hypertext
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }, authorSelect:function(authors, author_id){ // The 2nd arg is for a update page  to get curr author 
        var tag = ''; // It will be "<option values="1">egoing</option><option values="2">duru</option>..."
        var i = 0;
        while(i < authors.length){
            var selected = '';
            if(authors[i].id === author_id){
                selected = 'selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        } // ${selected} : The 'selected' string is a html's attribute. It means a selected option among the options.
        return `
            <select name="author">
                ${tag}
            </select>
        `
    }
}



// <Non-mysql ver.>
/*
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
*/