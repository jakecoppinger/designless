var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate');
var path = require('path');
var reload = browserSync.reload;
historyApiFallback = require('connect-history-api-fallback');

//var watch = require('app/semantic/tasks/watch');
//var build = require('app/semantic/tasks/build');

// Static Server + watching scss/html files
gulp.task('serve', ['injectsass'], function() {

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

    gulp.watch("app/**/*.scss", ['injectsass']);
    gulp.watch("app/**/*.html").on('change', reload);

    gulp.watch(['app/**/*.js'], ['jshint', reload]); // ['jshint']

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('injectsass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Compile stylesheets
gulp.task('styles', function() {
    var inputPath = 'scss';
    var outputPath = 'css';

    var srcs = ['**/*.*css'];
    return gulp.src(srcs.map(function(src) {
            return path.join('app', inputPath, src);
        }))
        .pipe($.changed(inputPath, {
            extension: '.css'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('.tmp/' + inputPath))
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/' + outputPath))
        .pipe($.size({
            title: inputPath
        }));
});


// Copy Web Fonts To Dist
gulp.task('fonts', function() {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({
            title: 'fonts'
        }));
});

// Uglify & Lint JavaScript
gulp.task('js', function() {
    var outputPath = 'js';
    return gulp.src([
        'app/js/**/*.js'
    ])

    //.pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        .pipe(ngAnnotate()) // Fixes angularjs dependency injection
        .pipe($.uglify({
            preserveComments: false
        }))
        .pipe(gulp.dest('dist/' + outputPath))
});


// Lint JavaScript
gulp.task('jshint', function() {
    return gulp.src([
            'app/js/**/*.js'
        ])
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.jshint.extract()) // Extract JS from .html files
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
    return gulp.src(['app/**/*.html'])


    .pipe($.minifyHtml({
            quotes: true,
            empty: true,
            spare: true
        }))
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html'
        }));
});


// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
    var app = gulp.src([
        'app/*',
    ], {
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

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


gulp.task('build', ['clean'], function(cb) {
    runSequence(
        ['copy', 'styles', 'js'], ['html', 'fonts'],
        cb);
    // Note: add , 'precache' , after 'vulcanize', if your are going to use Service Worker
});

gulp.task('default', ['serve']);