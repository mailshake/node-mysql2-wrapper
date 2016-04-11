"use strict";
var chai_1 = require('chai');
var helpers_1 = require('./helpers');
var create_1 = require('../lib/util/create');
var insert_1 = require('../lib/util/insert');
var update_1 = require('../lib/util/update');
describe('Tables', function () {
    var sql;
    before(function () {
        sql = helpers_1.getSql();
        return helpers_1.dropTestTable(sql);
    });
    describe('#run', function () {
        it('should create a table', function () {
            var exec = sql.transaction();
            var promise = create_1.default(exec, helpers_1.testTableName, {
                color: {
                    definition: 'varchar(20)'
                },
                ice_cream: {
                    definition: 'varchar(20)'
                },
                id: {
                    definition: 'int NOT NULL AUTO_INCREMENT',
                    isPrimary: true
                }
            })
                .then(function (result) {
                return insert_1.default(exec, helpers_1.testTableName, {
                    color: 'red',
                    ice_cream: 'chocolate'
                }, {
                    color: 'green'
                });
            })
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
        it('should update the table', function () {
            var exec = sql.transaction();
            var promise = update_1.default(exec, helpers_1.testTableName, {
                color: 'red-ish'
            }, {
                color: 'red'
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
//# sourceMappingURL=tables-spec.js.map