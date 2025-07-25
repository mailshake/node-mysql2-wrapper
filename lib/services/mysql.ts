import MySQLConfig from '../models/mysql-config';
import Execution from './execution';
let mysql2 = require('mysql2');

let pool;

export default class MySQL {
  static mysql2: any = mysql2;

  constructor(public config: MySQLConfig) {
    let options = {
      host: this.config.host,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database
    } as any;
    if (this.config.isAmazonRDS) {
      options.ssl = 'Amazon RDS';
    }
    pool = mysql2.createPool(options);
  }

  transaction(): Execution {
    return new Execution(this.connect(), true);
  }

  execution(): Execution {
    return new Execution(this.connect(), false);
  }

  connect(): Promise<any> {
    return new Promise((ok, fail) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return fail(err);
        }
        connection.config.namedPlaceholders = true;
        ok(connection);
      });
    });
  }
}
