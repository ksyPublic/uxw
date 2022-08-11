import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';
import Tab from './components/panel/tab';
import commonInit from './common';
/**
 * UI 초기화 처리
 * @param {*} target
 * @param {*} UI
 * @param {*} options
 */
const UIInitializer = (target, UI, options = {}) => {
    const elements = document.querySelectorAll(target);
    elements.forEach(el => {
        if (!UI.getInstance(el)) {
            const ui = new UI(el, options);
            ui.init();
        }
    });
};

Tab.GLOBAL_CONFIG = {
    activeClass: 'is-active',
};

const initialize = () => {
    // 탭
    UIInitializer('[data-ui-tab]', Tab);
    commonInit.initialize();
    return 'initialized';
}

const a11yChecker = () => {
    const tabChecker = () => {
        const tabs = document.querySelectorAll('[data-ui-tab]');
        console.warn('-------------------> a11y Check! <-------------------');
        console.warn(`현재 검사된 탭 개수: ${tabs.length}개`);

        tabs.forEach(tab => {
            const tablist = tab.querySelectorAll('[role="tablist"]');

            if (tablist.length > 0) {
                tablist.forEach(el => {
                    console.log('-----------------------------------------------------');
                    console.log(`  1. role="tablist": ✅`);
                    const roleTab = el.querySelectorAll('[role="tab"]');

                    roleTab.forEach(ta => {
                        const cId = ta.getAttribute('id');
                        const sameId = document.querySelectorAll(`#${cId}`);
                        if (sameId.length > 1) {
                            console.log(`       found the same ID --> ${cId} ❌`);
                        }
                        console.log(`    > ${ta.textContent}`);
                        console.log(`       [header] role="tab" ✅`);
                        console.log(`       [header] id="${ta.getAttribute('id')}" ✅`);
                        const contentPanelID = ta.getAttribute('aria-controls');
                        const contentPage = document.querySelector(`#${contentPanelID}`);
                        if (contentPage) {
                            console.log(`       [header] aria-controls=${ta.getAttribute('aria-controls')} ✅`);
                            if (contentPage.getAttribute('role') === 'tabpanel') {
                                console.log(`       [content] role="tabpanel" ✅`);
                                console.log(`       [content] id="${contentPage.getAttribute('id')}" ✅`);
                            } else {
                                console.log(`       [content] role="tabpanel" ❌`);
                            }

                            if (contentPage.getAttribute('aria-labelledby') === cId) {
                                console.log(`       [content] aria-labelledby="${cId}" ✅`);
                            } else {
                                console.log(`       [content] aria-labelledby="${cId}" ❌`);
                            }
                        } else {
                            console.log(`       [header] aria-controls=${ta.getAttribute('aria-controls')} ❌`);
                        }

                        if (ta.getAttribute('aria-selected') === 'false') {
                            if (contentPage.offsetWidth < 1 && contentPage.offsetHeight < 1) {
                                console.log(`       [header] aria-selected=${ta.getAttribute('aria-selected')} ✅`);
                            } else {
                                console.log(`       [header] aria-selected=${ta.getAttribute('aria-selected')} ❌`);
                            }
                        } else {
                            if (contentPage.offsetWidth < 1 && contentPage.offsetHeight < 1) {
                                console.log(`       [header] aria-selected=${ta.getAttribute('aria-selected')} ❌`);
                            } else {
                                console.log(`       [header] aria-selected=${ta.getAttribute('aria-selected')} ✅`);
                            }
                        }
                    });
                });
            } else {
                console.warn(`  1. role="tablist": OK!`);
            }
        });
    };
    tabChecker();
};

if (window.UXW) {
    console.warn('');
    console.warn('   이 경고 문구는 [uxw.ui.js] 파일이 중복으로 로드되는 경우에 출력됩니다.');
    console.warn('   중복로드를 찾아 제거하세요.');
    console.warn('');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initialize();
        commonInit.initFunc();
        EventHandler.trigger(document, 'UILoaded');
        console.log('UI Initialized!');
    });
}

const ui = {
    initialize,
    Tab,
    a11yChecker
}

window.UXW = { ...ui }
