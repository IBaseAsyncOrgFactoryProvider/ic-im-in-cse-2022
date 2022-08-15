const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');

let files = glob.sync('api/**/*.ts', {
  cwd: __dirname,
  absolute: true,
});

esbuild.build({
  entryPoints: files,
  outbase: __dirname,
  outdir: path.join(__dirname, 'dist'),
  platform: 'neutral',
  bundle: true,
  splitting: true,
  minify: true,
  charset: 'utf8',
  mainFields: ['module'],
})
