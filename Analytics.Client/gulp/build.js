'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.output, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('manifest', function() {
  return gulp.src(path.join(conf.paths.src, '/package.manifest'))
    .pipe(gulp.dest(path.join(conf.paths.output)));
});

gulp.task('configs', function() {
  return gulp.src(path.join(conf.paths.src, '/config/*'))
    .pipe(gulp.dest(path.join(conf.paths.output, '/config/')));
});

gulp.task('build', function (cb) {
  runSequence('clean', ['views', 'lang', 'styles', 'js', 'lib', 'configs', 'manifest'], cb);
});
