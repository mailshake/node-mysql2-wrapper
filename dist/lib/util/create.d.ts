import Execution from '../services/execution';
import Column from '../models/column';
export declare function parseCreateColumns(columns: Column[] | any): any;
export default function createTable(sql: Execution, tableName: string, columns: Column[] | any): Promise<any>;
