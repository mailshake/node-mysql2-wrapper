"use strict";
function dropTable(sql, tableName) {
    var query = "drop table if exists " + tableName + ";";
    return sql.singleTransaction(query);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dropTable;
//# sourceMappingURL=drop.js.map