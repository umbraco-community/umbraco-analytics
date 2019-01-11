'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

gulp.task('watch', function (cb) {

    gulp.watch([path.join(conf.paths.src, '/views/**/*.html')], { interval: 500 }, ['views']);

    gulp.watch([path.join(conf.paths.src, '/package.manifest')], { interval: 500 }, ['manifest']);

  gulp.watch([
    path.join(conf.paths.src, '/less/**/*.css'),
    path.join(conf.paths.src, '/less/**/*.less')
  ], { interval: 500 }, ['styles']);

  gulp.watch(path.join(conf.paths.src, '/**/*.js'), { interval: 500 }, ['js']);
  cb();
});
