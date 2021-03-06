var http = require('http');
var fs = require('fs');
var path = require('path');
var Cookies = require('cookies')
var mongoDbUtils = require("./mongoDbUtils");
const { parse } = require('querystring');

function goToFile(filePath, request, response) {
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
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

function goToPage(page, request, response) {
    var filePath = "./page/home.html"
    switch (page) {
        
        case "category":
            filePath = "./page/category.html"
            break;
        case "recommendation":
            filePath = "./page/recommendation.html"
            break;
        case "addnewaccount":
            filePath = "./page/addNewAccount.html"
            break;
        case "login":
            filePath = "./page/login.html"
            break;
        case "register":
            filePath = "./page/register.html"
            break;
        case "headertemplate":
            filePath = "./page/headerTemplate.html"
            break;
        default:
            filePath = "./page/home.html"
    }
    goToFile(filePath, request, response);
}

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
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

function handleRegister(request, response) {
    collectRequestData(request, (request_data) => {
        console.log("handleRegister " + JSON.stringify(request_data));
        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 400,
                    error_message: "no data received"
                }
            ))
            return;
        }

        mongoDbUtils.regiserUser(username = request_data.username, password = request_data.password,
            email = request_data.email, (mongo_response) => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                if (mongo_response.error_code) {
                    response.end(JSON.stringify(
                        {
                            error_code: mongo_response.error_code,
                            error_message: mongo_response.error_message
                        }
                    ))
                }
                else {
                    response.end(JSON.stringify(
                        {
                            username: request_data.username,
                            email: request_data.email
                        }));
                    response.end();
                }
            });
    });
}

function handleLogin(request, response) {
    collectRequestData(request, (request_data) => {
        console.log("handleLogin " + JSON.stringify(request_data));

        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 400,
                    error_message: "no data received"
                }
            ))
            return;
        }

        mongoDbUtils.validateLoginUser(username = request_data.username,
            password = request_data.password, (mongo_response) => {

                if (mongo_response.error_code) {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(
                        {
                            error_code: mongo_response.error_code,
                            error_message: mongo_response.error_message
                        }
                    ))
                }
                else {
                    //login successful
                    var cookies = new Cookies(request, response)
                    mongoDbUtils.createSession(username, (mongo_response) => {
                        if (mongo_response.error_code) {
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify(
                                {
                                    error_code: mongo_response.error_code,
                                    error_message: mongo_response.error_message
                                }
                            ))
                        }
                        else {
                            cookies.set("login", mongo_response.uuid)
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({
                                message: "Login successful"
                            }))
                        }
                    })


                }

            });

    });
}

function getSessionIdFromRequest(request) {
    var cookies = new Cookies(request)
    var uuid = cookies.get('login');
    return uuid
}

function getUserFromSession(request, callback) {
    var uuid = getSessionIdFromRequest(request);
    mongoDbUtils.getSession(uuid, (mongo_response) => {
        if (!mongo_response) {
            callback(null);
            return;
        }

        mongoDbUtils.getUser(mongo_response.username, (mongo_response) => {
            if (!mongo_response) {
                callback(null);
                return;
            }
            callback(mongo_response.username)
            return
        })
    })
}

function handleGetLoggedInUser(request, response) {
    console.log("handleGetLoggedInUser")
    var cookies = new Cookies(request, response)
    var uuid = cookies.get('login');
    console.log("handleGetLoggedInUser " + uuid)
    if (!uuid) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            error_code: 403,
            error_message: "No user logged in"
        }))
        return;
    }

    mongoDbUtils.getSession(uuid, (mongo_response) => {
        if (!mongo_response) {
            cookies.set('login', { expires: Date.now() });
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 403,
                    error_message: "No user logged in"
                }
            ))
            return;
        }

        mongoDbUtils.getUser(mongo_response.username, (mongo_response) => {
            if (!mongo_response) {
                cookies.set('login', { expires: Date.now() });
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(
                    {
                        error_code: 403,
                        error_message: "No user found - FATAL ERROR"
                    }
                ))
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                username: mongo_response.username,
                email: mongo_response.email
            }))
        })
    })


}

function handleAddNewAccount(request, response) {
    collectRequestData(request, (request_data) => {
        console.log("handleAddNewAcc " + JSON.stringify(request_data));
        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 400,
                    error_message: "no data received"
                }
            ))
            return;
        }

        getUserFromSession(request, (username) => {
            if (!username) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(
                    {
                        error_code: 403,
                        error_message: "User not logged in"
                    }));
                response.end();
                return;
            }
            mongoDbUtils.addNewAccount(local_user = username, title = request_data.title, username = request_data.username,
                password = request_data.password, email = request_data.email, category = request_data.category,
                comment = request_data.comment, (mongo_response) => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    if (mongo_response.error_code) {
                        response.end(JSON.stringify(
                            {
                                error_code: mongo_response.error_code,
                                error_message: mongo_response.error_message
                            }
                        ))
                    }
                    else {
                        response.end(JSON.stringify(
                            {
                                title: request_data.title
                            }));
                        response.end();
                    }
                });
        })
    });
}

