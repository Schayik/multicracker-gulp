const { src, dest, series, parallel, watch } = require('gulp')
const htmlbeautify = require('gulp-html-beautify')
const stylus = require('gulp-stylus')
const browserSync = require('browser-sync')
const nunjucksRender = require('gulp-nunjucks-render');

const server = browserSync.create();

function serve(done) {
  server.init({
    server: {
      baseDir: './docs'
    }
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

function html() {
  return src(['./nunjucks/*.njk'])
    .pipe(nunjucksRender({
      path: ['nunjucks']
    }))
    .pipe(htmlbeautify({ 
      "indent_size": 2, 
      "preserve_newlines": false, 
      "end_with_newline": true, 
      "jslint_happy": true 
    }))
    .pipe(dest('./docs'));
}

function watchHtml() {
  return watch('./nunjucks/**', series(html, reload));
}

function css() {
  return src('./stylus/index.styl')
    .pipe(stylus())
    .pipe(dest('./docs/css'))
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
const watchAll = parallel(watchHtml, watchCss)
const dev = series(compile, serve, watchAll);

exports.compile = compile;
exports.watchAll = watchAll;
exports.dev = dev;

exports.default = dev