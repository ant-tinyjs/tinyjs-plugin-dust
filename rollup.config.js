import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import progress from 'rollup-plugin-progress';

const pkg = require('./package.json');

const production = process.env.BUILD === 'production';
const cjs = process.env.BUILD === 'cjs';
const file = production ? `index.js` : (cjs ? `main.js` : `index.debug.js`);
const format = cjs ? 'cjs' : 'umd';
const banner = `/*!
 * Name: ${pkg.name}
 * Description: ${pkg.description}
 * Author: ${pkg.author}
 * Version: v${pkg.version}
 */
${cjs ? `
// AppX: adapter for the alipay mini program
typeof my !== 'undefined' && (Tiny = my.Tiny);
` : ''}`;

const config = {
  input: 'src/index.js',
  output: {
    file,
    format,
    name: 'Tiny.Dust',
    banner,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      include: ['./src/**/*.js'],
      presets: [
        [
          'env', {
            modules: false,
          },
        ],
        'stage-0',
      ],
      plugins: [
        'external-helpers',
      ],
      comments: false,
    }),
    cleanup(),
    progress(),
    (production && uglify({
      output: {
        comments: /^!/,
      },
    })),
  ],
};

if (process.argv.includes('--watch')) {
  config.plugins.push(serve({
    contentBase: '',
    host: 'localhost',
    port: 8080,
  }));
}

export default config;
