"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdateColumns = void 0;
var column_1 = require("../models/column");
function parseUpdateColumns(columns, variablePrefix) {
    'use strict';
    if (variablePrefix === void 0) { variablePrefix = ''; }
    var values = {};
    var assignments = [];
    var parsed = column_1.default.parseList(columns);
    parsed.forEach(function (row) {
        assignments.push(row.name + " = :" + variablePrefix + row.name);
        values["" + variablePrefix + row.name] = row.value;
    });
    return {
        assignments: assignments,
        values: values
    };
}
exports.parseUpdateColumns = parseUpdateColumns;
function update(sql, tableName, set, where) {
    'use strict';
    var setColumns = parseUpdateColumns(set);
    var whereColumns = parseUpdateColumns(where, 'where_');
    var query = "update " + tableName + "\n" +
        ("  set " + setColumns.assignments.join(',\n  '));
    if (whereColumns.assignments.length > 0) {
        query += '\n' +
            ("  where " + whereColumns.assignments.join(' and\n  '));
    }
    query += ';';
    var args = setColumns.values;
    Object.keys(whereColumns.values).forEach(function (key) {
        args[key] = whereColumns.values[key];
    });
    return sql.query(query, args);
}
exports.default = update;
//# sourceMappingURL=update.js.map