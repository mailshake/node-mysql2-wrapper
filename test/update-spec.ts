import { assert } from 'chai';
import MySQL from '../lib/services/mysql';
import { dropTestTable, createTestTable, testTableName, getSql } from './helpers';
import insert from '../lib/util/insert';
import update from '../lib/util/update';

describe('Update', () => {
  let sql: MySQL;

  before(function(): Promise<any> {
    sql = getSql();
    return dropTestTable(sql)
    .then(() => {
      return createTestTable(sql);
    });
  });

  describe('#run', () => {
    it('should insert and then update the row', function(): Promise<any> {
      let exec = sql.transaction();
      let promise = insert(exec, testTableName, [{
        color: 'maroon',
        ice_cream: 'chocolate'
      }, {
        color: 'green'
      }])
      .then(() => {
        return update(
          exec,
          testTableName,
          { color: 'red-ish' },
          { color: 'maroon' }
        );
      })
      .then((result) => {
        return exec.query(`select * from ${testTableName} where color = 'red-ish'`);
      });

      return exec.done(promise)
      .then((result) => {
        assert.lengthOf(result, 1);
      });
    });
  });
});
