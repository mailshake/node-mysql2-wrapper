"use strict";
var chai_1 = require('chai');
var helpers_1 = require('./helpers');
var insert_1 = require('../lib/util/insert');
describe('Insert', function () {
    var sql;
    before(function () {
        sql = helpers_1.getSql();
        return helpers_1.dropTestTable(sql)
            .then(function () {
            return helpers_1.createTestTable(sql);
        });
    });
    describe('#run', function () {
        it('should insert a row', function () {
            var exec = sql.transaction();
            var promise = insert_1.default(exec, helpers_1.testTableName, [{
                    color: 'red',
                    ice_cream: 'chocolate'
                }, {
                    color: 'green'
                }])
                .then(function (result) {
                return exec.query("select * from " + helpers_1.testTableName + " order by id asc");
            });
            return exec.done(promise)
                .then(function (result) {
                chai_1.assert.lengthOf(result, 2);
                chai_1.assert.isOk(result[0].id);
                chai_1.assert.equal(result[0].ice_cream, 'chocolate');
                chai_1.assert.isOk(result[1].id);
                chai_1.assert.isNull(result[1].ice_cream);
            });
        });
        it('should fail a transaction and rollback', function () {
            var exec = sql.transaction();
            var promise = insert_1.default(exec, helpers_1.testTableName, [{
                    color: 'blue',
                    ice_cream: 'chocolate'
                }])
                .then(function (result) {
                throw new Error('test');
            });
            return exec.done(promise)
                .then(function () {
                chai_1.assert.fail('Should not get here');
            })
                .catch(function () {
                exec = sql.transaction();
                promise = exec.query("select * from " + helpers_1.testTableName + " where color = :color", { color: 'blue' });
                return exec.done(promise);
            })
                .then(function (result) {
                chai_1.assert.lengthOf(result, 0);
            });
        });
    });
});
//# sourceMappingURL=insert-spec.js.map