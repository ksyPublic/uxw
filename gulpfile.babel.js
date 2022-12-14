import gulp from 'gulp';
import gulpRender from 'gulp-nunjucks-render';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import formatHtml from 'gulp-beautify';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';
import nodeSass from 'node-sass';
import autoprefixer from 'gulp-autoprefixer'; //scss to css
import BundleAnalyzer from 'webpack-bundle-analyzer';
import webpack from 'webpack-stream';
import { filesPath, webpackConfig } from './uxw.config.js';
const destDir = `${process.env.NODE_ENV}/${process.env.BUILD_TYPE}`;
const devServer = browserSync.create();
const scss = gulpSass(nodeSass);

const BundleAnalyzerPlugin = BundleAnalyzer.BundleAnalyzerPlugin;
/**
 * 웹펙으로 번들링한 js를 시각적으로 확인가능 ( dev mode 에서는 실행 안됨)
 */
if (process.env.NODE_ENV !== 'development') {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  );
}

const clean = () => {
  return deleteAsync([`development/**`, `production/**`]);
};

const js = () => {
  return gulp
    .src(filesPath.input('res/js/uxw.ui.js'), { allowEmpty: true })
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(filesPath.output('js')))
    .pipe(devServer.stream());
};

//기존프로젝트 소스 유지
const resourceCopy = () => {
  return gulp
    .src([filesPath.input('res/js/**/*.{js,css}'), `!${filesPath.input('res/js/uxw.ui.js')}`, `!${filesPath.input('res/js/common.js')}`, `!${filesPath.input('res/js/utils/**')}`, `!${filesPath.input('res/js/vendor/**')}`, `!${filesPath.input('res/js/components/**')}`])
    .pipe(gulp.dest(filesPath.output('js')))
    .pipe(devServer.stream());
};

const css = () =>
  gulp
    .src(filesPath.input(`res/scss/styles.scss`), { allowEmpty: true })
    .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
    .pipe(scss.sync().on('error', scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
    .pipe(autoprefixer())
    .pipe(gulpSourcemaps.write('.', { sourceRoot: 'css-source' })) //컴파일후 작성
    .pipe(gulp.dest(filesPath.output('css')))
    .pipe(devServer.stream());

const resourceCSS = () =>
  gulp
    .src(filesPath.input(`res/scss/**/*.css`), { allowEmpty: true })
    .pipe(autoprefixer())
    .pipe(gulp.dest(filesPath.output('css')))
    .pipe(devServer.stream());

const html = () => {
  return gulp
    .src(
      [filesPath.input('res/html/**/*.njk'), `!${filesPath.input('res/html/templates/**')}`],
      { allowEmpty: true },
      {
        since: gulp.lastRun(html),
      },
    )
    .pipe(gulpRender({ path: [filesPath.input('res/html/templates')] }))
    .pipe(
      formatHtml.html({
        indent_size: 2,
        preserve_newlines: false,
      }),
    )
    .pipe(gulp.dest(filesPath.output('html') + '/res/html'))
    .pipe(devServer.stream());
};

const font = () => {
  return gulp.src([filesPath.input('res/fonts/*.{eot,otf,svg,ttf,woff,woff2}')], { allowEmpty: true }).pipe(gulp.dest(filesPath.output('font')));
};

const images = () => {
  return gulp
    .src([filesPath.input('res/images/**/*.{png,jpg,svg}')], { allowEmpty: true })
    .pipe(gulp.dest(filesPath.output('image')))
    .pipe(devServer.stream());
};

//가이드 내부 resource 복사
const _guideVendorCopy = () => {
  return gulp
    .src(filesPath.input(`guide/vendor/*.{css,js}`))
    .pipe(gulp.dest(filesPath.output(`html`) + `/guide/vendor`))
    .pipe(devServer.stream());
};

const _guideResourceScssCopy = () => {
  return gulp
    .src(filesPath.input(`guide/res/guideStyle.scss`), { allowEmpty: true })
    .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
    .pipe(scss.sync().on('error', scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
    .pipe(autoprefixer())
    .pipe(gulpSourcemaps.write('.', { sourceRoot: 'css-source' })) //컴파일후 작성
    .pipe(gulp.dest(filesPath.output(`guideCss`) + `/res`))
    .pipe(devServer.stream());
};

const _guideResourceJsCopy = () => {
  return gulp
    .src(filesPath.input(`guide/res/*.js`))
    .pipe(gulp.dest(filesPath.output(`html`) + `/guide/res`))
    .pipe(devServer.stream());
};

const _guideHtmlCopy = () => {
  return gulp
    .src([filesPath.input(`guide/**/*.njk`), `!${filesPath.input('guide/res/html/templates/**')}`])
    .pipe(
      gulpRender({
        path: [filesPath.input(`guide/res/html/templates`)],
      }),
    )
    .pipe(
      formatHtml.html({
        indent_size: 4,
        preserve_newlines: false,
      }),
    )
    .pipe(gulp.dest(filesPath.output(`html`) + `/guide`))
    .pipe(devServer.stream());
};

//가이드 제작 우선으로 SERVER임시 GUIDE로 오픈
const watch = () => {
  devServer.init({
    open: true,
    port: 5501,
    browser: `http://localhost:5501/${process.env.DEV_SERVER === 'desktop' ? 'res/html/index' : 'guide/res/html/index'}.html`, //현재 guide_index.html은 설정하지않음
    server: {
      baseDir: destDir,
      directory: true,
    },
  });

  //변경감지를 위한 소스를 앞쪽에, 뒤에는 실행할 파일
  gulp.watch(filesPath.input('res/html/**/*'), gulp.series([html]));
  gulp.watch(filesPath.input(`res/fonts/*`), font);
  gulp.watch(filesPath.input(`res/images/**/*`), images);
  gulp.watch(filesPath.input(`res/scss/**/*.scss`), css);
  gulp.watch(filesPath.input(`res/js/**/**`), js);

  //가이드페이지 작성할때만 watch 가이드 작성완료 이후 제거 예정
  gulp.watch(filesPath.input(`guide/**/*`), _guideHtmlCopy);
  gulp.watch(filesPath.input(`guide/res/*.js`), _guideResourceJsCopy);
  gulp.watch(filesPath.input(`guide/res/*.scss`), _guideResourceScssCopy);
};

const start = gulp.series([clean, js, css, html, font, images, _guideVendorCopy, _guideHtmlCopy, _guideResourceScssCopy, _guideResourceJsCopy, resourceCopy]);

export const dev = gulp.series([start, watch]); // package.json의 scripts에 작성한 "gulp dev" task
export const build = gulp.series([start]);
export const buildjs = gulp.series([clean, js, resourceCopy]);
export const buildcss = gulp.series([clean, css]);
