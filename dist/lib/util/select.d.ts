import Execution from '../services/execution';
import Column from '../models/column';
export declare function parseUpdateColumns(columns: Column[] | any): any;
export declare function select(sql: Execution, tableName: string, where: any | any[], ...fields: string[]): Promise<any>;
export default select;
export declare function selectOne(sql: Execution, tableName: string, where: any | any[], ...fields: string[]): Promise<any>;
