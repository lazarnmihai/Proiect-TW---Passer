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
                console.log("From mongo:" + JSON.stringify(result));
                callback(result);
            })
        })
    },

};