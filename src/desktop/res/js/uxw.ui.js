/* eslint-disable new-cap */
import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';
import Tab from './components/tab';
import Tooltip from './components/tooltip';
import Accordion from './components/accordion';
import Dropdown from './components/dropdown';
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

Accordion.GLOBAL_CONFIG = {
    activeClass: 'is-active',
};

Tooltip.GLOBAL_CONFIG = {
    activeClass: 'is-active',
};

Dropdown.GLOBAL_CONFIG = {
    activeClass: 'is-active',
};

const SwiperA11y = (el, options = {}) => {
    return new window.Swiper(el, {
        ...options,
        threshold: 10, // 10px 이상 움직여야 슬라이드 기능작동
        a11y: {
            nextSlideMessage: '다음 슬라이드',
            prevSlideMessage: '이전 슬라이드',
            firstSlideMessage: '첫번째 슬라이드',
            lastSlideMessage: '마지막 슬라이드',
        },
        on: {
            init: function () {
                const slides = this.slides;
                const swiper = this;
                const wrapper = this.el;
                [].forEach.call(slides, (el, i) => {
                    const elTarget = options.a11yTarget ? el.querySelector(options.a11yTarget) : el;

                    elTarget.setAttribute('tabindex', 0);
                    EventHandler.on(elTarget, 'focusin', () => {
                        setTimeout(() => {
                            wrapper.scrollLeft = 0;
                            swiper.slideTo(i, 100);
                        }, 0);
                    });
                });

                if (options.init) {
                    options.init.apply(this);
                }
            },
            afterInit: function () {
                if (options.afterInit) {
                    options.afterInit.apply(this);
                }
            },
            ...options.on,
        },
    });
};

const Input = {
    // 에러
    Error: function (props) {
        const ARIA_HIDDEN = 'aria-hidden';
        const input = props.parentElement;
        const label = input.nextElementSibling.classList.contains('error');
        input.classList.add('error');
        if (!label) {
            return;
        }

        const get = input.nextElementSibling.getAttribute(ARIA_HIDDEN);
        if (get === 'true') {
            input.nextElementSibling.setAttribute(ARIA_HIDDEN, false);
        }
    },

    // 에러 클리어
    Clear: function (props) {
        const ARIA_HIDDEN = 'aria-hidden';
        const input = props.parentElement;
        const label = input.nextElementSibling.classList.contains('error');
        input.classList.remove('error');
        if (!label) {
            return;
        }

        const get = input.nextElementSibling.getAttribute(ARIA_HIDDEN);
        if (get === 'false') {
            input.nextElementSibling.setAttribute(ARIA_HIDDEN, true);
        }
    },

    // value 삭제버튼
    ClearButton: function (param) {
        if (!param.previousElementSibling) {
            return;
        }

        if (param.previousElementSibling.tagName === 'INPUT') {
            param.previousElementSibling.value = '';
            param.classList.remove('is-active');

            if (param.previousElementSibling.getAttribute('name') === 'id') {
                const target = document.querySelector('[name="password"]');
                const passwordParent = target.closest('.input-box');
                passwordParent.style.height = '';
                passwordParent.style.marginTop = '0';

                passwordParent.classList.add('expanding');
                passwordParent.classList.remove('expand');
                passwordParent.classList.remove('expanded');
            }
        }
    },

    // InputBox value Checker
    Check: function () {
        const elements = document.querySelectorAll('.input-box');

        const onInput = function (event) {
            const value = event.target.value;
            const length = value.length;
            const nextEl = event.target.nextElementSibling;
            if (!nextEl) {
                return;
            }
            if (length > 0) {
                nextEl.classList.add('is-active');
            } else {
                nextEl.classList.remove('is-active');
            }
        };
        [].forEach.call(elements, item => {
            const target = item.querySelector('.input');
            target.addEventListener('keyup', onInput);
            target.addEventListener('keydown', onInput);
            target.addEventListener('change', onInput);
        });
    },
};

const initialize = () => {
    //INPUT defult
    Input.Check();
    // 툴팁
    UIInitializer('.tooltip-button', Tooltip);

    // 탭
    UIInitializer('[data-ui-tab]', Tab);

    // 드롭다운 셀렉트
    UIInitializer('[data-ui-dropdown]', Dropdown);

    // 아코디언
    UIInitializer('[data-ui-tooltip]', Accordion);
    commonInit.initialize();
    return 'initialized';
};

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
    Tooltip,
    Tab,
    Accordion,
    SwiperA11y,
    a11yChecker,
    Input,
    Dropdown,
};

window.UXW = { ...ui };
