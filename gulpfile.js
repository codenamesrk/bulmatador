var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

// Asset Paths
const PATHS = {
    styles: {
        src: 'app/sass/styles.sass',
        dest: 'app/assets/styles' 
    },
    scripts: {
        src: '',
        dest: ''
    } 
};

// Clean Assets Directory
function clean(){
    return del(['assets/styles']);
}

// Static Server
function serve(){
    browserSync.init({
        server: './app/',        
    });
    // Watch
    gulp.watch(PATHS.styles.src, styles);
    gulp.watch('app/*.html').on('change', browserSync.reload);
}

// Sass
function styles(){
    return gulp.src(PATHS.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.styles.dest))
    .pipe(browserSync.stream())
}

// Gulp Tasks
exports.styles = styles;
exports.clean = clean;
exports.serve = serve;

// Run Tasks
var build = gulp.series(clean,styles,serve);

// Default Task
gulp.task('default',build);