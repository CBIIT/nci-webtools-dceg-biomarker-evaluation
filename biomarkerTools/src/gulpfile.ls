require 'matchdep'
  .filterDev 'gulp-*'
  .forEach (module) !->
    global[ module.replace /^gulp-/, '' ] = require module

strip-comments = require \gulp-strip-comments
notifier = require \node-notifier
parent-dir = \..

require! <[ gulp gulp-util gulp-jshint gulp-stylus gulp-livereload gulp-livescript streamqueue gulp-if gulp-plumber nib ]>

jshint = require \gulp-jshint
gutil = gulp-util

dev = gutil.env._.0 is \dev
plumber = ->
  gulp-plumber error-handler: ->
    gutil.beep!
    gutil.log gutil.colors.red it.toString!

#livereload-server = require('tiny-lr')!
#livereload = -> gulp-livereload livereload-server

var http-server
production = true if gutil.env.env is \production

#gulp.task 'webdriver_update' webdriver_update

#gulp.task 'protractor' <[webdriver_update httpServer]> ->
#  gulp.src ["./test/e2e/app/*.ls"]
#    .pipe protractor configFile: "./test/protractor.conf.ls"
#    .on 'error' ->
#      throw it

#gulp.task 'test:e2e' <[protractor]> ->
#  httpServer.close!

#gulp.task 'protractor:sauce' <[webdriver_update build httpServer]> ->
#  args =
#    '--selenium-address'
#    ''
#    '--sauce-user'
#    process.env.SAUCE_USERNAME
#    '--sauce-key'
#    process.env.SAUCE_ACCESS_KEY
#    '--capabilities.build'
#    process.env.TRAVIS_BUILD_NUMBER
#  if process.env.TRAVIS_JOB_NUMBER
#    #args['capabilities.tunnel-identifier'] = that
#    args.push '--capabilities.tunnel-identifier'
#    args.push that
#
#  gulp.src ["./test/e2e/app/*.ls"]
#    .pipe protractor do
#      configFile: "./test/protractor.conf.ls"
#      args: args
#    .on 'error' ->
#      throw it

#gulp.task 'test:sauce' <[protractor:sauce]> ->
#  httpServer.close!

# to compile, run command 'npm run build'
gulp.task 'build' <[ template bower js:copyScripts js:app css ]> !->

  notifier.notify(
    title: 'Compilation Complete',
    message: "The code has been compiled in the project's root directory")

# gulp.task 'test:unit' <[build]> ->
#  gulp.start 'test:karma' ->
#    process.exit!
#
#gulp.task 'test:karma' (done) ->
#  require 'karma' .server.start {
#    config-file: __dirname + '/test/karma.conf.ls',
#    single-run: true
#  }, done

gulp.task 'dev' <[template js:copyScripts js:app css]> (done) ->
#  gulp.start 'httpServer'
  gulp.watch ['app/jade/**/*.jade'] <[template]>
  gulp.watch ['app/ls/**/*.ls'] <[js:app]>
  gulp.watch 'app/stylus/**/*.styl' <[css]>
#  require 'karma' .server.start {
#    config-file: __dirname + '/test/karma.conf.ls',
#  }, ->
#    done!
#    process.exit!

require! <[ gulp-jade]>
gulp.task 'template' <[index]> ->
  gulp.src ['app/jade/**/*.jade']
    .pipe gulp-if dev, plumber!
    .pipe gulp-jade!
    .pipe gulp-if dev, livereload!

gulp.task 'index' ->
  pretty = 'yes' if gutil.env.env isnt \production

  gulp.src ['app/jade/**/*.jade','!app/jade/partials{,/**}']
    .pipe gulp-jade do
      pretty: pretty
      basedir: parentDir
    .pipe gulp.dest parentDir
    .pipe gulp-if dev, livereload!

require! <[gulp-bower main-bower-files gulp-filter gulp-csso]>
require! <[gulp-concat gulp-json-editor gulp-commonjs gulp-insert]>

gulp.task 'bower' ->
  gulp-bower!

gulp.task 'js:app' ->
  #copy json files
  gulp.src 'public/js/*.json'
    .pipe gulp.dest "#{parentDir}/scripts"

  env = gulp.src 'public/js/**/*.jsenv'
    .pipe gulp-json-editor (json) ->
      for key of json when process.env[key]?
        json[key] = that
      json

  app = gulp.src 'app/ls/**/*.ls'
    .pipe gulp-if dev, plumber!
    .pipe gulp-livescript({+bare}).on 'error', gutil.log
    .pipe gulp.dest "#{parentDir}/scripts"

gulp.task 'js:copyScripts' <[bower]> ->
  # run js file through jshint, report errors, strip the comments, then place the files in a root scripts folder
  s = streamqueue { +objectMode }
    .done gulp.src 'public/js/*.js'
    .pipe jshint!
    .pipe jshint.reporter \jshint-stylish
    .pipe strip-comments!
    .pipe gulp.dest "#{parentDir}/scripts"
    .pipe gulp-if dev, livereload!

gulp.task 'css' <[bower]> ->
  bower = gulp.src main-bower-files!
    .pipe gulp-filter -> it.path is /\.css$/

  styl = gulp.src 'app/stylus/**/*.styl'
    .pipe gulp-filter -> it.path isnt /\/_[^/]+\.styl$/
    .pipe gulp-stylus use: [nib!]
    .pipe gulp-concat 'styles.css'
    .pipe gulp.dest parentDir

  s = streamqueue { +objectMode }
    .done bower, styl, gulp.src 'public/css/**/*.css'
    .pipe gulp-if production, gulp-csso!
    .pipe gulp.dest parentDir
    .pipe gulp-if dev, livereload!