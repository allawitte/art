var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sourcemap = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();

var config = {
    path: {
        less: ['./less/style.less', './less/sub/*.less']
    },
    output: {
        cssName: 'bundle.min.css',
        path: './css'
    },
    isDevelop: true
};

gulp.task('less', function () {
    return gulp.src(config.path.less)
        .pipe(gulpIf(config.isDevelop, sourcemap.init()))
        .pipe(less())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemap.write()))
        .pipe(gulp.dest(config.output.path))
       // .pipe(browserSync.stream())
});

gulp.task('server', function(){
    browserSync.init({
        server: {
            baseDir: config.output.path
        }});

    gulp.watch(config.path.less, ['less']);
    //gulp.watch(config.path.html).on('change', browserSync.reload);
});


gulp.task('default', ['less']);
