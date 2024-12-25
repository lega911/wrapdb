
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

const set = (db, key, value) => operateStore(db, (objectStore) => objectStore.put(value, key));
const get = (db, key) => operateStore(db, (objectStore) => objectStore.get(key), 1);
const delete_ = (db, key) => operateStore(db, (objectStore) => objectStore.delete(key));
const clear = (db) => operateStore(db, (objectStore) => objectStore.clear());
const count = (db) => operateStore(db, (objectStore) => objectStore.count(), 1);
const getAllKeys = (db) => operateStore(db, (objectStore) => objectStore.getAllKeys(), 1);
const getAll = (db) => operateStore(db, (objectStore) => objectStore.getAll(), 1);

export { open, set, get, clear, delete_ as delete, count, getAllKeys, getAll };

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
