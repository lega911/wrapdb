
### Info

A compact JS wrapper for IndexedDB with API similar to localStorage.\
Bundle size **340b+** (minfied + compressed), treeshaking is supported.


### Example

```js
import * as db from 'wrapdb';

await db.set('key', 'value');

let value = await db.get('key');
```


### API

* db.set(key, value)
* db.get(key)
* db.delete(key)
* db.clear()
* db.count()
* db.getAll()
* db.getAllKeys()


### Custom DB connection

```js
import * as core from 'wrapdb/core';

const db = await core.open('dbName', 'storeName');

await core.set(db, 'key', 'value');

let value = await core.get(db, 'key');
```
