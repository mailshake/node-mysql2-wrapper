export default class Execution {
  history: any[] = [];
  private connection: any;
  private promise: Promise<any>;
  private lastResult: any;

  constructor(private connectionPromise: Promise<any>, private useTransaction: boolean) {
  }

  query(query: string, parameters?: any): Promise<any> {
    return this.continuePromise()
    .then(() => {
      return new Promise((ok, fail) => {
        this.history.push({ command: query });
        this.connection.query(query, parameters, (err, rows) => {
          if (err) {
            return fail(err);
          }
          this.lastResult = rows;
          ok(rows);
        });
      });
    });
  }

  done(promise: Promise<any>): Promise<any> {
    return promise
    .then((result) => {
      if (this.useTransaction) {
        return this.commit()
          .then(() => {
            this.releaseConnection();
            return result;
          });
      }
      this.releaseConnection();
      return result;
    })
    .catch((err: Error) => {
      return this.onError(err);
    });
  }

  private onError(err: Error): Promise<any> {
    if (this.useTransaction) {
      return this.rollback()
      .then(() => {
        this.releaseConnection();
        throw err;
      });
    }
    this.releaseConnection();
    throw err;
  }

  private continuePromise(): Promise<any> {
    if (this.promise) {
      return this.promise;
    }

    if (this.connection) {
      this.promise = Promise.resolve();
    }
    else {
      this.promise = this.connectionPromise
      .then((connection) => {
        this.history.push({ command: 'connect' });
        this.connection = connection;
        if (this.useTransaction) {
          return this.beginTransaction();
        }
      });
    }

    return this.promise;
  }

  private beginTransaction(): Promise<any> {
    return new Promise((ok, fail) => {
      this.history.push({ command: 'begin transaction' });
      this.connection.beginTransaction((err) => {
        if (err) {
          return fail(err);
        }
        ok();
      });
    });
  }

  private commit(): Promise<any> {
    return new Promise((ok, fail) => {
      this.history.push({ command: 'commit' });
      this.connection.commit((err) => {
        if (err) {
          return fail(err);
        }
        ok();
      });
    });
  }

  private rollback(): Promise<any> {
    return new Promise((ok, fail) => {
      if (!this.connection) {
        return ok();
      }
      this.history.push({ command: 'rollback' });
      this.connection.rollback((err) => {
        if (err) {
          return fail(err);
        }
        ok();
      });
    });
  }

  private releaseConnection(): void {
    if (this.connection) {
      this.history.push({ command: 'release connection' });
      this.connection.release();
    }
  }
}
