'use strict';
import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import nunjucks from 'gulp-nunjucks';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import webp from 'gulp-webp';
import clone from 'gulp-clone';
import browsersync from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import del from 'del';
const reload = browsersync.reload;
const imgClone = clone.sink();
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
//последние две возможно не нужны

const path = {
  src: {
    html: 'src/*.html',
    styles: 'src/styles/*.scss',
    js: 'src/*.js',
    img: 'src/img/*.{jpg,jpeg,png,webp,svg}',
    svg: "src/img/svg/*.svg"
  },
  build: {
    html: 'build/',
    styles: 'build/css/',
    js: 'build/',
    img: 'build/img/',
    svg: "build/img/svg"
  },
  watch: {
    html: 'src/**/*.html',
    styles: 'src/styles/**/*.scss',
    js: 'src/**/*.js',
    img: 'src/img/**/*.{jpg,jpeg,png,webp,svg}',
    svg: "src/img/svg/*.svg"
  },

  base: './build'
};

const browserSync = (done) => {
  browsersync.init({
    server: {
      baseDir: path.base
    },
    port: 3000
  });
  done();
};

const clean = () => {
  return del(path.base);
};

const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
};

const styles = () => {
  return gulp
    .src(path.src.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.build.styles))
    .pipe(reload({ stream: true }));
};

const js = () => {
  return gulp
    .src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
};

const img = () => {
  return gulp
    .src(path.src.img)
    .pipe(changed(path.build.img))
    .pipe(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 })
    ]))

    .pipe(imgClone)
    .pipe(webp())
    .pipe(imgClone.tap())

    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
};

const svg = () => {
  return gulp
    .src(path.src.svg)
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))

    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))

    .pipe(gulp.dest(path.build.svg))
    .pipe(reload({ stream: true }));
};

const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.styles], styles);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], img);
  gulp.watch([path.watch.svg], svg);
};

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('js', js);
gulp.task('img', img);
gulp.task('svg', svg);

gulp.task('build', gulp.series(clean, gulp.parallel(html, styles, js, img, svg)));
gulp.task('watch', gulp.parallel(watchFiles, browserSync));