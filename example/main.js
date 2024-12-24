
import { open } from 'wrapdb.js';

debugger;

async function main() {
  const db = open();

  await db.set('test', 'Ubuntu 20.04 LTS');

  let value = await db.get('key');
  console.log('Result', value);
}

main();
