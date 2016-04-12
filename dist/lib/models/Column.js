"use strict";
var util = require('util');
var Column = (function () {
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
        if (util.isArray(columns)) {
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
                util.isRegExp(data) ||
                data === null ||
                util.isDate(data)) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Column;
//# sourceMappingURL=column.js.map