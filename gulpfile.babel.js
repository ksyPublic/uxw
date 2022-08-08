import gulp from "gulp";
import gulpSass from "gulp-sass";
import gulpSourcemaps from "gulp-sourcemaps";
import prettyHtml from "gulp-format-html";
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
        .pipe(gulp.dest(path.output("html") + "/pages/"))
        .pipe(devServer.stream());
};

const watch = () => {
    devServer.init({
        open: true,
        port: 5500,
        browser: `http://localhost:5500/pages/${process.env.BUILD_TYPE === "desktop" ? "index" : "guide_index"}.html`,
        server: {
            baseDir: destDir,
            directory: true,
        },
    });

    gulp.watch(path.input("resources/pages/**/*.html"), gulp.series(html));
    gulp.watch(path.input(`resources/scss/*`), css);
    gulp.watch(path.input(`resources/js/**/**`), js);
};

const start = gulp.series([js, css, html]);

export const dev = gulp.series([start, watch]); // package.json의 scripts에 작성한 "gulp dev" task
