"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var mysql_1 = require('../lib/services/mysql');
var mysql_config_1 = require('../lib/models/mysql-config');
var drop_1 = require('../lib/util/drop');
exports.testTableName = 'node_workhorse_mysql_spec_test';
function getConfig() {
    var jsonPath = path.resolve(__dirname, '../../mysql-config.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error("Please create a 'mysql-config.json' file in the root directory of this project to test");
    }
    var rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    return new mysql_config_1.default(rawConfig);
}
function getSql() {
    var config = getConfig();
    return new mysql_1.default(config);
}
exports.getSql = getSql;
function dropTestTable(sql) {
    var exec = sql.transaction();
    var promise = drop_1.default(exec, exports.testTableName);
    return exec.done(promise);
}
exports.dropTestTable = dropTestTable;
//# sourceMappingURL=helpers.js.map