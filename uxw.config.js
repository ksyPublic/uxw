// 빌드타입 (desktop)
const buildType = process.env.BUILD_TYPE;
// 빌드환경 (development, production) 개발 | 운영
const env = process.env.NODE_ENV;
// 빌드타입, 환경에따른 아웃풋 경로 반환
const filesPath = {
    output: (dir) => {
        const pathInfo = {
            desktop: {
                image: `${env}/${buildType}/resources/images`,
                html: `${env}/${buildType}`,
                css: `${env}/${buildType}/resources/css`,
                js: `${env}/${buildType}/resources/js`,
                font: `${env}/${buildType}/resources/fonts`,
                guideCss: `${env}/${buildType}/_guide`,
            },
        };
        return pathInfo[buildType][dir];
    },
    input: (filesPath) => {
        return `./src/${buildType}/${filesPath}`;
    },
};

const webpackConfig = {
    mode: process.env.NODE_ENV,
    devtool: "source-map", // process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'production',
    output: {
        filename: `uxw.ui.js`,
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
};

export { filesPath, webpackConfig };
