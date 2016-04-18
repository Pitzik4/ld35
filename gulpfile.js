var gulp = require('gulp');

var rollup = require('rollup-stream');
var babel = require('gulp-babel');
var iife = require('gulp-iife');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


gulp.task('js', function() {
  return rollup({ entry: './js/main.js' })
  .pipe(source('main.js', './js'))
  .pipe(buffer())
  .pipe(babel({ presets: ['es2015-loose'] }))
  .pipe(iife())
  .pipe(uglify({ ie_proof: false }))
  .pipe(gulp.dest('./build'));
});

gulp.task('sass', function() {
  return gulp.src('./sass/**/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./build'));
});

gulp.task('assets', function() {
  return gulp.src('./assets/**/*')
  .pipe(gulp.dest('./build'));
});


gulp.task('watch', ['js', 'sass'], function() {
  gulp.watch('./js/**/*', ['js']);
  gulp.watch('./sass/**/*', ['sass']);
});

gulp.task('default', ['assets', 'js', 'sass']);
