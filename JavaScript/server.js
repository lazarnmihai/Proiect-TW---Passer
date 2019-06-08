var http = require('http');
var fs = require('fs');
var path = require('path');
var mongoDbUtils = require("./mongoDbUtils");
const { parse } = require('querystring');
 
function goToFile(filePath, request, response){
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
        '.wasm': 'application/wasm'
    };
 
    var contentType = mimeTypes[extname] || 'application/octet-stream';
    console.log(filePath);
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}
 
function goToPage(page, request, response){
    var filePath = "./home.html"
    switch (page) {
        case "category":
            filePath = "./category.html"
            break;
        case "recommendation":
            filePath = "./recommendation.html"
            break;
        case "addNewAccount":
            filePath = "./addNewAccount.html"
            break;
        case "login":
            filePath = "./login.html"
            break;
        case "register":
            filePath = "./register.html"
            break;
        default:
            filePath = "./home.html"
    }
    goToFile(filePath, request, response);    
}
 
function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}
 
function handleRegister(request, response){
    collectRequestData(request, (request_data) => {
        console.log(request_data);
        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code:400,
                    error_message:"no data received"
                }
            ))
            return;
        }
       
        mongoDbUtils.regiserUser(username=request_data.username, password=request_data.password, email=request_data.email, (mongo_response) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            if (mongo_response && mongo_response.error_code){
                response.end(JSON.stringify(
                    {
                        error_code:mongo_response.error_code,
                        error_message:mongo_response.error_message
                    }
                ))
            }
            else{
                response.end(JSON.stringify(
                    {
                        username:request_data.username,
                        email:request_data.email
                    }));
                response.end();
            }
        });
    });
}
 
http.createServer(function (request, response) {
    console.log('request ', request.url);
 
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }
 
    if (filePath.endsWith(".css") || filePath.endsWith(".jpg") || filePath.endsWith(".png")|| filePath.endsWith(".js")){
        console.log("loading file " + filePath);
        goToFile(filePath, request, response);
       
    }else{
        switch(request.url.toLowerCase()) {
            case "/category":
            case "/category.html":
                goToPage("category", request, response);
                break;
            case "/recommendation":
            case "/recommendation.html":
                goToPage("recommendation", request, response);
                break;
            case "/addNewAccount":
            case "/addNewAccount.html":
                goToPage("addNewAccount", request, response);
                break;
            case "/login":
            case "/login.html":
                goToPage("login", request, response);
                break;
            case "/mongo":
                mongoDbUtils.getUser("ion", (user) => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(user));
                    response.end();
                });
                break;
            case "/register":
            case "/register.html":
                if (request.method === "GET"){
                    goToPage("register", request, response);
                }else if (request.method === "POST"){
                    handleRegister(request, response);
                }
                break;
            default:
                goToPage("home", request, response);
        }
    }
 
    // var extname = String(path.extname(filePath)).toLowerCase();
    // var mimeTypes = {
    //     '.html': 'text/html',
    //     '.js': 'text/javascript',
    //     '.css': 'text/css',
    //     '.json': 'application/json',
    //     '.png': 'image/png',
    //     '.jpg': 'image/jpg',
    //     '.gif': 'image/gif',
    //     '.wav': 'audio/wav',
    //     '.mp4': 'video/mp4',
    //     '.woff': 'application/font-woff',
    //     '.ttf': 'application/font-ttf',
    //     '.eot': 'application/vnd.ms-fontobject',
    //     '.otf': 'application/font-otf',
    //     '.svg': 'application/image/svg+xml',
    //     '.wasm': 'application/wasm'
    // };
 
    // var contentType = mimeTypes[extname] || 'application/octet-stream';
 
    // fs.readFile(filePath, function(error, content) {
    //     if (error) {
    //         if(error.code == 'ENOENT') {
    //             fs.readFile('./404.html', function(error, content) {
    //                 response.writeHead(200, { 'Content-Type': contentType });
    //                 response.end(content, 'utf-8');
    //             });
    //         }
    //         else {
    //             response.writeHead(500);
    //             response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
    //             response.end();
    //         }
    //     }
    //     else {
    //         response.writeHead(200, { 'Content-Type': contentType });
    //         response.end(content, 'utf-8');
    //     }
    // });
 
}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');