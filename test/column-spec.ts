require('source-map-support').install({
  handleUncaughtExceptions: false
});
import { assert } from 'chai';
import Column from '../lib/models/column';
import { parseInsertColumns } from '../lib/util/insert';

describe('Tables', () => {
  describe('#parse', () => {
    it('should parse column data from an object hash', function(): void {
      let cols = Column.parseList({
        hi: 'there',
        ok: {
          definition: 'varchar(3)'
        }
      });
      assert.lengthOf(cols, 2);
      assert.equal(cols[0].name, 'hi');
      assert.equal(cols[0].value, 'there');
      assert.equal(cols[1].name, 'ok');
      assert.equal(cols[1].definition, 'varchar(3)');
    });
  });

  describe('#parseInsertColumns', () => {
    it('should parse a single row', function(): void {
      let cols = parseInsertColumns([{
        hi: 'there',
        ok: {
          definition: 'varchar(3)'
        }
      }]);
      assert.lengthOf(cols.tableColumns, 2);
      assert.equal(cols.tableColumns[0], 'hi');
      assert.equal(cols.tableColumns[1], 'ok');
      assert.lengthOf(cols.queryValues, 1);
      assert.equal(cols.queryValues[0], '(?, ?)');
      assert.lengthOf(cols.queryArgs, 2);
      assert.equal(cols.queryArgs[0], 'there');
      assert.equal(cols.queryArgs[1], null);
    });

    it('should parse multiple rows', function(): void {
      let cols = parseInsertColumns([{
        hi: 'there',
        ok: {
          definition: 'varchar(3)'
        }
      }, {
        hi: 'you'
      }]);
      assert.lengthOf(cols.tableColumns, 2);
      assert.equal(cols.tableColumns[0], 'hi');
      assert.equal(cols.tableColumns[1], 'ok');
      assert.lengthOf(cols.queryValues, 2);
      assert.equal(cols.queryValues[0], '(?, ?)');
      assert.equal(cols.queryValues[1], '(?, ?)');
      assert.lengthOf(cols.queryArgs, 4);
      assert.equal(cols.queryArgs[0], 'there');
      assert.equal(cols.queryArgs[1], null);
      assert.equal(cols.queryArgs[2], 'you');
      assert.equal(cols.queryArgs[3], null);
    });
  });
});
