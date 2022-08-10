import gulp from "gulp";
import gulpInclude from "gulp-file-include";
import gulpSass from "gulp-sass";
import gulpSourcemaps from "gulp-sourcemaps";
import formatHtml from "gulp-format-html";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import nodeSass from "node-sass";
import autoprefixer from "gulp-autoprefixer"; //scss to css
import BundleAnalyzer from "webpack-bundle-analyzer";
import webpack from "webpack-stream";
import { filesPath, webpackConfig } from "./uxw.config.js";
const destDir = `${process.env.NODE_ENV}/${process.env.BUILD_TYPE}`;
const devServer = browserSync.create();
const scss = gulpSass(nodeSass);

const BundleAnalyzerPlugin = BundleAnalyzer.BundleAnalyzerPlugin;
/**
 * 웹펙으로 번들링한 js를 시각적으로 확인가능 ( dev mode 에서는 실행 안됨)
 */
if (process.env.NODE_ENV !== "development") {
    webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
        })
    );
}

const clean = () => {
    return deleteAsync([`development/**`, `production/**`]);
};

const js = () => {
    return gulp
        .src(filesPath.input("resources/js/uxw.ui.js"), { allowEmpty: true })
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(filesPath.output("js")))
        .pipe(devServer.stream());
};

const css = () =>
    gulp
        .src(filesPath.input(`resources/scss/main.scss`), { allowEmpty: true })
        .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
        .pipe(scss.sync().on("error", scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
        .pipe(autoprefixer())
        .pipe(gulpSourcemaps.write(".", { sourceRoot: "css-source" })) //컴파일후 작성
        .pipe(gulp.dest(filesPath.output("css")))
        .pipe(devServer.stream());

const html = () => {
    return gulp
        .src(
            [filesPath.input("pages/**/*.html"), `!${filesPath.input("pages/_includes/*")}`],
            { allowEmpty: true },
            {
                since: gulp.lastRun(html),
            }
        )
        .pipe(gulpInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(formatHtml({
            "indent_size": 4,
        }))
        .pipe(gulp.dest(filesPath.output("html") + "/pages/"))
        .pipe(devServer.stream());
};

const font = () => {
    return gulp
        .src([filesPath.input("resources/fonts/*.{eot,otf,svg,ttf,woff,woff2}")], { allowEmpty: true })
        .pipe(gulp.dest(filesPath.output("font")))
};

const images = () => {
    return gulp
        .src([filesPath.input("resources/images/*.{png,jpg,svg}")], { allowEmpty: true })
        .pipe(gulp.dest(filesPath.output("image")))
        .pipe(devServer.stream());
};

//가이드 내부 resource 복사
const _guideVendorCopy = () => {
    return gulp
        .src(filesPath.input(`_guide/vendor/*.{css,js}`))
        .pipe(gulp.dest(filesPath.output(`html`) + `/_guide/vendor`))
        .pipe(devServer.stream());
}

const _guideResourceScssCopy = () => {
    return gulp
        .src(filesPath.input(`_guide/resources/guideStyle.scss`), { allowEmpty: true })
        .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
        .pipe(scss.sync().on("error", scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
        .pipe(autoprefixer())
        .pipe(gulpSourcemaps.write(".", { sourceRoot: "css-source" })) //컴파일후 작성
        .pipe(gulp.dest(filesPath.output(`guideCss`) + `/resources`))
        .pipe(devServer.stream());
}

const _guideResourceJsCopy = () => {
    return gulp
        .src(filesPath.input(`_guide/resources/*.js`))
        .pipe(gulp.dest(filesPath.output(`html`) + `/_guide/resources`))
        .pipe(devServer.stream());
}

const _guideHtmlCopy = () => {
    return gulp
        .src([filesPath.input(`_guide/**/*.html`), `!${filesPath.input("_guide/pages/**")}`])
        .pipe(gulpInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(formatHtml({
            "indent_size": 4,
        }))
        .pipe(gulp.dest(filesPath.output(`html`) + `/_guide`))
        .pipe(devServer.stream());
}

const watch = () => {
    devServer.init({
        open: true,
        port: 5501,
        browser: `http://localhost:5501/pages/${process.env.BUILD_TYPE === "desktop" ? "index" : "guide_index"}.html`, //현재 guide_index.html은 설정하지않음
        server: {
            baseDir: destDir,
            directory: true,
        },
    });

    //변경감지를 위한 소스를 앞쪽에, 뒤에는 실행할 파일
    gulp.watch(filesPath.input("pages/**/*.html"), gulp.series([html]));
    gulp.watch(filesPath.input(`resources/fonts/*`), font);
    gulp.watch(filesPath.input(`resources/images/*`), images);
    gulp.watch(filesPath.input(`resources/scss/**/*.scss`), css);
    gulp.watch(filesPath.input(`resources/js/**/**`), js);

    //가이드페이지 작성할때만 watch 가이드 작성완료 이후 제거 예정
    gulp.watch(filesPath.input(`_guide/**/*.html`), _guideHtmlCopy);
    gulp.watch(filesPath.input(`_guide/resources/*.js`), _guideResourceJsCopy);
    gulp.watch(filesPath.input(`_guide/resources/*.scss`), _guideResourceScssCopy);

};

const start = gulp.series([clean, js, css, html, font, images, _guideVendorCopy, _guideHtmlCopy, _guideResourceScssCopy, _guideResourceJsCopy]);

export const dev = gulp.series([start, watch]); // package.json의 scripts에 작성한 "gulp dev" task
export const build = gulp.series([start]);
export const buildjs = gulp.series([clean, js]);
export const buildcss = gulp.series([clean, css]);
