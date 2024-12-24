
# Info

Compact JS wrapper for IndexedDB.
Bundle size 390b+ (minfied + compressed).


# Example

```js
import * as db from 'wrapdb';

await db.set('key', 'value');

let value = await db.get('key');
```
