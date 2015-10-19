var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var path = require('path');
var reload = browserSync.reload;
historyApiFallback = require('connect-history-api-fallback');


//var watch = require('app/semantic/tasks/watch');
//var build = require('app/semantic/tasks/build');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: ["app"],
            routes: {
                '/bower_components': 'bower_components',
                '/semantic': 'semantic'
            },
            middleware: [historyApiFallback()]
        },
        open: false,
        notify: false,
        logPrefix: 'Designless',

    });

    gulp.watch("app/**/*.scss", ['sass']);
    gulp.watch("app/**/*.html").on('change', reload);

    gulp.watch(['app/**/*.js'], reload); // ['jshint']

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});


var styleTask = function(sourcePath, endPath, srcs) {
    return gulp.src(srcs.map(function(src) {
            return path.join('app', sourcePath, src);
        }))
        .pipe($.changed(sourcePath, {
            extension: '.css'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('.tmp/' + sourcePath))
        .pipe($.if('*.css', $.cssmin()))
        .pipe(gulp.dest('dist/' + endPath))
        .pipe($.size({
            title: sourcePath
        }));
};

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {
    return styleTask('scss', 'css', ['**/*.*css']);
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
    var app = gulp.src(['app/*'], {
        dot: true
    }).pipe(gulp.dest('dist'));

    var bower = gulp.src([
        'bower_components/**/*'
    ]).pipe(gulp.dest('dist/bower_components'));

    var semantic = gulp.src([
        'semantic/**/*'
    ]).pipe(gulp.dest('dist/semantic'));

    return merge(app, bower, semantic)
        .pipe($.size({
            title: 'copy'
        }));
});


// Build Production Files, the Default Task
gulp.task('build', ['clean'], function(cb) {
    runSequence(
        ['copy', 'styles'],
        cb);
    // Note: add , 'precache' , after 'vulcanize', if your are going to use Service Worker
});

gulp.task('default', ['serve']);



//gulp.task('watch-ui', 'Watch UI for Semantic UI', watch);
//gulp.task('build-ui', 'Build UI for Semantic UI', build);