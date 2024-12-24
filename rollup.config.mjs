
export default [{
  input: './src/index.js',
  output: {
    file: './dist/wrapdb.mjs',
    format: 'es'
  }
}, {
  input: './src/index.js',
  output: {
    file: './dist/wrapdb.umd.js',
    name: 'wrapdb',
    format: 'umd'
  }
}];
