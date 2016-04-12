import { Promise } from 'es6-promise';
import Execution from '../services/execution';

export default function addForeignKey(
  sql: Execution,
  tableName: string,
  columns: string[],
  parentTableName: string,
  parentTableColumns: string[],
  keyName?: string,
  referenceDefinitions?: string): Promise<any> {
  'use strict';

  if (!keyName) {
    keyName = `${tableName}_${columns.join('_')}_${parentTableName}_${parentTableColumns.join('_')}`;
  }

  let query = `ALTER TABLE ${tableName} ADD CONSTRAINT ${keyName} FOREIGN KEY (${columns.join(', ')})\n` +
    `REFERENCES ${parentTableName}(${parentTableColumns.join(', ')})\n` +
    (referenceDefinitions || '');
  return sql.query(query);
}
