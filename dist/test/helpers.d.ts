import MySQL from '../lib/services/mysql';
export declare const testTableName = "node_workhorse_mysql_spec_test";
export declare function getSql(): MySQL;
export declare function dropTestTable(sql: MySQL): Promise<any>;
export declare function createTestTable(sql: MySQL): Promise<any>;
