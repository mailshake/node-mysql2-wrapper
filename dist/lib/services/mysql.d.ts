import MySQLConfig from '../models/mysql-config';
import Execution from './execution';
export default class MySQL {
    config: MySQLConfig;
    static mysql2: any;
    constructor(config: MySQLConfig);
    transaction(): Execution;
    execution(): Execution;
    connect(): Promise<any>;
}
