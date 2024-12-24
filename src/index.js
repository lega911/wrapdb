
import * as core from './core.js'

let db = core.open();

async function set(key, value) {
  return core.set(await db, key, value);
};

async function get(key) {
  return core.get(await db, key);
};

async function delete_(key) {
  return core.delete(await db, key);
};

async function clear() {
  return core.clear(await db);
};

export {set, get, clear, delete_ as delete};
