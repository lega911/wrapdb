
import * as core from './core.js'

let db = core.open();

const set = async (key, value) => core.set(await db, key, value);
const get = async (key) => core.get(await db, key);
const delete_ = async (key) => core.delete(await db, key);
const clear = async () => core.clear(await db);
const count = async () => core.count(await db);
const getAllKeys = async () => core.getAllKeys(await db);
const getAll = async () => core.getAll(await db);

export { set, get, clear, delete_ as delete, count, getAllKeys, getAll };
