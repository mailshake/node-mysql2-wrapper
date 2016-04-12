import { Promise } from 'es6-promise';
import Execution from '../services/execution';

export default function dropTables(sql: Execution, ...tableNames: string[]): Promise<any> {
  'use strict';
  let query = `drop table if exists ${tableNames.join(', ')};`;
  return sql.query(query);
}
