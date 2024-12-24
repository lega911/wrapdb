
export function open(dbName = 'default', storeName = 'default') {

  let db, resolveDB, waitDB = new Promise((resolve, reject) => {
    resolveDB = resolve;
  });

  let request = indexedDB.open(dbName, 1);

  request.onerror = function () {
    console.error('IndexedDB error');
  };

  request.onupgradeneeded = function (e) {
    console.log('IndexedDB upgrade', e);
    db = e.target.result;
    db.createObjectStore(storeName);
  };

  request.onsuccess = function (e) {
    console.log('IndexedDB success', e, request);
    db = request.result;

    resolveDB();
  };

  return {

    runStore(operation, getResult) {
      return new Promise(async (resolve, reject) => {
        await waitDB;

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

        tx = db.transaction(storeName, 'readwrite');

        tx.oncomplete = function () {
          done(true);
          console.log('Transaction complete');
        };

        tx.onerror = function () {
          done(false);
          console.log('Transaction error');
          reject();
          tx.abort();
        };

        let objectStore = tx.objectStore(storeName);

        osReq = operation(objectStore);

        osReq.onsuccess = function () {
          done(true);
          console.log('storeRequest success');
        }
        osReq.onerror = function () {
          done(false);
          console.log('storeRequest error');
          tx.abort();
          reject();
        };

        tx.commit();
        console.log('Transaction commited');
        done(true);

      });
    },

    set(key, value) {
      return this.runStore((objectStore) => objectStore.put(value, key));
    },

    delete(key) {
      return this.runStore((objectStore) => objectStore.delete(key));
    },

    clear() {
      return this.runStore((objectStore) => objectStore.clear());
    },

    get(key) {
      return this.runStore((objectStore) => objectStore.get(key), 1);
    }
  };
};
