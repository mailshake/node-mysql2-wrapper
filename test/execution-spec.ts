import { assert } from 'chai';
import MySQLConfig from '../lib/models/mysql-config';
import MySQL from '../lib/services/mysql';
import { getSql } from './helpers';

describe('Execution', () => {
  let sql: MySQL;

  before(function() {
    sql = getSql();
  });

  describe('#run', () => {
    it('should execute a successful transaction', function() {
      let exec = sql.transaction();
      let promise = exec.query('select 1')
        .then((result) => exec.query('select 2'))
        .then((result) => exec.query('select 3'))
        .then((result) => {
          return new Promise((ok, fail) => {
            ok(5);
          });
        });
      
      return exec.done(promise)
      .then((result) => {
        assert.equal(result, 5);
        assert.deepEqual(exec.history, [
          { command: 'connect' },
          { command: 'begin transaction' },
          { command: 'select 1' },
          { command: 'select 2' },
          { command: 'select 3' },
          { command: 'commit' },
          { command: 'release connection' }
        ]);
      });
    });

    it('should execute a transaction rollback with a thrown error', function() {
      let exec = sql.transaction();
      let promise = exec.query('select 1')
        .then((result) => {
          throw new Error('fail');
        });

      return exec.done(promise)
        .catch((err) => {
          assert.equal(err.message, 'fail');
          assert.deepEqual(exec.history, [
            { command: 'connect' },
            { command: 'begin transaction' },
            { command: 'select 1' },
            { command: 'rollback' },
            { command: 'release connection' }
          ]);
        });
    });

    it('should execute a transaction rollback with a SQL error', function() {
      let exec = sql.transaction();
      let promise = exec.query('select 1c');

      return exec.done(promise)
        .catch((err) => {
          assert.include(err.message, 'Unknown');
          assert.deepEqual(exec.history, [
            { command: 'connect' },
            { command: 'begin transaction' },
            { command: 'select 1c' },
            { command: 'rollback' },
            { command: 'release connection' }
          ]);
        });
    });

    it('should execute a non-transaction query', function() {
      let exec = sql.execution();
      let promise = exec.query('select 1')
      return exec.done(promise)
        .then((result) => {
          assert.lengthOf(result, 1);
          assert.equal(result[0]['1'], 1);
          assert.deepEqual(exec.history, [
            { command: 'connect' },
            { command: 'select 1' },
            { command: 'release connection' }
          ]);
        });
    });
  });
});
