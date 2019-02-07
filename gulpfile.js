var path = require('path');
var gulp = require('gulp');
var del = require('del');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var cwebp = require('gulp-cwebp');

// Set Environment Var
const CODE = {
    environment: 'development',
    development() {
        return this.environment === 'development';
    },
    production() {
        return this.environment === 'production';
    }
}

// Autoprefixer
// const supported = [
//     'last 2 versions',
//     'safari >= 8',
//     'ie >= 10',
//     'ff >= 20',
//     'ios 6',
//     'android 4'
// ];

// Asset Paths
const PATHS = {
    include: [
        './node_modules'  
    ],
    styles: {
        src: 'app/sass/**/*.sass',
        entry: 'app/sass/bulma.sass',
        dest: 'app/assets/styles',
        dist: 'app/dist/assets/styles',
    },
    html: {
        src: 'app/*.html',
        dest: 'app/dist/'
    },
    assets: {
        src: 'app/assets/**/*',
        dest: 'app/dist/assets/'
    },
    images: {
        src: 'app/assets/images/**/*',
        dest: 'app/dist/assets/images/',
        webp: 'app/dist/assets/images/webp/' 
    } 
};

// PostCSS Plugins
var plugins = [
    uncss({
        html: ['app/index.html'],
        ignore: ['.navbar-menu.is-active','.navbar-burger span','.navbar-burger.is-active span','.section.icons-panel .column.is-active a']
    }),
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
];

// Clean Assets Directory
function cleanAssets(){
    return del('./app/assets/styles/**/*');
}
function cleanDist(){
    return del('./app/dist/**/*');
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
    return gulp.src(PATHS.styles.entry)    
    .pipe(gulpIf(CODE.development(),sourcemaps.init()))
    .pipe(sass({includePaths: PATHS.include}).on('error', sass.logError))
    .pipe(gulpIf(CODE.development(),sourcemaps.write()))
    .pipe(gulp.dest(PATHS.styles.dest))
    .pipe(browserSync.stream())    
}

// Production
function html(){
    return gulp.src(PATHS.html.src)
    .pipe(gulp.dest(PATHS.html.dest))
}
function assets(){
    return gulp.src(PATHS.assets.src)
    .pipe(gulp.dest(PATHS.assets.dest))
}
function minifyCSS(){
    return gulp.src(PATHS.styles.dest+'/bulma.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest(PATHS.styles.dist))
}
function exportWebp(){
    return gulp.src(PATHS.images.src)
    .pipe(cwebp())
    .pipe(gulp.dest(PATHS.images.webp))
}

// Gulp Tasks
exports.styles = styles;
exports.cleanAssets = cleanAssets;
exports.cleanDist = cleanDist;
exports.serve = serve;
exports.minifyCSS = minifyCSS;
exports.html = html;
exports.assets = assets;

// Run Tasks
var build = gulp.series(cleanAssets,styles,serve);

// Default Task
gulp.task('default',build);

// Minify Task
gulp.task('minify',gulp.series(cleanDist,html,assets,styles,minifyCSS,exportWebp))