function handleGetAccounts(request, response) {
    console.log("handleGetAccounts ");


    getUserFromSession(request, (username) => {
        if (!username) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 403,
                    error_message: "User not logged in"
                }));
            response.end();
            return;
        }
        mongoDbUtils.getAccounts(local_user = username, (mongo_response) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            if (mongo_response.error_code) {
                response.end(JSON.stringify(
                    {
                        error_code: mongo_response.error_code,
                        error_message: mongo_response.error_message
                    }
                ))
            }
            else {
                response.end(JSON.stringify(mongo_response));
                response.end();
            }
        });
    })
}

function handleGetAccount(request, response) {
    collectRequestData(request, (request_data) => {
        console.log("handleGetAccount " + JSON.stringify(request_data));
        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 400,
                    error_message: "no data received"
                }
            ))
            return;
        }

        getUserFromSession(request, (username) => {
            if (!username) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(
                    {
                        error_code: 403,
                        error_message: "User not logged in"
                    }));
                response.end();
                return;
            }
            mongoDbUtils.getAccount(local_user = username, title = request_data.title, category = request_data.category,
                (mongo_response) => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    if (!mongo_response) {
                        response.end(JSON.stringify(
                            {
                                error_code: 404,
                                error_message: "Account not found"
                            }
                        ))
                    }
                    else {
                        response.end(JSON.stringify(mongo_response));
                        response.end();
                    }
                });
        })
    })
}

function handleUpdateAccount(request, response) {
    collectRequestData(request, (request_data) => {
        console.log("handleUpdateAccount " + JSON.stringify(request_data));
        if (!request_data) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(
                {
                    error_code: 400,
                    error_message: "no data received"
                }
            ))
            return;
        }

        getUserFromSession(request, (username) => {
            if (!username) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(
                    {
                        error_code: 403,
                        error_message: "User not logged in"
                    }));
                response.end();
                return;
            }
            mongoDbUtils.updateAccount(username, request_data.title, request_data.category, request_data.username, request_data.email, request_data.comment,
                (mongo_response) => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    if (!mongo_response) {
                        response.end(JSON.stringify(
                            {
                                error_code: 404,
                                error_message: "Account not found"
                            }
                        ))
                    }
                    else {
                        response.end(JSON.stringify(mongo_response));
                        response.end();
                    }
                });
        })
    })
}

function handleCall(request, response) {
    getUserFromSession(request, (username) => {
        var loggedIn = false;
        if (username) {
            loggedIn = true;
        }
        var urlLowerCase = request.url.toLowerCase();
        if (!loggedIn) {
            switch (urlLowerCase) {
                case "/recommendation":
                case "/recommendation.html":
                case "/login":
                case "/login.html":
                case "/register":
                case "/register.html":
                case "/headertemplate.html":
                case "/getloggedinuser":
                    break;
                default:
                    urlLowerCase = "home";
            }
        }

        switch (urlLowerCase) {
            case "/category":
            case "/category.html":
                goToPage("category", request, response);
                break;
            case "/recommendation":
            case "/recommendation.html":
                goToPage("recommendation", request, response);
                break;
            case "/addnewaccount":
            case "/addnewaccount.html":
                if (request.method === "GET") {
                    goToPage("addnewaccount", request, response);
                } else if (request.method === "POST") {
                    handleAddNewAccount(request, response);
                }
                break;
            case "/login":
            case "/login.html":
                if (request.method === "GET") {
                    goToPage("login", request, response);
                } else if (request.method === "POST") {
                    handleLogin(request, response);
                }
                break;
            case "/register":
            case "/register.html":
                if (request.method === "GET") {
                    goToPage("register", request, response);
                } else if (request.method === "POST") {
                    handleRegister(request, response);
                }
                break;
            case "/headertemplate.html":
                goToPage("headertemplate", request, response);
                break;
            case "/getloggedinuser":
                handleGetLoggedInUser(request, response);
                break;
            case "/getaccounts":
                handleGetAccounts(request, response);
                break;
            case "/getaccount":
                handleGetAccount(request, response);
                break;
            case "/updateaccount":
                if (request.method === "POST") {
                    handleUpdateAccount(request, response);
                }
                break;
            case "/getpassword":
                handleGetAccount(request, response);
                break;
            case "/updatepassword":
               if (request.method === "POST") {
                    handleUpdateAccount(request, response);
                  }
                break;
            default:
                goToPage("home", request, response);
        }
    });
}

http.createServer(function (request, response) {
    // process.on('uncaughtException', function (err) {
    // console.log('Caught exception: ' + err);
    // });
    try {
        console.log('request ', request.url);
        var cookies = new Cookies(request, response)
        var lastVisit = cookies.get('LastVisit')
        cookies.set('LastVisit', new Date().toISOString())
        if (!lastVisit) {
            console.log('Welcome, first time visitor!')
        } else {
            console.log('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
        }

        var filePath = '.' + request.url;
        // if (filePath == './') {
        //     filePath = './pages/index.html';
        // }

        if (filePath.endsWith(".css") || filePath.endsWith(".jpg") || filePath.endsWith(".png") || filePath.endsWith(".js")) {
            console.log("loading file " + filePath);
            goToFile(filePath, request, response);

        } else {
            handleCall(request, response)
        }
    } catch (e) {
        console.log("Encountered an error " + e)
        try {
            response.writeHead(500);
            response.end();
        } catch (e) {
            console.log("Encountered an error while sending 500 " + e)
        }
    }

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

