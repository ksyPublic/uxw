// 빌드타입 (desktop)
const buildType = process.env.BUILD_TYPE;
// 빌드환경 (development, production) 개발 | 운영
const env = process.env.NODE_ENV;
// 빌드타입, 환경에따른 아웃풋 경로 반환
const filesPath = {
  output: dir => {
    const pathInfo = {
      desktop: {
        image: `${env}/${buildType}/res/images`,
        html: `${env}/${buildType}`,
        css: `${env}/${buildType}/res/css`,
        js: `${env}/${buildType}/res/js`,
        font: `${env}/${buildType}/res/fonts`,
        guideCss: `${env}/${buildType}/guide`,
      },

      admin: {
        image: `${env}/${buildType}/res/images`,
        html: `${env}/${buildType}`,
        css: `${env}/${buildType}/res/css`,
        js: `${env}/${buildType}/res/js`,
        font: `${env}/${buildType}/res/fonts`,
        guideCss: `${env}/${buildType}/guide`,
      },
    };
    return pathInfo[buildType][dir];
  },
  input: filesPath => {
    return `./src/${buildType}/${filesPath}`;
  },
};

const webpackConfig = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map', // process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'production',
  output: {
    filename: `uxw.ui.js`,
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};

export { filesPath, webpackConfig };
