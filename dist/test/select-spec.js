"use strict";
var chai_1 = require('chai');
var helpers_1 = require('./helpers');
var insert_1 = require('../lib/util/insert');
var select_1 = require('../lib/util/select');
describe('Select', function () {
    var sql;
    before(function () {
        sql = helpers_1.getSql();
        return helpers_1.dropTestTable(sql)
            .then(function () {
            return helpers_1.createTestTable(sql);
        });
    });
    describe('#run', function () {
        it('should insert and then select the row', function () {
            var exec = sql.transaction();
            var promise = insert_1.default(exec, helpers_1.testTableName, [{
                    color: 'purple',
                    ice_cream: 'chocolate'
                }, {
                    color: 'green'
                }])
                .then(function () {
                return select_1.selectOne(exec, helpers_1.testTableName, {
                    color: 'purple'
                }, 'ice_cream');
            });
            return exec.done(promise)
                .then(function (result) {
                chai_1.assert.isNotNull(result);
                chai_1.assert.deepEqual(result, { ice_cream: 'chocolate' });
            });
        });
    });
});
//# sourceMappingURL=select-spec.js.map