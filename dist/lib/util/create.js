"use strict";
var Column_1 = require('../models/Column');
function parseCreateColumns(columns) {
    var args = {};
    var queryCols = [];
    var parsed = Column_1.default.parseList(columns);
    parsed.forEach(function (row) {
        queryCols.push(row.name + " " + row.definition);
    });
    return queryCols;
}
exports.parseCreateColumns = parseCreateColumns;
function createTable(sql, tableName, columns) {
    var args = {};
    var queryCols = parseCreateColumns(columns);
    var query = "create table " + tableName + " (" + queryCols.join(', ') + ");";
    return sql.singleTransaction(query);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createTable;
//# sourceMappingURL=create.js.map