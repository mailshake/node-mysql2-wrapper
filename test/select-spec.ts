import { assert } from 'chai';
import MySQLConfig from '../lib/models/mysql-config';
import MySQL from '../lib/services/mysql';
import { dropTestTable, createTestTable, testTableName, getSql } from './helpers';
import insert from '../lib/util/insert';
import { select, selectOne } from '../lib/util/select';

describe('Select', () => {
  let sql: MySQL;

  before(function() {
    sql = getSql();
    return dropTestTable(sql)
      .then(() => {
        return createTestTable(sql);
      });
  });

  describe('#run', () => {
    it('should insert and then select the row', function() {
      let exec = sql.transaction();
      let promise = insert(exec, testTableName, [{
        color: 'purple',
        ice_cream: 'chocolate'
      }, {
        color: 'green'
      }])
      .then(() => {
        return selectOne(exec, testTableName, {
          color: 'purple'
        }, 'ice_cream');
      });

      return exec.done(promise)
      .then((result) => {
        assert.isNotNull(result);
        assert.deepEqual(result, { ice_cream: 'chocolate' });
      });
    });
  });
});
