import { Promise } from 'es6-promise';
import MySQLConfig from '../models/mysql-config';
let mysql2 = require('mysql2');

let pool;

export default class MySQL {
  static mysql2: any = mysql2;

  constructor(public config: MySQLConfig) {
    let options = <any>{
      host: this.config.host,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database
    };
    if (this.config.isAmazonRDS) {
      options.ssl = 'Amazon RDS';
    }
    pool = mysql2.createPool(options);
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

  beginTransaction(connection: any): Promise<any> {
    return new Promise((ok, fail) => {
      connection.beginTransaction((err) => {
        if (err) {
          return fail(err);
        }
        connection.isUsingTransaction = true;
        ok();
      });
    });
  }

  end(promise: Promise<any>, state: any): Promise<any> {
    return promise.then((result: any) => {
      if (state.connection.isUsingTransaction) {
        return new Promise((ok, fail) => {
          state.connection.commit((err) => {
            if (err) {
              return fail(err);
            }
            ok(result);
          });
        });
      }
      this.cleanConnection(state.connection);
      return result;
    })
      .catch((err: Error) => {
        if (state.connection && state.connection.isUsingTransaction) {
          return new Promise((ok, fail) => {
            state.connection.rollback((innerError) => {
              this.cleanConnection(state.connection);
              if (innerError) {
                return fail(innerError);
              }
              fail(err);
            });
          });
        }
        this.cleanConnection(state.connection);
        throw err;
      });
  }

  query(connection: any, query: string, parameters?: any): Promise<any> {
    return new Promise((ok, fail) => {
      connection.query(query, parameters, (err, rows) => {
        if (err) {
          return fail(err);
        }
        ok(rows);
      });
    });
  }

  singleQuery(query: string, parameters?: any): Promise<any> {
    let state = <any>{};

    let promise = this.connect()
      .then((result) => {
        state.connection = result;
        return this.query(state.connection, query, parameters);
      });

    return this.end(promise, state);
  }

  singleTransaction(query: string, parameters?: any): Promise<any> {
    let state = <any>{};

    let promise = this.connect()
      .then((result) => {
        state.connection = result;
        return this.beginTransaction(state.connection);
      })
      .then(() => {
        return this.query(state.connection, query, parameters);
      });

    return this.end(promise, state);
  }

  private cleanConnection(connection) {
    connection.isUsingTransaction = false;
    connection.release();
  }
}
