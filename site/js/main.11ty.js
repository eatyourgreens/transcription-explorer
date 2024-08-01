import esbuild from 'esbuild'
const { NODE_ENV = 'production' } = process.env

const isProduction = NODE_ENV === 'production'

export default class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true,
    }
  }

  async render() {
    await esbuild.build({
      entryPoints: ['scripts/subject.js'],
      bundle: true,
      minify: isProduction,
      outdir: 'dist/js',
      sourcemap: !isProduction,
      target: isProduction ? 'es6' : 'esnext',
    })
  }
}
