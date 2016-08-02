import Execution from '../services/execution';
export declare function parseInsertColumns(columns: any[]): any;
export default function insert(sql: Execution, tableName: string, columns: any[]): Promise<any>;
