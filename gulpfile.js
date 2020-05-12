'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('autoprefixer');

$.sass.compiler = require('node-sass');

function styles() {
  const plugins = [
    autoprefixer(),
  ];

  return gulp.src('app/scss/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      sourcemap: true
    }).on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(reload({ stream: true }));
}

function scripts () {
	return gulp.src('app/scripts/*.js')
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: ['@babel/env']
		}))
		.pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/js'))
    .pipe(reload({ stream: true }));
}

function vendors() {
  return gulp.src([
    'node_modules/swiper/js/swiper.js',
  ]).pipe($.concat('vendors.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('app/js'))
  .pipe(reload({ stream: true }));
}

function watch(cb) {
  browserSync.init({
    reloadOnRestart: true,
    notify: false,
    port: 9000,
    startPath: "/",
    server: {
      baseDir: ['./app']
    }
  });

  gulp.watch([
    'app/img/**/*',
    'app/*.html'
	]).on('change', reload);

  gulp.watch('app/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('app/scripts/**/*.js', gulp.series('scripts', 'vendors'));

  cb()
}

const serve = gulp.series(
  styles,
  scripts,
  vendors,
  watch
);

exports.styles = styles
exports.scripts = scripts
exports.vendors = vendors
exports.watch = watch
exports.serve = serve
exports.default = serve