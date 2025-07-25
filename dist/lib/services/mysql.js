"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execution_1 = require("./execution");
var mysql2 = require('mysql2');
var pool;
var MySQL = /** @class */ (function () {
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
    MySQL.prototype.transaction = function () {
        return new execution_1.default(this.connect(), true);
    };
    MySQL.prototype.execution = function () {
        return new execution_1.default(this.connect(), false);
    };
    MySQL.prototype.connect = function () {
        return new Promise(function (ok, fail) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    return fail(err);
                }
                connection.config.namedPlaceholders = true;
                ok(connection);
            });
        });
    };
    MySQL.mysql2 = mysql2;
    return MySQL;
}());
exports.default = MySQL;
//# sourceMappingURL=mysql.js.map