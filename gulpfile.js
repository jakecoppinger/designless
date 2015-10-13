var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var watch = require('./semantic/tasks/watch');
var build = require('./semantic/tasks/build');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);





gulp.task('watch-ui', 'Watch UI for Semantic UI', watch);
gulp.task('build-ui', 'Build UI for Semantic UI', build);
