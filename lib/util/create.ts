import { Promise } from 'es6-promise';
import MySQL from '../services/mysql';
import Column from '../models/Column';
import util = require('util');

export function parseCreateColumns(columns: Column[] | any): any[] {
  let args = {};
  let queryCols: any = [];
  let parsed = Column.parseList(columns);
  parsed.forEach((row) => {
    queryCols.push(`${row.name} ${row.definition}`);
  });

  return queryCols;
}

export default function createTable(sql: MySQL, tableName: string, columns: Column[] | any): Promise<any> {
  let args = {};
  let queryCols = parseCreateColumns(columns);
  let query = `create table ${tableName} (${queryCols.join(', ')});`;
  return sql.singleTransaction(query);
}
