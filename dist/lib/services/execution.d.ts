export default class Execution {
    private connectionPromise;
    private useTransaction;
    history: any[];
    private connection;
    private promise;
    private lastResult;
    constructor(connectionPromise: Promise<any>, useTransaction: boolean);
    query(query: string, parameters?: any): Promise<any>;
    done(promise: Promise<any>): Promise<any>;
    private onError(err);
    private continuePromise();
    private beginTransaction();
    private commit();
    private rollback();
    private releaseConnection();
}
