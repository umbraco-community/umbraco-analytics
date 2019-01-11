'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');

gulp.task('styles', function() {
  var lessOptions = {
  };

  return gulp.src(path.join(conf.paths.src, '/less/analytics.less'))
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))
    .pipe($.concat('analytics.css'))
    .pipe(gulp.dest(path.join(conf.paths.output, '/assets/css/')));
});