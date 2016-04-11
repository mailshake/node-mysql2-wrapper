require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs'); 
import MySQL from '../lib/services/mysql'; 
import MySQLConfig from '../lib/models/mysql-config';
import drop from '../lib/util/drop';

export const testTableName = 'node_workhorse_mysql_spec_test';

function getConfig() {
  let jsonPath = path.resolve(__dirname, '../../mysql-config.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error("Please create a 'mysql-config.json' file in the root directory of this project to test")
  }

  let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
  return new MySQLConfig(rawConfig);
}

export function getSql(): MySQL {
  let config = getConfig();
  return new MySQL(config);
}

export function dropTestTable(sql:MySQL): Promise<any> {
  let exec = sql.transaction();
  let promise = drop(exec, testTableName);
  return exec.done(promise);
}
