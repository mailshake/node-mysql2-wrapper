"use strict";
var MySQLConfig = (function () {
    function MySQLConfig(props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        Object.keys(props).forEach(function (key) {
            _this[key] = props[key];
        });
    }
    return MySQLConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MySQLConfig;
//# sourceMappingURL=mysql-config.js.map