import { Promise } from 'es6-promise';
import Execution from '../services/execution';
import Column from '../models/column';

export function parseUpdateColumns(columns: Column[] | any): any {
  'use strict';
  let values = {};
  let assignments: any = [];
  let parsed = Column.parseList(columns);
  parsed.forEach((row) => {
    assignments.push(`${row.name} = :${row.name}`);
    values[`${row.name}`] = row.value;
  });

  return {
    assignments,
    values
  };
}

function parseSelect(sql: Execution, tableName: string, where: any | any[], fields?: string[]): [string, any] {
  'use strict';
  let whereColumns = parseUpdateColumns(where);
  let selectFields = '*';
  if (fields && fields.length > 0) {
    selectFields = fields.join(', ');
  }
  let query = `select ${selectFields} from ${tableName}`;
  if (whereColumns.assignments.length > 0) {
    query += `\n  where ${whereColumns.assignments.join(' and\n  ')}`;
  }
  return [query, whereColumns.values];
}

export function select(sql: Execution, tableName: string, where: any | any[], ...fields: string[]): Promise<any> {
  'use strict';
  let [query, values] = parseSelect(sql, tableName, where, fields);
  return sql.query(query, values);
}

export default select;

export function selectOne(sql: Execution, tableName: string, where: any | any[], ...fields: string[]): Promise<any> {
  'use strict';
  let [query, values] = parseSelect(sql, tableName, where, fields);
  query += '\n  limit 1';
  return sql.query(query, values)
  .then((result: any[]) => {
    if (result.length === 0) {
      return null;
    }
    return result[0];
  });
}
