import MySQL from '../lib/services/mysql';
export declare const testTableName: string;
export declare function getSql(): MySQL;
export declare function dropTestTable(sql: MySQL): Promise<any>;
export declare function createTestTable(sql: MySQL): Promise<any>;
