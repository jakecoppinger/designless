var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

//var watch = require('app/semantic/tasks/watch');
//var build = require('app/semantic/tasks/build');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: ["app"],
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        open: false,
        notify: false,
        logPrefix: 'Designless',

    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/**/*.html").on('change', reload);


  gulp.watch(['app/js/**/*.js'], reload); // ['jshint']



});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);





//gulp.task('watch-ui', 'Watch UI for Semantic UI', watch);
//gulp.task('build-ui', 'Build UI for Semantic UI', build);