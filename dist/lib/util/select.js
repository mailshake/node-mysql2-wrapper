"use strict";
var column_1 = require('../models/column');
function parseUpdateColumns(columns) {
    'use strict';
    var values = {};
    var assignments = [];
    var parsed = column_1.default.parseList(columns);
    parsed.forEach(function (row) {
        assignments.push(row.name + " = :" + row.name);
        values[("" + row.name)] = row.value;
    });
    return {
        assignments: assignments,
        values: values
    };
}
exports.parseUpdateColumns = parseUpdateColumns;
function parseSelect(sql, tableName, where, fields) {
    'use strict';
    var whereColumns = parseUpdateColumns(where);
    var selectFields = '*';
    if (fields && fields.length > 0) {
        selectFields = fields.join(', ');
    }
    var query = "select " + selectFields + " from " + tableName;
    if (whereColumns.assignments.length > 0) {
        query += "\n  where " + whereColumns.assignments.join(' and\n  ');
    }
    return [query, whereColumns.values];
}
function select(sql, tableName, where) {
    'use strict';
    var fields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        fields[_i - 3] = arguments[_i];
    }
    var _a = parseSelect(sql, tableName, where, fields), query = _a[0], values = _a[1];
    return sql.query(query, values);
}
exports.select = select;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = select;
function selectOne(sql, tableName, where) {
    'use strict';
    var fields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        fields[_i - 3] = arguments[_i];
    }
    var _a = parseSelect(sql, tableName, where, fields), query = _a[0], values = _a[1];
    query += '\n  limit 1';
    return sql.query(query, values)
        .then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0];
    });
}
exports.selectOne = selectOne;
//# sourceMappingURL=select.js.map