import gulp from 'gulp'
import gulpSass from "gulp-sass"
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel'
import prettyHtml from 'gulp-format-html';
import browserSync from 'browser-sync';
import nodeSass from "node-sass"
import autoprefixer from 'gulp-autoprefixer'; //scss to css

const destDir = `${process.env.NODE_ENV}/${process.env.BUILD_TYPE}`;
const devServer = browserSync.create();

// 빌드타입 (mobile, desktop)
const buildType = process.env.BUILD_TYPE;
// 빌드환경 (development, production )
const env = process.env.NODE_ENV;
// 빌드타입, 환경에따른 아웃풋 경로 반환

const scss = gulpSass(nodeSass);
const path = 'src/resources';

const routes = {
    js: {
        src: `${path}/js/**/*.js`, // 대상 javascript파일
        dest: 'build/uxw/js', // javascript파일이 컴파일되어서 생성되는 폴더
    },

    css: {
        watch: `${path}/scss/*`,
        src: `${path}/scss/*.scss`,
        dest: 'build/uxw/css',
    },

    html: {
        src: `${path}/uxw/html/*.html`,
        dest: 'build/uxw/html',
    },

    _guideHtml: {
        src: `${path}/guide/html/*.html`,
        dest: 'build/guide/html',
    },
}

const js = () =>
    gulp
        .src(routes.js.src) // 출발지
        .pipe(babel()) // babel을 이용하여 컴파일
        .pipe(gulp.dest(routes.js.dest)) // 목적지
        .pipe(devServer.stream());


const css = () =>
    gulp
        .src(routes.css.src)
        .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
        .pipe(scss().on("error", scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
        .pipe(autoprefixer())
        .pipe(gulpSourcemaps.write('.', { sourceRoot: 'css-source' })) //컴파일후 작성
        .pipe(gulp.dest(routes.css.dest))
        .pipe(devServer.stream());

const html = () => {
    return gulp
        .src(routes.html.src, {
            since: gulp.lastRun(html),
        })
        .pipe(gulp.dest(routes.html.dest))
        .pipe(devServer.stream());
};

const watch = () => {
    devServer.init({
        open: true,
        port: 5500,
        browser: `http://localhost:5500/${process.env.BUILD_TYPE === 'portal' ? 'index' : 'guide_index'}.html`,
        server: {
            baseDir: destDir,
            directory: true,
        },
    });

    gulp.watch(`${path}/uxw/html/*.html`, gulp.series(html));
    gulp.watch(`${path}/uxw/scss/*.scss`, css);
    gulp.watch(`${path}/uxw/js/**/*.js`, js);
}

const start = gulp.series([js, css, html])

export const dev = gulp.series([start, watch]) // package.json의 scripts에 작성한 "gulp dev" task