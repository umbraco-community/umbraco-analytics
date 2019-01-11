'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('lang', function() {
  return gulp.src(path.join(conf.paths.src, '/lang/**/*.xml'))
  .pipe(gulp.dest(path.join(conf.paths.output, '/lang/')));
});