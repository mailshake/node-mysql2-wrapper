import Execution from '../services/execution';
export default function dropTables(sql: Execution, ...tableNames: string[]): Promise<any>;
