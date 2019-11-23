const { src, dest, series, parallel, watch } = require('gulp')
const fileinclude = require('gulp-file-include')
const htmlbeautify = require('gulp-html-beautify')
var stylus = require('gulp-stylus')
var browserSync = require('browser-sync')

const server = browserSync.create();

function serve(done) {
  server.init({
    server: {
      baseDir: './public'
    }
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

function html() {
  return src(['./html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlbeautify({ "indent_size": 2, "preserve_newlines": false, "end_with_newline": true, "jslint_happy": true }))
    .pipe(dest('./public'));
}

function watchHtml() {
  return watch('./html/**', series(html, reload));
}

function watchJson() {
  return watch('./data/**', series(html, reload));
}

function css() {
  return src('./stylus/index.styl')
    .pipe(stylus({ compress: true }))
    .pipe(dest('./public/css'))
}

function watchCss() {
  return watch('./stylus/**', series(css, reload));
}

exports.serve = serve;
exports.reload = reload;

exports.html = html;
exports.watchHtml = watchHtml;

exports.css = css;
exports.watchCss = watchCss;

const compile = series(html, css);
const watchAll = parallel(watchHtml, watchCss, watchJson)
const dev = series(compile, serve, watchAll);

exports.compile = compile;
exports.watchAll = watchAll;
exports.dev = dev;

exports.default = dev