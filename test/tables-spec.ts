import { assert } from 'chai';
import MySQLConfig from '../lib/models/mysql-config';
import MySQL from '../lib/services/mysql';
import { dropTestTable, testTableName, getSql } from './helpers';
import Column from '../lib/models/column';
import create from '../lib/util/create';
import insert from '../lib/util/insert';
import update from '../lib/util/update';
import drop from '../lib/util/drop';

describe('Tables', () => {
  let sql: MySQL;

  before(function() {
    sql = getSql();
    return dropTestTable(sql);
  });

  describe('#run', () => {
    it('should create a table', function() {
      let exec = sql.transaction();
      let promise = create(exec, testTableName, {
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
      .then((result) => {
        return insert(exec, testTableName, {
          color: 'red',
          ice_cream: 'chocolate'
        }, {
            color: 'green'
          });
      })
      .then((result) => {
        return exec.query(`select * from ${testTableName} order by id asc`);
      });

      return exec.done(promise)
      .then((result) => {
        assert.lengthOf(result, 2);
        assert.isOk(result[0].id);
        assert.equal(result[0].ice_cream, 'chocolate');
        assert.isOk(result[1].id);
        assert.isNull(result[1].ice_cream);
      });
    });

    it('should update the table', function() {
      let exec = sql.transaction();
      let promise = update(exec, testTableName, {
        color: 'red-ish'
      }, {
        color: 'red'
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
