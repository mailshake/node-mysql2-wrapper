require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import MySQLConfig from '../lib/models/mysql-config';
import MySQL from '../lib/services/mysql';

describe('MySQL', () => {
  let subject: MySQL;
  before(function() {
    let config = getConfig();
    subject = new MySQL(config);
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
    it('should execute a basic transaction', function() {
      return subject.singleTransaction('select 1 + 1 as z')
      .then((result) => {
        assert.lengthOf(result, 1);
        assert.isOk(result[0].z);
        assert.equal(result[0].z, 2);
      });
    });

    it('should handle errors', function() {
      return subject.singleTransaction('select 1 + 1c as z')
      .catch((result) => {
        assert.equal(result.message, "Unknown column '1c' in 'field list'");
      });
    });
  });
});
