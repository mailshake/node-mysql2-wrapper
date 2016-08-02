import Execution from '../services/execution';
import Column from '../models/Column';
export declare function parseUpdateColumns(columns: Column[] | any, variablePrefix?: string): any;
export default function update(sql: Execution, tableName: string, set: any | any[], where: any | any[]): Promise<any>;
