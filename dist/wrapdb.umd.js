(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.wrapdb = {}));
})(this, (function (exports) { 'use strict';

  function open(dbName = 'default', storeName = 'default') {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, 1);

      request.onerror = function () {
        reject();
      };

      request.onupgradeneeded = function (e) {
        e.target.result.createObjectStore(storeName);
      };

      request.onsuccess = function () {
        let db = request.result;
        db.__store = storeName;
        resolve(db);
      };
    });
  }

  function set$1(db, key, value) {
    return runStore(db, (objectStore) => objectStore.put(value, key));
  }
  function get$1(db, key) {
    return runStore(db, (objectStore) => objectStore.get(key), 1);
  }
  function delete_$1(db, key) {
    return runStore(db, (objectStore) => objectStore.delete(key));
  }
  function clear$1(db) {
    return runStore(db, (objectStore) => objectStore.clear());
  }

  function runStore(db, operation, getResult) {
    return new Promise(async (resolve, reject) => {
      let osReq, tx, step = 0;
      const done = (success) => {
        if (step < 0) return;
        if (success) {
          step++;
          if (step == 3) {
            step = -1;
            resolve(getResult ? osReq.result : null);
          }
        } else {
          step = -1;
          reject();
        }
      };

      tx = db.transaction(db.__store, 'readwrite');

      tx.oncomplete = function () {
        done(true);
      };

      tx.onerror = function () {
        done(false);
        reject();
        tx.abort();
      };

      let objectStore = tx.objectStore(db.__store);

      osReq = operation(objectStore);

      osReq.onsuccess = function () {
        done(true);
      };
      osReq.onerror = function () {
        done(false);
        tx.abort();
        reject();
      };

      tx.commit();
      done(true);
    });
  }

  let db = open();

  async function set(key, value) {
    return set$1(await db, key, value);
  }
  async function get(key) {
    return get$1(await db, key);
  }
  async function delete_(key) {
    return delete_$1(await db, key);
  }
  async function clear() {
    return clear$1(await db);
  }

  exports.clear = clear;
  exports.delete = delete_;
  exports.get = get;
  exports.set = set;

}));
