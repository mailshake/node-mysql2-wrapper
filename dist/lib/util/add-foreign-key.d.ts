import Execution from '../services/execution';
export default function addForeignKey(sql: Execution, tableName: string, columns: string[], parentTableName: string, parentTableColumns: string[], keyName?: string, referenceDefinitions?: string): Promise<any>;
