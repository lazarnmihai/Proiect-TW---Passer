const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const DB_NAME = 'Passer';
const COLLECTION_USERS = 'user';
const COLLECTION_ACCOUNTS = 'account';
const COLLECTION_SESSIONS = 'session';

const mongo = require('mongodb').MongoClient
const mongoUrl = 'mongodb://localhost:27017'

module.exports = {

    sha256: function (obj) {
        hash = crypto.createHash("sha256");
        hash.update(obj);
        return hash.digest('hex');
    },

    connectToDB: function (dbName, collectionName, dbFunction) {
        mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                console.error(err);
                return;
            }
            collection = client.db(dbName).collection(collectionName);
            dbFunction(collection);
            client.close();
        })
    },

    getUser: function (username, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_USERS, (collection) => {
            collection.findOne({ username: username }, (err, result) => {
                if (err) console.log(err);
                console.log("From mongo:");
                console.log(result);
                callback(result);
            })
        })
    },

    regiserUser: function (username, password, email, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_USERS, (collection) => {
            collection.insertOne(
                {
                    username: username,
                    passwordInClear: password,
                    passwordAlg1: module.exports.sha256(password),
                    email: email
                },
                (err, result) => {
                    if (err) console.log(err);
                    if (err && err.code == 11000) {
                        callback({
                            error_code: 409,
                            error_message: "Username or email already exists"
                        });
                    } else {
                        console.log("From mongo:");
                        console.log(result);
                        callback(result);
                    }
                })
        })
    },

    validateLoginUser: function (username, password, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_USERS, (collection) => {
            module.exports.getUser(username, (user_from_db) => {
                console.log(user_from_db)
                if (!user_from_db) {
                    callback({
                        error_code: 404,
                        error_message: "Username not found"
                    })
                } else
                    if (module.exports.sha256(password) == user_from_db.passwordAlg1) {
                        callback({
                            message: "Login successful"
                        });
                    } else {
                        callback({
                            error_code: 403,
                            error_message: "Invalid password"
                        })
                    }
            })
        })
    },

    createSession: function (username, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_SESSIONS, (collection) => {
            uuid = uuidv4();

            collection.updateOne(
                {
                    username: username
                },
                {
                    $set: {
                        username: username,
                        uuid: uuid
                    }
                },
                { upsert: true },
                (err, result) => {
                    if (err) console.log(err);
                    if (err) {
                        callback({
                            error_code: 500,
                            error_message: "Contact local support"
                        });
                    } else {
                        console.log("createSession " + JSON.stringify(result))
                        callback({
                            username: username,
                            uuid: uuid
                        });
                    }
                })
        })
    },

    getSession: function (uuid, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_SESSIONS, (collection) => {
            collection.findOne({ uuid: uuid }, (err, result) => {
                if (err) console.log(err);
                console.log("From mongo getSession:" + JSON.stringify(result));
                callback(result);
            })
        })
    },


    addNewAccount: function (local_user, title, username, password, email, category, comment, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.insertOne(
                {
                    local_user: local_user,
                    title: title,
                    username: username,
                    passwordInClear: password,
                    passwordAlg1: module.exports.sha256(password),
                    email: email,
                    category: category,
                    comment: comment
                },
                (err, result) => {
                    if (err) console.log(err);
                    if (err && err.code == 11000) {
                        callback({
                            error_code: 409,
                            error_message: "Account already exists"
                        });
                    } else {
                        console.log("From mongo addNewAccount:");
                        console.log(result);
                        callback(result);
                    }
                })
        })
    },

    getAccounts: function (local_user, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.find(
                { local_user: local_user },
                {
                    projection: {
                        title: 1,
                        username: 1,
                        email: 1,
                        category: 1,
                        comment: 1
                    }
                }
            ).toArray(function (err, result) {
                if (err) console.log(err);
                console.log("From mongo getAccounts:");
                console.log(result);
                callback(result);
            });
        })
    },

    getAccount: function (local_user, title, category, callback) {
        console.log("getAccount " + local_user + " " + title + " " + category)
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.findOne(
                {
                    local_user: local_user,
                    title: title,
                    category: category
                },
                {
                    projection: {
                        title: 1,
                        username: 1,
                        email: 1,
                        category: 1,
                        comment: 1
                    }
                }, (err, result) => {
                    if (err) console.log(err);
                    console.log("From mongo getAccount:" + JSON.stringify(result));
                    callback(result);
                })
        })
    },

    getPassword: function (local_user, title, category, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.findOne(
                {
                    local_user: local_user,
                    title: title,
                    category: category
                },
                {
                    projection: {
                        passwordInClear: 1,
                        passwordAlg1: 1,
                    }
                }, (err, result) => {
                    if (err) console.log(err);
                    console.log("From mongo getPassword:" + JSON.stringify(result));
                    callback(result);
                })
        })
    },

    updatePassword: function (local_user, title, category, password, callback) {
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.updateOne(
                {
                    local_user: local_user,
                    title: title,
                    category: category
                },
                {
                    $set: {
                        passwordInClear: password,
                        passwordAlg1: module.exports.sha256(password),
                    }
                }, (err, result) => {
                    if (err) console.log(err);
                    console.log("From mongo updatePassword:" + JSON.stringify(result));
                    callback(result);
                })
        })
    },

    updateAccount: function (local_user, title, category, username, email, comment, callback) {
        console.log("updateAccount " + local_user + " " + title + " " + category + " " + username + " " + email  + " " + comment);
        module.exports.connectToDB(DB_NAME, COLLECTION_ACCOUNTS, (collection) => {
            collection.updateOne(
                {
                    local_user: local_user,
                    title: title,
                    category: category
                },
                {
                    $set: {
                        username: username,
                        email: email,
                        comment: comment
                    }
                },
                (err, result) => {
                    if (err) console.log(err);
                    if (err && err.code == 11000) {
                        callback({
                            error_code: 409,
                            error_message: "Account already exists"
                        });
                    } else {
                        console.log("From mongo updateAccount:");
                        console.log(result);
                        callback(result);
                    }
                })
        })
    },
};