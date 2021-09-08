// Change template.js's content!!! 
// I will use[require] the module, http. 
// http, fs(fileSystem), url are nodejs's modules
var http = require('http'); 
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// Refactoring: templateHTML, templateList 함수를 template라는 변수의 객체 담고 함수 이름도 HTML과 list로 바꿈
var template = require('./lib/template.js');
var path = require('path'); // Refer to nodejs.txt -12

var app = http.createServer(function(request, response){ // Refer to nodejs.txt -10
    var _url = request.url; // >> 쿼리스트링 -> 여기서 이 url안에 있는 값을 추출해서 원하는 값 얻어내는 방법; url 분석(parse)해서 추출하는 방법 ; ex) HTML 만 => var 'queryData', 'title'
      // console.log(_url); // >> /?id=HTML
    var queryData = url.parse(_url, true).query;
        // console.log(queryData); // >> { id: 'HTML' }  because queryData is a obj. 
        // console.log(url.parse(_url, true)); // refresh web
    var pathname = url.parse(_url, true).pathname; // path excluding querystring; root or  root + querystring; 127.0.0.1:3000 and 127.0.0.1:3000/?id=CSS are a same path; pathname can't sort home and each page / .pathname =! .path(all path; including querystring); print it on cmd and check it out
    
    if(pathname === '/'){ // a existent page or home[root]
        // 쿼리스트링에 따라 이 하나의 파일에서 여러 페이지가 있는 것처럼 동적으로 바꼈으면 하는 => 더이상 .html 파일에 중복되는 내용 필요없음
        if(queryData.id === undefined){ // home page            
            fs.readdir('./data', function(error, filelist){ // Refer to nodejs.txt -6,7
                // console.log(filelist); // arr
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200); // if sever give blower 200 in Network, sever succeeded to transmit a file 
                response.end(html);
            });
            
        } else { // pages which has id qs
            fs.readdir('./data', function(error, filelist){
                var filteredId = path.parse(queryData.id).base; // id가 되는 title은 사용자가 입력하기 때문에 보안처리 Refer to nodejs.txt -12
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){ // Refer to nodejs.txt -7
                    var title = queryData.id;
                    // console.log(queryData.id); // >> HTMl : url 에서 쿼리스트링으로 id가 있으니까 그 id값을 가져오기 위해 (쿼리스트링 id를 name으로 바꾸고 queryData.name을 콘솔로그하면 똑같이 HTMl이 출력됨)
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`
                    ); // ?id=${title} of update?id=${title} : update who?
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create'){ // create page
        fs.readdir('./data', function(error, filelist){
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, ''); // '': this func has a 4th parameter but this create page doesn't need any control
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathname === '/create_process'){
        // Receive data sent in a POST method
        var body = '';
        request.on('data', function(data){ // why request: User requested info has a post
            body = body + data;
        }); // 웹브라우저가 post 방식으로 data를 전송할 때 data가 너무 많으면 한번에 처리하기 힘듬. 그래서 nodejs에서는 post 방식으로 전송된 데이터가 많은 경우를 대비해서 이 코드를 제공함. 1번째 인자를 서버가 데이터를 수신할 때마다 콜백함수인 2번째인자에 의해 조각조각 보냄. 콜백이 실행될 때마다 data를 body에 추가
        request.on('end', function(){
            // console.log(body);
            var post = qs.parse(body); // qs's parse / Parse body var
            // console.log(post);
            // console.log(post.title);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){ // Create file in data dir/ Never mind the parameter
                // response.writeHead(200);
                // response.end('success');
                response.writeHead(302, {Location: `/?id=${title}`}); // 302 redirect to another page / Redirect: create -> create_precess -> MongoDB ; A user can't check the create_process page
                response.end(); // ??
            })
        }); // Call this callback func after the previous code. post var contains post info
    } else if(pathname === '/update'){ // This update page need the readFile func below to update the content
        fs.readdir('./data', function(error, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                ); // Refer to nodejs.txt -11 
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            // Rename file
            fs.rename(`data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            });
        });
    } else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(error){ // After delete a file with unlink func, execute the callback's {}. If failed to delete the file, execute the callback's ()
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });
    } else { // a non-existent page
        response.writeHead(404); // Server can't find file
        response.end('Nout found');
    }

});
app.listen(3000); // Enter 127.0.0.1:3000 or localhostL3000 in url : refer to nodejs.txt - 1