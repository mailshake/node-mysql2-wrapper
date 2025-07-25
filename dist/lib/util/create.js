"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCreateColumns = void 0;
var column_1 = require("../models/column");
function parseCreateColumns(columns) {
    'use strict';
    var queryCols = [];
    var parsed = column_1.default.parseList(columns);
    parsed.forEach(function (row) {
        queryCols.push(row.name + " " + row.definition);
    });
    return {
        columns: parsed,
        queryCols: queryCols
    };
}
exports.parseCreateColumns = parseCreateColumns;
function createTable(sql, tableName, columns) {
    'use strict';
    var parsed = parseCreateColumns(columns);
    var query = "create table " + tableName + " (\n  " + parsed.queryCols.join(',\n  ');
    var primaryKey = parsed.columns.filter(function (row) {
        return row.isPrimary;
    });
    if (primaryKey.length > 0) {
        var keys = primaryKey.map(function (row) { return row.name; });
        query += ",\n  PRIMARY KEY (" + keys.join(', ') + ")";
    }
    query += '\n)';
    return sql.query(query);
}
exports.default = createTable;
//# sourceMappingURL=create.js.map