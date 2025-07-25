"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Execution = /** @class */ (function () {
    function Execution(connectionPromise, useTransaction) {
        this.connectionPromise = connectionPromise;
        this.useTransaction = useTransaction;
        this.history = [];
    }
    Execution.prototype.query = function (query, parameters) {
        var _this = this;
        return this.continuePromise()
            .then(function () {
            return new Promise(function (ok, fail) {
                _this.history.push({ command: query });
                _this.connection.query(query, parameters, function (err, rows) {
                    if (err) {
                        return fail(err);
                    }
                    _this.lastResult = rows;
                    ok(rows);
                });
            });
        });
    };
    Execution.prototype.done = function (promise) {
        var _this = this;
        return promise
            .then(function (result) {
            if (_this.useTransaction) {
                return _this.commit()
                    .then(function () {
                    _this.releaseConnection();
                    return result;
                });
            }
            _this.releaseConnection();
            return result;
        })
            .catch(function (err) {
            return _this.onError(err);
        });
    };
    Execution.prototype.onError = function (err) {
        var _this = this;
        if (this.useTransaction) {
            return this.rollback()
                .then(function () {
                _this.releaseConnection();
                throw err;
            });
        }
        this.releaseConnection();
        throw err;
    };
    Execution.prototype.continuePromise = function () {
        var _this = this;
        if (this.promise) {
            return this.promise;
        }
        if (this.connection) {
            this.promise = Promise.resolve();
        }
        else {
            this.promise = this.connectionPromise
                .then(function (connection) {
                _this.history.push({ command: 'connect' });
                _this.connection = connection;
                if (_this.useTransaction) {
                    return _this.beginTransaction();
                }
            });
        }
        return this.promise;
    };
    Execution.prototype.beginTransaction = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            _this.history.push({ command: 'begin transaction' });
            _this.connection.beginTransaction(function (err) {
                if (err) {
                    return fail(err);
                }
                ok();
            });
        });
    };
    Execution.prototype.commit = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            _this.history.push({ command: 'commit' });
            _this.connection.commit(function (err) {
                if (err) {
                    return fail(err);
                }
                ok();
            });
        });
    };
    Execution.prototype.rollback = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            if (!_this.connection) {
                return ok();
            }
            _this.history.push({ command: 'rollback' });
            _this.connection.rollback(function (err) {
                if (err) {
                    return fail(err);
                }
                ok();
            });
        });
    };
    Execution.prototype.releaseConnection = function () {
        if (this.connection) {
            this.history.push({ command: 'release connection' });
            this.connection.release();
        }
    };
    return Execution;
}());
exports.default = Execution;
//# sourceMappingURL=execution.js.map