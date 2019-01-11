'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('lib', function(cb) {

    gulp.src(path.join(conf.paths.src, 'lib/accountingjs/*.min.js'))
        .pipe(gulp.dest(path.join(conf.paths.output, '/lib/accountingjs')));

    gulp.src(path.join(conf.paths.src, 'lib/angular-tablesort/*'))
        .pipe(gulp.dest(path.join(conf.paths.output, '/lib/angular-tablesort')));

        gulp.src(path.join(conf.paths.src, 'lib/daterangepicker/*'))
        .pipe(gulp.dest(path.join(conf.paths.output, '/lib/daterangepicker')));

    cb();
});
