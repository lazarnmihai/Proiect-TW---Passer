const mongo = require('mongodb').MongoClient
const mongoUrl = 'mongodb://localhost:27017'
 
module.exports = {
 
    connectToDB: function(dbFunction) {
        mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
              console.error(err);
              return;
            }
            collection = client.db("prasser").collection("pc1");
            dbFunction(collection);
            client.close();
          })
    },
 
    getUser: function(username, callback) {
        module.exports.connectToDB( (collection) => {
            collection.findOne({username:username},(err, result) => {
                if (err) console.log(err);
                console.log("From mongo:");
                console.log(result);
                callback(result);
            })
        })
    },
 
    regiserUser: function(username, password, email, callback) {
        module.exports.connectToDB((collection) => {
            collection.insertOne({username:username, password:"toBeHashed" + password, email:email}, (err, result) => {
                if (err) console.log(err);
                console.log("From mongo:");
                console.log(result);
                callback(result);
            })
        })
    }
 
};
