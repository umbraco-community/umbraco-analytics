'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var userconf = require('./userconf');
var runSequence = require('run-sequence');
var inquirer = require('inquirer');
var del = require('del');
var _ = require('lodash');

var destinations = [];
var err = conf.errorHandler('Dev');

gulp.task('dev', function() {
  if (userconf.sites == undefined) {
    err('No sites defined in "gulp/userconf.js"');
    return;
  }
  var questions =
    [
      {
        type: 'checkbox',
        name: 'destinations',
        message: 'Select destinations:',
        choices: userconf.sites
      }
    ];
    setTimeout(function () {
      inquirer.prompt(questions).then(function (answers) {
        _.each(answers.destinations, function (a) {
          var site = _.find(userconf.sites, ['name', a]);
          destinations.push(site)
        });
      if (destinations.length == 0) {
        err('No destinations selected - exiting');
        return;
      }
      runSequence('build', 'watch', 'dev-clean', 'dev-watch');
    });
    }, 0);
});

gulp.task('dev-watch', ['dev-all'], function(cb) {
    gulp.watch(path.join(conf.paths.lib, 'bin/Debug/' + conf.patterns.dllPattern), ['dev-dll']);
    gulp.watch(path.join(conf.paths.output, '/package.manifest'), ['dev-manifest']);
    gulp.watch(path.join(conf.paths.output, '/views/**/*.html'), ['dev-views']);
    gulp.watch(path.join(conf.paths.output, '/js/**/*.js'), ['dev-js']);
    gulp.watch(path.join(conf.paths.output, '/assets/**/*'), ['dev-assets']);
    gulp.watch(path.join(conf.paths.output, '/lib/**/*'), ['dev-lib']);
    gulp.watch(path.join(conf.paths.output, '/config/**/*'), ['dev-config']);
    cb();
});

gulp.task('dev-dll', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.cloud, 'bin/Debug/' + conf.patterns.dllPattern))
    .pipe(gulp.dest(path.join(d.folder, '/bin/')));

    gulp.src(path.join(conf.paths.forms, 'bin/Debug/' + conf.patterns.dllPattern))
    .pipe(gulp.dest(path.join(d.folder, '/bin/')));
  });
});

gulp.task('dev-clean', function() {
  _.forEach(destinations, function (d) {
    if (d.clean !== undefined && d.clean === true) {
      var p = path.join(d.folder, '/App_Plugins/Analytics');
      del.sync(p, {force: true});
      console.log('Cleaned: ', p);
    }
  });
})

gulp.task('dev-views', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/views/**/*.html'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/views/')));
  });
});

gulp.task('dev-lang', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/lang/**/*.xml'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/lang/')));
  });
});

gulp.task('dev-js', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/js/**/*.js'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/js/')));
  });
});

gulp.task('dev-assets', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/assets/**/*'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/assets/')));
  });
});

gulp.task('dev-lib', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/lib/**/*'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/lib/')));
  });
});

gulp.task('dev-manifest', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/package.manifest'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics')));
  });
});

gulp.task('dev-config', function() {
  _.forEach(destinations, function (d) {
    gulp.src(path.join(conf.paths.output, '/config/**/*'))
    .pipe(gulp.dest(path.join(d.folder, '/App_Plugins/Analytics/config')));
  });
});

gulp.task('dev-all', ['dev-dll', 'dev-views', 'dev-lang', 'dev-js', 'dev-assets', 'dev-lib', 'dev-manifest', 'dev-config']);