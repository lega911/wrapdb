
function open(dbName = 'default', storeName = 'default') {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, 1);
    request.onerror = () => reject();
    request.onupgradeneeded = (e) => e.target.result.createObjectStore(storeName);
    request.onsuccess = () => {
      let db = request.result;
      db.__store = storeName;
      resolve(db);
    };
  });
};

function set(db, key, value) {
  return operateStore(db, (objectStore) => objectStore.put(value, key));
};

function get(db, key) {
  return operateStore(db, (objectStore) => objectStore.get(key), 1);
};

function delete_(db, key) {
  return operateStore(db, (objectStore) => objectStore.delete(key));
};

function clear(db) {
  return operateStore(db, (objectStore) => objectStore.clear());
};

export { open, set, get, clear, delete_ as delete };

function operateStore(db, operation, getResult) {
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
        tx.abort();
      }
    };

    tx = db.transaction(db.__store, 'readwrite');
    tx.oncomplete = () => done(1);
    tx.onerror = () => done(0);

    osReq = operation(tx.objectStore(db.__store));
    osReq.onsuccess = () => done(1);
    osReq.onerror = () => done(0);

    tx.commit();
    done(1);
  });
};
