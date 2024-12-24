
import * as db from 'wrapdb';

async function main() {
  await db.set('key', 'value');

  let value = await db.get('key');
  console.log('Result', value);
}

main();
