"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var chai_1 = require('chai');
var mysql_config_1 = require('../lib/models/mysql-config');
var mysql_1 = require('../lib/services/mysql');
describe('MySQL', function () {
    var subject;
    before(function () {
        var config = getConfig();
        subject = new mysql_1.default(config);
    });
    function getConfig() {
        var jsonPath = path.resolve(__dirname, '../../mysql-config.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error("Please create a 'mysql-config.json' file in the root directory of this project to test");
        }
        var rawConfig = JSON.parse(fs.readFileSync(jsonPath));
        return new mysql_config_1.default(rawConfig);
    }
    describe('#run', function () {
        it('should execute a basic transaction', function () {
            return subject.singleTransaction('select 1 + 1 as z')
                .then(function (result) {
                chai_1.assert.lengthOf(result, 1);
                chai_1.assert.isOk(result[0].z);
                chai_1.assert.equal(result[0].z, 2);
            });
        });
        it('should handle errors', function () {
            return subject.singleTransaction('select 1 + 1c as z')
                .catch(function (result) {
                chai_1.assert.equal(result.message, "Unknown column '1c' in 'field list'");
            });
        });
    });
});
//# sourceMappingURL=mysql-spec.js.map