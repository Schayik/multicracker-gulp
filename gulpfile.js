const { src, dest, series, parallel, watch } = require('gulp')
const fileinclude = require('gulp-file-include')
// var watch = require('gulp-watch')
var stylus = require('gulp-stylus')
var browserSync = require('browser-sync')

const server = browserSync.create();

function serve() {
  server.init({
    server: {
      baseDir: './public'
    }
  });
}

function reload() {
  server.reload();
}

function html() {
  return src(['./html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('./public'));
}

function watchHtml() {
  return watch('./html/*.html', series(html, reload));
}

function css() {
  return src('./stylus/index.styl')
    .pipe(stylus({ compress: true }))
    .pipe(dest('./public/css'))
}

function watchCss() {
  return watch('./stylus/*.styl', series(css, reload));
}

const compile = series(html, css);
const watchAll = parallel(watchHtml, watchCss)
const dev = series(compile, serve, watchAll);

exports.serve = serve;
exports.reload = reload;

exports.html = html;
exports.watchHtml = watchHtml;

exports.css = css;
exports.watchCss = watchCss;

exports.compile = compile;
exports.dev = dev;

exports.default = parallel(serve, reload, html, watchHtml, css, watchCss, compile, dev);