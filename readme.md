# 신한 UX라이팅 시스템

## 목차

- [Setting](#setting)
- [Process](#process)
- [Command Line Interface](#command-line-interface)
- [File Structure](#file-structure)

## 📌Setting

### 개발환경

#### 필수설치

1. <a href="https://nodejs.org/ko" target="_blank">Node.js</a> (LTS)- v16.16.0
2. <a href="https://www.npmjs.com" target="_blank">NPM</a> or <a href="https://yarnpkg.com" target="_blank">YARN</a> - 노드 패키지 매니징 프로그램

#### 선택설치

1. <a href="https://code.visualstudio.com" target="_blank">VisualStudioCode</a> 에디터

   - <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint&ssr=false#review-details">Visualstudio Extension ESLint</a> JavaScript linter
   - <a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode&ssr=false#review-details">Visualstudio Extension Prettier</a> JavaScript Code Formatter
   - <a href="https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks">Visualstudio Extension Nunjucks</a> NunJucks
   - <a href="https://marketplace.visualstudio.com/items?itemName=okitavera.vscode-nunjucks-formatter">Visualstudio Extension Nunjucks Formatter</a> NunJucks Formatter
   - <a href="https://marketplace.visualstudio.com/items?itemName=mblode.twig-language">Visualstudio Extension twig-language</a> twig-language
   - <a href="https://marketplace.visualstudio.com/items?itemName=whatwedo.twig">Visualstudio Extension twig</a> twig

2. settings.json

   - "[nunjucks]": {
     "editor.defaultFormatter": "okitavera.vscode-nunjucks-formatter"
     },

   - "[twig]": {
     "editor.defaultFormatter": "mblode.twig-language-2"
     }

## 📌Process

### 🚀개발서버 실행/프로덕션 빌드

개발서버 실행 또는 프로덕션 빌드 시 소스파일은 컴파일되어 생성되거나 특정폴더(development, production)에 복사됩니다.<br/>
복사된 파일 기준으로 화면목록을 생성 후 해당 폴더를 대상으로 <a href="https://browsersync.io/" target="_blank">BrowserSync</a>를 통해 로컬 서버가 실행되며 웹브라우저가 오픈됩니다.<br>
이후 모든 파일에 대해 watch가 실행되며 변경/수정/삭제된 항목에 대해서 자동으로 업데이트되며 브라우저에 반영됩니다.(새로고침)

### 개발서버 실행/프로덕션 빌드 시 소스파일 경로는 아래와 같이 변환됩니다.

`buildType desktop`
`env (development, production)`

```js
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
    };
    return pathInfo[buildType][dir];
  },
  input: filesPath => {
    return `./src/${buildType}/${filesPath}`;
  },
};
```

### HTML

`src/${buildType}/res/html/` 하위 모든 .njk 파일은 .html 파일로 변환됩니다.

> templates 폴더의 파일은 변환이 되지않습니다.

### CSS

`src/${buildType}/res/scss/`하위 모든 scss 파일은 css 파일로 변환되며 하나의 파일로 합쳐집니다(styles.css).

### JAVASCRIPT

`src/${buildType}/res/js/` 아위 모든 js 파일은 es5형식으로 변환되며 하나의 파일로 합쳐집니다.(uxw.ui.js)

> vendor 폴더 속의 script는 따로 변환 처리되지 않고 빌드 폴더로 복사됩니다.

## 📌Command-Line-Interface

#### 프로젝트 최초 실행 시 - 종속성 설치

```sh
npm install or yarn install
```

#### Command Line Interface

```javascript
  "scripts": {
    "dev": "cross-env BUILD_TYPE=desktop NODE_ENV=development gulp dev",
    // PC 개발서버 실행
    "build": "cross-env BUILD_TYPE=desktop NODE_ENV=production gulp build",
    // PC 프로젝트 전체 빌드
    "build:css": "cross-env BUILD_TYPE=desktop NODE_ENV=production gulp buildcss",
    // PC 프로젝트 scss 빌드
    "build:js": "cross-env BUILD_TYPE=desktop NODE_ENV=production gulp buildjs"
    // PC 프로젝트 js 빌드
  },
```

| 명령어                                  | 구분 | 설명                 | 파일생성 폴더      |
| --------------------------------------- | ---- | -------------------- | ------------------ |
| `npm run dev` or `yarn dev`             | pc   | 개발모드 시작        | development/res    |
| `npm run build:js` or `yarn build:js`   | pc   | javascript 개별 빌드 | production/res/js  |
| `npm run build:css` or `yarn build:css` | pc   | css 개별 빌드        | production/res/css |
| `npm run build` or `yarn build`         | pc   | 프로젝트 전체 빌드   | production/res/    |

## 📌File-Structure

```
src
├── desktop(pc)
└ ... 기타 프로젝트 설정 파일들
```

** 구조 **

```
src/desktop
│
├── guide
│     └── res
│         ├── html *.njk 가이드 파일 목록
│         └── guideStyle.scss           //가이드 스타일
└── res
    ├── fonts
    ├── html                // .njk 화면
    ├── images
    ├── js
    │    ├── components     //컴포넌트
    │    ├── lib            //기존 개발 소스
    │    ├── utils          //유틸
    │    └── vendor         //외부 소스
    │    common.js          //컴포넌트가 아닌 script 모음
    │    uxw.ui.js          //컴포넌트 js
    │    ... *.js           //개발측 .js
    │
    └── scss

```
