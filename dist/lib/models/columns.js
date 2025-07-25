"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Column = /** @class */ (function () {
    function Column(name, value) {
        var _this = this;
        if (typeof (name) === 'string') {
            this.name = name;
        }
        else {
            Object.keys(name).forEach(function (key) {
                _this[key] = name[key];
            });
        }
        if (value) {
            this.value = value;
        }
    }
    Column.parseList = function (columns) {
        if (Array.isArray(columns)) {
            return columns;
        }
        var result = [];
        Object.keys(columns).forEach(function (name) {
            var data = columns[name];
            if (typeof (data) === 'undefined') {
                data = null;
            }
            var args;
            if (typeof (data) === 'string' ||
                typeof (data) === 'number' ||
                typeof (data) === 'boolean' ||
                data instanceof RegExp ||
                data === null ||
                data instanceof Date) {
                args = {
                    name: name,
                    value: data
                };
            }
            else {
                args = data;
                args.name = name;
            }
            result.push(new Column(args));
        });
        return result;
    };
    return Column;
}());
exports.default = Column;
//# sourceMappingURL=column.js.map