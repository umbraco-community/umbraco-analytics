'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('views', function() {
  return gulp.src(path.join(conf.paths.src, '/views/**/*.html'))
  .pipe(gulp.dest(path.join(conf.paths.output, '/views/')));
});
