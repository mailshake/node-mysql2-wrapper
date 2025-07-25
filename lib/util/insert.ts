import Execution from '../services/execution';
import Column from '../models/column';

export function parseInsertColumns(columns: any[]): any {
  'use strict';
  let columnRows: Column[][] = columns.map((row) => {
    return Column.parseList(row);
  });

  let tableColumns = columnRows.reduce(
    (response: any[], row) => {
      row.forEach((col: Column) => {
        if (response.indexOf(col.name) < 0) {
          response.push(col.name);
        }
      });
      return response;
    },
    []
  );

  let queryValues = [];
  let queryArgs = [];
  columnRows.forEach((row) => {
    let valueVars = [];
    tableColumns.forEach((colName) => {
      let col = row.filter((inner) => {
        return inner.name === colName;
      });
      if (col.length === 0) {
        queryArgs.push(null);
      }
      else {
        queryArgs.push(col[0].value);
      }
      valueVars.push('?');
    });
    queryValues.push(`(${valueVars.join(', ')})`);
  });

  return {
    tableColumns,
    queryValues,
    queryArgs
  };
}

export default function insert(sql: Execution, tableName: string, columns: any[]): Promise<any> {
  'use strict';
  let columnMeta = parseInsertColumns(columns);
  let query = `insert into ${tableName} (${columnMeta.tableColumns}) values ${columnMeta.queryValues.join(', ')};`;
  return sql.query(query, columnMeta.queryArgs);
}
