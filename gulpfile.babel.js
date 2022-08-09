import gulp from "gulp";
import gulpInclude from "gulp-html-tag-include";
import gulpSass from "gulp-sass";
import gulpSourcemaps from "gulp-sourcemaps";
import formatHtml from "gulp-format-html";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import nodeSass from "node-sass";
import autoprefixer from "gulp-autoprefixer"; //scss to css
import BundleAnalyzer from "webpack-bundle-analyzer";
import webpack from "webpack-stream";
import { path, webpackConfig } from "./uxw.config.js";

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
        .src(path.input("resources/js/uxw.ui.js"), { allowEmpty: true })
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.output("js")))
        .pipe(devServer.stream());
};

const css = () =>
    gulp
        .src(path.input(`resources/scss/main.scss`), { allowEmpty: true })
        .pipe(gulpSourcemaps.init()) //컴파일을 위해 gulpSourcemaps.init()로 생성
        .pipe(scss.sync().on("error", scss.logError)) //Error체크를 하지않으면 watch에서 오류발생
        .pipe(autoprefixer())
        .pipe(gulpSourcemaps.write(".", { sourceRoot: "css-source" })) //컴파일후 작성
        .pipe(gulp.dest(path.output("css")))
        .pipe(devServer.stream());

const html = () => {
    return gulp
        .src(
            [path.input("pages/**/*.html")],
            { allowEmpty: true },
            {
                since: gulp.lastRun(html),
            }
        )
        .pipe(gulpInclude())
        .pipe(formatHtml({
            "indent_size": 4,
        }))
        .pipe(gulp.dest(path.output("html") + "/pages/"))
        .pipe(devServer.stream());
};

const font = () => {
    return gulp
        .src([path.input("resources/fonts/*.{eot,otf,svg,ttf,woff,woff2}")], { allowEmpty: true })
        .pipe(gulp.dest(path.output("font")))
}

// const _guideHtml = () => {
//     return gulp
//         .src(path.input(`_guide/${process.env.BUILD_TYPE === 'desktop' ? '_guide' : 'psg_portal'}/resources/**`), { allowEmpty: true })
//         .pipe(gulp.dest(path.output(`html`) + `/_guide/${process.env.BUILD_TYPE === 'desktop' ? '_guide' : 'psg_portal'}/resources`));
// };

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
    gulp.watch(path.input("pages/**/*.html"), gulp.series([html]));
    gulp.watch(path.input(`resources/fonts/*`), font);
    gulp.watch(path.input(`resources/scss/**/*.scss`), css);
    gulp.watch(path.input(`resources/js/**/**`), js);
};

const start = gulp.series([clean, js, css, html, font]);

export const dev = gulp.series([start, watch]); // package.json의 scripts에 작성한 "gulp dev" task
export const build = gulp.series([start]);
export const buildjs = gulp.series([clean, js]);
export const buildcss = gulp.series([clean, css]);
