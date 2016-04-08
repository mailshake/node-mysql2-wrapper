import { Promise } from 'es6-promise';
import MySQL from '../services/mysql';

export default function dropTables(sql: MySQL, ...tableNames: string[]): Promise<any> {
  let query = `drop table if exists ${tableNames.join(', ')};`;
  return sql.singleTransaction(query);
}
