require 'matchdep'
  .filterDev 'gulp-*'
  .forEach (module) !->
    global[ module.replace /^gulp-/, '' ] = require module

strip-comments = require \gulp-strip-comments
notifier = require \node-notifier
gulp-ignore = require \gulp-ignore

parent-dir = \..

require! <[ gulp gulp-concat gulp-util gulp-jshint gulp-stylus gulp-livereload gulp-livescript streamqueue gulp-if gulp-plumber nib ]>

jshint = require \gulp-jshint
gutil = gulp-util
del =  require \del

dev = gutil.env._.0 is \dev
plumber = ->
  gulp-plumber error-handler: ->
    gutil.beep!
    gutil.log gutil.colors.red it.toString!

gulp.task 'default' <[ build ]>

var http-server
production = true if gutil.env.env is \production

# to compile, run command 'npm run build'
gulp.task 'build' <[ clean:scripts template bower js:copy ls:app css ]> !->

  notifier.notify(
    title: 'Compilation Complete',
    message: "The code has been compiled in the project's root directory")

#clean files before running the build
gulp.task \clean:scripts ->
  del [
  '../bc/*.js'
  '../meanRiskStratification/*.js'
  '../meanstorisk/*.js'
  '../riskStratificationAdvanced/*.js'
  '../sampleSize/*.js'
  ] force: true

gulp.task 'dev' <[template js:copy ls:app css]> (done) ->
  gulp.watch ['app/pug/**/*.pug'] <[template]>
  gulp.watch ['app/ls/**/*.ls'] <[ls:app]>
  gulp.watch 'app/stylus/**/*.styl' <[css]>

require! <[ gulp-pug]>
gulp.task 'template' <[index]> ->
  gulp.src ['app/pug/**/*.pug']
    .pipe gulp-if dev, plumber!
    .pipe gulp-pug!
    .pipe gulp-if dev, livereload!

gulp.task 'index' ->
  #pretty = 'yes' if gutil.env.env isnt \production

  gulp.src ['app/pug/*.pug' ]
    .pipe gulp-pug do
      #pretty: pretty
      basedir: parentDir
    .pipe gulp.dest parentDir
    .pipe gulp-if dev, livereload!

require! <[gulp-bower main-bower-files gulp-filter gulp-csso]>
require! <[gulp-concat gulp-json-editor gulp-commonjs gulp-insert]>

gulp.task 'bower' ->
  gulp-bower!

gulp.task 'ls:app' ->
  s = streamqueue { +objectMode }

  s.queue gulp.src <[ app/ls/**/*.ls ]>
    .pipe gulp-if dev, plumber!
    .pipe gulp-livescript({+bare}).on 'error', gutil.log
    .pipe gulp.dest parentDir

  s.done!

gulp.task 'js:copy' <[bower]> ->
  s = streamqueue { +objectMode }

  #copy json files
  gulp.src \app/scripts/**/*.json
    .pipe gulp.dest parentDir

  # run js file through jshint, report errors, strip the comments, then place the files in a root scripts folder
  gulp.src <[ !app/scripts/meanRiskStratification/**/* app/scripts/**/*.js ]>
    .pipe strip-comments!
    .pipe jshint!
    .pipe jshint.reporter \jshint-stylish
    .pipe gulp.dest parentDir

  #merge scripts for mrs
  s.queue gulp.src \app/scripts/meanRiskStratification/*.js
    .pipe gulp-concat \mrs.js
    .pipe gulp-if dev, livereload!
    .pipe gulp.dest "#{parentDir}/meanRiskStratification"

  s.done!

gulp.task 'css' <[bower]> ->
  bower = gulp.src main-bower-files!
    .pipe gulp-filter -> it.path is /\.css$/

  styl = gulp.src 'app/stylus/**/styles.styl'
    .pipe gulp-filter -> it.path isnt /\/_[^/]+\.styl$/
    .pipe gulp-stylus use: [nib!] import: <[ nib ]>
    .pipe gulp-concat 'styles.css'
    .pipe gulp.dest parentDir

  gulp.src 'app/stylus/IEOnly.styl'
    .pipe gulp-filter -> it.path isnt /\/_[^/]+\.styl$/
    .pipe gulp-stylus use: [nib!] import: <[ nib ]>
    .pipe gulp.dest parentDir

  s = streamqueue { +objectMode }
    .done bower, styl, gulp.src 'app/css/**/*.css'
    .pipe gulp-if production, gulp-csso!
    .pipe gulp.dest parentDir
    .pipe gulp-if dev, livereload!
