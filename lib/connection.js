'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _mongodb = require('mongodb');

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var connectionPool = {};

function getConnection(connectionString) {
    return new Promise(function (resolve, reject) {
        var hasConnection = R.pick([connectionString], connectionPool);
        if (R.keys(hasConnection).length !== 0) {
            resolve(connectionPool[connectionString]);
        } else {
            _mongodb.MongoClient.connect(connectionString, function (err, db) {
                if (err) {
                    reject(err);
                } else {
                    connectionPool[connectionString] = db;
                    resolve(db);
                }
            });
        }
    });
}

var getCollection = R.curry(function (collectionName, db) {
    return db.collection(collectionName);
});

var connectToCollection = function connectToCollection(collectionName) {
    return R.composeP(getCollection(collectionName), getConnection);
};
exports.connectToCollection = connectToCollection;