const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');

const concat = require('gulp-concat');
const cssnano = require('cssnano');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();


const paths = {
    styles: {
        src: ['src/scss/**/*.scss'],
        dest: './dist/css/'
    },
    scripts: {
        src: ['src/js/**/*.js'],
        dest: './dist/js/'
    },
    images: {
        src: ['src/img/**/*'],
        dest: './dist/img/'
    }
}


/*
 Compiling scss files into css.
 Adding vendor prefixes to CSS properties to support the latest versions of each browser.
 Removing unused CSS code.
 Copying the minified styles.min.css 
*/

function scssTask() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest));
}

/* 
Concatenating all js files into one scripts.min.js and minifying it.
Copying the minified scripts.min.js files to the dist folder.
*/

function compileJs() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('scripts.js'))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scripts.dest))
}

// Optimizing images and copying them to the dist/img folder.

function optimizeImg() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
}


// Cleaning the dist folder.

function cleanDist() {
    return gulp.src('dist/*', { read: false })
        .pipe(clean())
}

// starting the server

function browsersyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    })
    cb()
}

function reloadPage(cb) {
    browsersync.reload();
    cb();
}



// watching changes
function watcher() {
    gulp.watch('.*html', reloadPage);
    gulp.watch(paths.images.src, optimizeImg);
    gulp.watch(paths.styles.src, gulp.parallel(scssTask, reloadPage));
    gulp.watch(paths.scripts.src, gulp.parallel(compileJs, reloadPage));
}


gulp.task('build', gulp.series(
    cleanDist,
    gulp.parallel(scssTask, compileJs),
    optimizeImg
))

gulp.task('dev', gulp.series(
    'build',
    gulp.parallel(
        watcher, browsersyncServer
    ),
    reloadPage
))