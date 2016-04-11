"use strict";
var chai_1 = require('chai');
var helpers_1 = require('./helpers');
var insert_1 = require('../lib/util/insert');
var update_1 = require('../lib/util/update');
describe('Update', function () {
    var sql;
    before(function () {
        sql = helpers_1.getSql();
        return helpers_1.dropTestTable(sql)
            .then(function () {
            return helpers_1.createTestTable(sql);
        });
    });
    describe('#run', function () {
        it('should insert and then update the row', function () {
            var exec = sql.transaction();
            var promise = insert_1.default(exec, helpers_1.testTableName, [{
                    color: 'maroon',
                    ice_cream: 'chocolate'
                }, {
                    color: 'green'
                }])
                .then(function () {
                return update_1.default(exec, helpers_1.testTableName, {
                    color: 'red-ish'
                }, {
                    color: 'maroon'
                });
            })
                .then(function (result) {
                return exec.query("select * from " + helpers_1.testTableName + " where color = 'red-ish'");
            });
            return exec.done(promise)
                .then(function (result) {
                chai_1.assert.lengthOf(result, 1);
            });
        });
    });
});
//# sourceMappingURL=update-spec.js.map