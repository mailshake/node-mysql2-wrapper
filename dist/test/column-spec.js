"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var chai_1 = require("chai");
var column_1 = require("../lib/models/column");
var insert_1 = require("../lib/util/insert");
describe('Tables', function () {
    describe('#parse', function () {
        it('should parse column data from an object hash', function () {
            var cols = column_1.default.parseList({
                hi: 'there',
                ok: {
                    definition: 'varchar(3)'
                }
            });
            chai_1.assert.lengthOf(cols, 2);
            chai_1.assert.equal(cols[0].name, 'hi');
            chai_1.assert.equal(cols[0].value, 'there');
            chai_1.assert.equal(cols[1].name, 'ok');
            chai_1.assert.equal(cols[1].definition, 'varchar(3)');
        });
    });
    describe('#parseInsertColumns', function () {
        it('should parse a single row', function () {
            var cols = insert_1.parseInsertColumns([{
                    hi: 'there',
                    ok: {
                        definition: 'varchar(3)'
                    }
                }]);
            chai_1.assert.lengthOf(cols.tableColumns, 2);
            chai_1.assert.equal(cols.tableColumns[0], 'hi');
            chai_1.assert.equal(cols.tableColumns[1], 'ok');
            chai_1.assert.lengthOf(cols.queryValues, 1);
            chai_1.assert.equal(cols.queryValues[0], '(?, ?)');
            chai_1.assert.lengthOf(cols.queryArgs, 2);
            chai_1.assert.equal(cols.queryArgs[0], 'there');
            chai_1.assert.equal(cols.queryArgs[1], null);
        });
        it('should parse multiple rows', function () {
            var cols = insert_1.parseInsertColumns([{
                    hi: 'there',
                    ok: {
                        definition: 'varchar(3)'
                    }
                }, {
                    hi: 'you'
                }]);
            chai_1.assert.lengthOf(cols.tableColumns, 2);
            chai_1.assert.equal(cols.tableColumns[0], 'hi');
            chai_1.assert.equal(cols.tableColumns[1], 'ok');
            chai_1.assert.lengthOf(cols.queryValues, 2);
            chai_1.assert.equal(cols.queryValues[0], '(?, ?)');
            chai_1.assert.equal(cols.queryValues[1], '(?, ?)');
            chai_1.assert.lengthOf(cols.queryArgs, 4);
            chai_1.assert.equal(cols.queryArgs[0], 'there');
            chai_1.assert.equal(cols.queryArgs[1], null);
            chai_1.assert.equal(cols.queryArgs[2], 'you');
            chai_1.assert.equal(cols.queryArgs[3], null);
        });
    });
});
//# sourceMappingURL=column-spec.js.map