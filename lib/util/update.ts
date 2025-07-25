import Execution from '../services/execution';
import Column from '../models/column';

export function parseUpdateColumns(columns: Column[] | any, variablePrefix: string = ''): any {
  'use strict';
  let values = {};
  let assignments: any = [];
  let parsed = Column.parseList(columns);
  parsed.forEach((row) => {
    assignments.push(`${row.name} = :${variablePrefix}${row.name}`);
    values[`${variablePrefix}${row.name}`] = row.value;
  });

  return {
    assignments,
    values
  };
}

export default function update(sql: Execution, tableName: string, set: any | any[], where: any | any[]): Promise<any> {
  'use strict';
  let setColumns = parseUpdateColumns(set);
  let whereColumns = parseUpdateColumns(where, 'where_');
  let query = `update ${tableName}\n` +
    `  set ${setColumns.assignments.join(',\n  ')}`;

  if (whereColumns.assignments.length > 0) {
    query += '\n' +
      `  where ${whereColumns.assignments.join(' and\n  ')}`;
  }
  query += ';';

  let args = setColumns.values;
  Object.keys(whereColumns.values).forEach((key) => {
    args[key] = whereColumns.values[key];
  });

  return sql.query(query, args);
}
