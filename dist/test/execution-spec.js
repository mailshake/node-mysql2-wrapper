"use strict";
var chai_1 = require('chai');
var helpers_1 = require('./helpers');
describe('Execution', function () {
    var sql;
    before(function () {
        sql = helpers_1.getSql();
    });
    describe('#run', function () {
        it('should execute a successful transaction', function () {
            var exec = sql.transaction();
            var promise = exec.query('select 1')
                .then(function (result) { return exec.query('select 2'); })
                .then(function (result) { return exec.query('select 3'); })
                .then(function (result) {
                return new Promise(function (ok, fail) {
                    ok(5);
                });
            });
            return exec.done(promise)
                .then(function (result) {
                chai_1.assert.equal(result, 5);
                chai_1.assert.deepEqual(exec.history, [
                    { command: 'connect' },
                    { command: 'begin transaction' },
                    { command: 'select 1' },
                    { command: 'select 2' },
                    { command: 'select 3' },
                    { command: 'commit' },
                    { command: 'release connection' }
                ]);
            });
        });
        it('should execute a transaction rollback with a thrown error', function () {
            var exec = sql.transaction();
            var promise = exec.query('select 1')
                .then(function (result) {
                throw new Error('fail');
            });
            return exec.done(promise)
                .catch(function (err) {
                chai_1.assert.equal(err.message, 'fail');
                chai_1.assert.deepEqual(exec.history, [
                    { command: 'connect' },
                    { command: 'begin transaction' },
                    { command: 'select 1' },
                    { command: 'rollback' },
                    { command: 'release connection' }
                ]);
            });
        });
        it('should execute a transaction rollback with a SQL error', function () {
            var exec = sql.transaction();
            var promise = exec.query('select 1c');
            return exec.done(promise)
                .catch(function (err) {
                chai_1.assert.include(err.message, 'Unknown');
                chai_1.assert.deepEqual(exec.history, [
                    { command: 'connect' },
                    { command: 'begin transaction' },
                    { command: 'select 1c' },
                    { command: 'rollback' },
                    { command: 'release connection' }
                ]);
            });
        });
        it('should execute a non-transaction query', function () {
            var exec = sql.execution();
            var promise = exec.query('select 1');
            return exec.done(promise)
                .then(function (result) {
                chai_1.assert.lengthOf(result, 1);
                chai_1.assert.equal(result[0]['1'], 1);
                chai_1.assert.deepEqual(exec.history, [
                    { command: 'connect' },
                    { command: 'select 1' },
                    { command: 'release connection' }
                ]);
            });
        });
    });
});
//# sourceMappingURL=execution-spec.js.map