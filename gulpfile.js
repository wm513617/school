require('dotenv').config()
const gulp = require('gulp')
const del = require('del')
const path = require('path')
const mkdirp = require('mkdirp')
const exec = require('child_process').exec
const zip = require('gulp-zip')
const moment = require('moment')
const replace = require('replace')
const mom = moment(new Date())
const exportDir = './export/dist/'
const offline = './offline/'
const packSvr = 'campus-platform-0.0.1.tgz'
const stampVer = 'WEBVer-' + mom.format('YYYYMMDDHHmm') + '-2.1'
const file = path.join(__dirname, 'client/src/constants.js')
const packs = {
  client: {
    src: 'client/dist/**/*.*',
    output: 'client.zip'
  },
  client_slim: {
    src: ['client/dist/**/*.*', '!client/dist/**/*.mp4'],
    output: 'client_slim.zip'
  },
  server: {
    src: [
      './**/*.*',
      '!./**/*.log',
      '!./test/*.*',
      '!./client/**/*.*',
      '!./*.tar',
      '!./*.tar.gz',
      '!./export/**/*.*',
      '!./*.rpm',
      '!./node_modules/**/*.*',
      '!./.vscode/*.*'
    ],
    output: 'server.zip'
  },
  serverOffline: {
    src: [
      './**/*',
      '!./**/*.log',
      '!./test/*',
      '!./client/**/*',
      '!./*.tar',
      '!./*.tar.gz',
      '!./export/**/*',
      '!./.vscode/*',
      '!./server/.eslintrc.js'
    ],
    output: 'serverOffline.tar.gz'
  },
  db: {
    src: '',
    output: 'db.zip'
  }
}

gulp.task('clean:dir', function(cb) {
  del([exportDir + '**', offline + '**', path.join(__dirname, packSvr)], cb())
})

gulp.task('build:ver', function(cb) {
  replace({
    regex: new RegExp(/WEBVer-[-\d\.]+/),
    replacement: stampVer,
    paths: [file],
    recursive: false,
    silent: true
  })
  cb()
})

gulp.task('build:client', ['build:ver'], function(cb) {
  exec('npm run build', function(err) {
    if (err) {
      return cb(err)
    } // 返回 error
    cb() // 完成 task
  })
})

gulp.task('build:zipclientslim', ['build:client'], function(cb) {
  mkdirp.sync(exportDir)
  return gulp
    .src(packs.client_slim.src)
    .pipe(zip(packs.client_slim.output))
    .pipe(gulp.dest(exportDir))
})

gulp.task('server:npm_pack', function(cb) {
  exec('npm pack', function(err) {
    if (err) {
      return cb(err)
    }
    cb()
  })
})

gulp.task('copy:server_tgz', ['server:npm_pack'], function(cb) {
  mkdirp.sync(offline)
  var src = path.join(__dirname, packSvr)
  return gulp.src(src).pipe(gulp.dest(offline))
})

gulp.task('tar:server', ['copy:server_tgz'], function(cb) {
  var dir = path.join(__dirname, offline, packSvr)
  exec('tar -xzf ' + dir + ' -C ' + offline, function(err) {
    if (err) {
      return cb(err)
    }
    cb()
  })
})

gulp.task('sync:.bin', ['tar:server'], function(cb) {
  var srcDir = './node_modules/.bin'
  var destPath = path.join(offline, '/package/node_modules/')
  exec('cp -r ' + srcDir + ' ' + destPath, function(err) {
    if (err) {
      return cb(err)
    }
    cb()
  })
})

gulp.task('export:offlineserver', ['sync:.bin'], function(cb) {
  mkdirp.sync(exportDir)
  var outFile = path.join(__dirname, exportDir, packs.serverOffline.output)
  var srcDir = path.join(__dirname, offline, '/package')
  exec('cd ' + srcDir + ' && tar -czf ' + outFile + ' * .[!.]* --exclude .svn', function(err) {
    if (err) {
      console.log('export:offlineserver failed: ' + err)
      return cb(err) // 返回 error
    }
    console.log(outFile)
    cb() // 完成 task
  })
})

gulp.task('deploy:offline', ['clean:dir', 'build:zipclientslim', 'export:offlineserver'])

gulp.task('default',['deploy:offline']); 