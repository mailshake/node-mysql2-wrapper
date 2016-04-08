require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import MySQLConfig from '../lib/models/mysql-config';
import MySQL from '../lib/services/mysql';
import Column from '../lib/models/column';
import create from '../lib/util/create';
import insert from '../lib/util/insert';
import drop from '../lib/util/drop';

describe('Tables', () => {
  let sql: MySQL;
  let testTableName = 'node_workhorse_mysql_spec_test';

  before(function() {
    let config = getConfig();
    sql = new MySQL(config);
    return drop(sql, testTableName);
  });

  function getConfig() {
    let jsonPath = path.resolve(__dirname, '../../mysql-config.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error("Please create a 'mysql-config.json' file in the root directory of this project to test")
    }

    let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    return new MySQLConfig(rawConfig);
  }

  describe('#run', () => {
    it('should create a table', function() {
      return create(sql, testTableName, {
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
        return insert(sql, testTableName, {
          color: 'red',
          ice_cream: 'chocolate'
        }, {
          color: 'green'
        });
      })
      .then((result) => {
        return sql.singleQuery(`select * from ${testTableName} order by id asc`);
      })
      .then((result) => {
        assert.lengthOf(result, 2);
        assert.isOk(result[0].id);
        assert.equal(result[0].ice_cream, 'chocolate');
        assert.isOk(result[1].id);
        assert.isNull(result[1].ice_cream);
      });
    });
  });
});
