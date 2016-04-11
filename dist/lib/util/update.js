"use strict";
var Column_1 = require('../models/Column');
function parseUpdateColumns(columns, variablePrefix) {
    if (variablePrefix === void 0) { variablePrefix = ''; }
    var values = {};
    var assignments = [];
    var parsed = Column_1.default.parseList(columns);
    parsed.forEach(function (row) {
        assignments.push(row.name + " = :" + variablePrefix + row.name);
        values[("" + variablePrefix + row.name)] = row.value;
    });
    return {
        assignments: assignments,
        values: values
    };
}
exports.parseUpdateColumns = parseUpdateColumns;
function update(sql, tableName, set, where) {
    var setColumns = parseUpdateColumns(set);
    var whereColumns = parseUpdateColumns(where, 'where_');
    var query = ("update " + tableName + "\n") +
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
//# sourceMappingURL=update.js.map