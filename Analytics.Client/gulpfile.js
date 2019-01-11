'use strict';

var fs = require('fs');
var gulp = require('gulp');

/**
 *  Loading gulp task files
 */
fs.readdirSync('./gulp').filter(function(file) {
  return (/\.js$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', function () {
  gulp.start('build');
});
