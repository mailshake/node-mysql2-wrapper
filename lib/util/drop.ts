import { Promise } from 'es6-promise';
import MySQL from '../services/mysql';

export default function dropTable(sql: MySQL, tableName: string): Promise<any> {
  let query = `drop table if exists ${tableName};`;
  return sql.singleTransaction(query);
}
