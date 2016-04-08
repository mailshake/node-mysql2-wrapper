"use strict";
var es6_promise_1 = require('es6-promise');
var mysql2 = require('mysql2');
var pool;
var MySQL = (function () {
    function MySQL(config) {
        this.config = config;
        var options = {
            host: this.config.host,
            user: this.config.username,
            password: this.config.password,
            database: this.config.database
        };
        if (this.config.isAmazonRDS) {
            options.ssl = 'Amazon RDS';
        }
        pool = mysql2.createPool(options);
    }
    MySQL.prototype.connect = function () {
        return new es6_promise_1.Promise(function (ok, fail) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    return fail(err);
                }
                connection.config.namedPlaceholders = true;
                ok(connection);
            });
        });
    };
    MySQL.prototype.beginTransaction = function (connection) {
        return new es6_promise_1.Promise(function (ok, fail) {
            connection.beginTransaction(function (err) {
                if (err) {
                    return fail(err);
                }
                connection.isUsingTransaction = true;
                ok();
            });
        });
    };
    MySQL.prototype.end = function (promise, state) {
        var _this = this;
        return promise.then(function (result) {
            if (state.connection.isUsingTransaction) {
                return new es6_promise_1.Promise(function (ok, fail) {
                    state.connection.commit(function (err) {
                        if (err) {
                            return fail(err);
                        }
                        ok(result);
                    });
                });
            }
            _this.cleanConnection(state.connection);
            return result;
        })
            .catch(function (err) {
            if (state.connection && state.connection.isUsingTransaction) {
                return new es6_promise_1.Promise(function (ok, fail) {
                    state.connection.rollback(function (innerError) {
                        _this.cleanConnection(state.connection);
                        if (innerError) {
                            return fail(innerError);
                        }
                        fail(err);
                    });
                });
            }
            _this.cleanConnection(state.connection);
            throw err;
        });
    };
    MySQL.prototype.query = function (connection, query, parameters) {
        return new es6_promise_1.Promise(function (ok, fail) {
            connection.query(query, parameters, function (err, rows) {
                if (err) {
                    return fail(err);
                }
                ok(rows);
            });
        });
    };
    MySQL.prototype.singleQuery = function (query, parameters) {
        var _this = this;
        var state = {};
        var promise = this.connect()
            .then(function (result) {
            state.connection = result;
            return _this.query(state.connection, query, parameters);
        });
        return this.end(promise, state);
    };
    MySQL.prototype.singleTransaction = function (query, parameters) {
        var _this = this;
        var state = {};
        var promise = this.connect()
            .then(function (result) {
            state.connection = result;
            return _this.beginTransaction(state.connection);
        })
            .then(function () {
            return _this.query(state.connection, query, parameters);
        });
        return this.end(promise, state);
    };
    MySQL.prototype.cleanConnection = function (connection) {
        connection.isUsingTransaction = false;
        connection.release();
    };
    MySQL.mysql2 = mysql2;
    return MySQL;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MySQL;
//# sourceMappingURL=mysql.js.map