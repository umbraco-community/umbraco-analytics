'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('js', function(cb) {
  var outputJsPath = path.join(conf.paths.output, '/js');
  gulp.src(path.join(conf.paths.src, '/**/*.controller.js'))
    .pipe($.concat('analytics.controllers.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.resource.js'))
    .pipe($.concat('analytics.resources.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.decorator.js'))
    .pipe($.concat('analytics.decorators.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.service.js'))
    .pipe($.concat('analytics.services.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.directive.js'))
    .pipe($.concat('analytics.directives.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.component.js'))
    .pipe($.concat('analytics.components.js'))
    .pipe(gulp.dest(outputJsPath));

  gulp.src(path.join(conf.paths.src, '/**/*.filter.js'))
    .pipe($.concat('analytics.filters.js'))
    .pipe(gulp.dest(outputJsPath));

  cb();
});
