import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject, getIndex } from '../utils/dom-util';

const VERSION = '0.0.1';
const NAME = 'ui.tab';

const ROLE_TAB_LIST = '[role="tablist"]';
const ROLE_TAB = '[role="tab"]';
const ARIA_CONTROLS = 'aria-controls';

const dataAttrConfig = {
    activeClass: 'active',
    active: 0,
    contentDisplay: null,
    direction: 'horizontal',
};

const defaultConfig = {
    ...dataAttrConfig,
    delegate: {
        selectFilter: (els, el, className) => {
            return els[0].closest(className) === el.closest(className);
        },
    },
};

class Tab extends UI {
    constructor(element, config = {}) {
        super(element, config);
        this._setupConfog(config);
        this._activeIndex = 0;
        this._tablist = null;
        this._current = {
            tab: null,
            content: null,
        };
        this._before = {
            tab: null,
            content: null,
        };
    }

    static GLOBAL_CONFIG = {};

    static get EVENT() {
        return {
            CHANGE: `${NAME}.change`,
        };
    }

    static get NAME() {
        return NAME;
    }

    init() {
        this._initVars();
        this._initEvents();
        this.active(this._config.active);
    }

    get activeIndex() {
        return this._activeIndex;
    }

    /**
     * Tab Show
     * @param {number|string|object} target
     */
    active(target) {
        // 인덱스
        if (!isNaN(target)) {
            const tablist = this._element.querySelector(ROLE_TAB_LIST);
            const tabs = tablist.querySelectorAll(ROLE_TAB);
            this._current = {
                tab: tabs[target],
                content: this._getContent(tabs[target]),
            };
        } else {
            // 셀렉터 스트링
            if (typeof target === 'string') {
                const tab = document.querySelector(target);
                this._current = {
                    tab: tab,
                    content: this._getContent(tab),
                };
            } else {
                // 엘리먼트
                const tab = target.jquery ? target[0] : target;
                this._current = {
                    tab: tab,
                    content: this._getContent(tab),
                };
            }
        }
        this._active();
    }

    destroy() {
        this._removeEvents();
        this._removeVars();
    }

    _setupConfog(config) {
        this._config = {
            ...defaultConfig,
            ...Tab.GLOBAL_CONFIG,
            ...config,
            ...dataSetToObject(this._element, dataAttrConfig, 'tab'),
        };
    }

    _initVars() {
        this._tablist = this._element.querySelector(ROLE_TAB_LIST);
    }

    _initEvents() {
        // 클릭 이벤트
        EventHandler.on(this._tablist, super._eventName('click'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }
            const target = event.target.closest(ROLE_TAB);
            if (target) {
                this._current = {
                    tab: target,
                    content: this._getContent(target),
                };
                this._active();
            }
        });

        // 키보드 방향키 이벤트 바인딩
        EventHandler.on(this._tablist, super._eventName('keydown'), event => {
            const { direction } = this._config;
            switch (event.key) {
                case 'ArrowUp':
                case 'Up': {
                    if (direction === 'vertical') {
                        event.preventDefault();
                        this._prev();
                    }
                    break;
                }
                case 'ArrowDown':
                case 'Down': {
                    if (direction === 'vertical') {
                        event.preventDefault();
                        this._next();
                    }
                    break;
                }
                case 'ArrowRight':
                case 'Right': {
                    if (direction === 'horizontal') {
                        event.preventDefault();
                        this._next();
                    }
                    break;
                }
                case 'ArrowLeft':
                case 'Left': {
                    if (direction === 'horizontal') {
                        event.preventDefault();
                        this._prev();
                    }
                    break;
                }
                default: {
                    // ...
                }
            }
            this.active(this._activeIndex);
            this._current.tab.focus();
        });
    }

    _removeEvents() {
        EventHandler.off(this._tablist, super._eventName('click'));
        EventHandler.off(this._tablist, super._eventName('keydown'));
    }

    _removeVars() {
        this._tablist = null;
        this._active = null;
        this._before = null;
        this._active = -1;
    }

    /**
     * 다음 탭 활성화
     */
    _next() {
        this._activeIndex++;
        if (this._activeIndex >= this._getTotal()) {
            this._activeIndex = 0;
        }
    }

    /**
     * 이전 탭 활성화
     */
    _prev() {
        this._activeIndex--;
        if (this._activeIndex < 0) {
            this._activeIndex = this._getTotal() - 1;
        }
    }

    /**
     * 탭 활성화
     */
    _active() {
        const { activeClass, contentDisplay } = this._config;
        const { tab, content } = this._current;
        this._deactive();
        tab.classList.add(activeClass);
        if (contentDisplay) {
            content.classList.add(contentDisplay);
        } else {
            content.style.display = 'block';
        }
        this._activeIndex = getIndex(tab);

        EventHandler.trigger(this._element, Tab.EVENT.CHANGE, {
            current: this._current,
            before: this._before,
        });

        this._before = { tab, content };
        this._aria(this._current);
    }

    /**
     * 이전 탭 비활성화
     */
    _deactive() {
        const { activeClass, contentDisplay } = this._config;
        const { tab, content } = this._before;
        if (tab) {
            tab.classList.remove(activeClass);
            if (contentDisplay) {
                content.classList.remove(contentDisplay);
            } else {
                content.style.display = 'none';
            }
            this._aria(this._before, false);
        }
    }

    /**
     * 웹 접근성 aria 속성 및 tabindex 설정
     * @param {*} target
     * @param {*} isActive
     */
    _aria(target, isActive = true) {
        const { tab, content } = target;
        const isSelected = isActive ? true : false;
        const isHidden = isActive ? false : true;
        const tabIndex = isActive ? 0 : -1;
        tab.setAttribute('tabIndex', tabIndex);
        tab.setAttribute('aria-selected', isSelected);
        content.setAttribute('aria-hidden', isHidden);
        // content.setAttribute('tabIndex', tabIndex);
    }

    /**
     * tab header(aria-controls)에 선언 된 컨텐츠 찾아서 반환
     * @param {*} target
     * @returns
     */
    _getContent(target) {
        if (!target) super._throwError(`[${target}] not found!`);
        const contentName = target.getAttribute(ARIA_CONTROLS);
        const content = document.querySelector(`#${contentName}`);
        if (!content) {
            super._throwError(`[${contentName}] does not match any content element! `);
        }

        return content;
    }

    /**
     * 지금 현재 탭의 갯수 반환
     * @returns
     */
    _getTotal() {
        const tabs = this._tablist.querySelectorAll(ROLE_TAB);
        return tabs.length;
    }
}

export default Tab;
// const Tab = function (element) {
//     let defaultProps = {
//         eventHandler: 'aria-controls',
//         tabName: '[role="tab"]',
//         tablistName: '[role="tablist"]',
//         tabpanelName: '[role="tabpanel"]',
//         tabpanel: null,
//         tablist: null,
//         tab: null,
//         element: element,
//         beforeActive: 0,
//         activeIndex: 0,
//         beforeSelection: {
//             tab: null,
//             tabpanel: null,
//         },
//         classes: {
//             active: 'is-active',
//         },
//     };

//     this.defaultProps = defaultProps;
// };

// Tab.prototype.addEvent = function () {
//     const _this = this;
//     const props = this.defaultProps;

//     props.tablist.addEventListener('click', function (event) {
//         if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
//             event.preventDefault();
//         }
//         const target = event.target.closest(props.tabName);
//         if (target) {
//             props.tab = target;
//             props.tabpanel = _this._getContent(target);
//             _this._active();
//         }
//     });
// };

// Tab.prototype.active = function (target) {
//     const props = this.defaultProps;
//     if (!isNaN(target)) {
//         const tablist = props.element.querySelector(props.tablistName);
//         const tabs = tablist.querySelectorAll(props.tabName);
//         props.tab = tabs[target];
//         props.tabpanel = this._getContent(tabs[target]);
//     }

//     this._active();
// };

// Tab.prototype._getContent = function (target) {
//     const props = this.defaultProps;
//     const getID = target.getAttribute(props.eventHandler);
//     const content = document.querySelector('#' + getID);
//     return content;
// };

// Tab.prototype._active = function () {
//     const props = this.defaultProps;
//     this._deactive();
//     props.tab.classList.add(props.classes.active);
//     props.tabpanel.classList.add(props.classes.active);

//     props.activeIndex = getIndex(props.tab);

//     props.beforeSelection.tab = props.tab;
//     props.beforeSelection.tabpanel = props.tabpanel;
//     //웹접근성
//     this._aria(props.tab, props.tabpanel, true);
// };

// Tab.prototype._deactive = function () {
//     const props = this.defaultProps;
//     const before = props.beforeSelection;
//     if (before.tab) {
//         before.tab.classList.remove(props.classes.active);
//         before.tabpanel.classList.remove(props.classes.active);
//     }
//     this._aria(before.tab, before.tabpanel, false);
// };

// Tab.prototype._aria = function (tab, content, isActive) {
//     if (!tab || !content) {
//         return;
//     }
//     const isSelected = isActive ? true : false;
//     const isHidden = isActive ? false : true;
//     const tabIndex = isActive ? 0 : -1;
//     tab.setAttribute('tabIndex', tabIndex);
//     tab.setAttribute('aria-selected', isSelected);
//     content.setAttribute('aria-hidden', isHidden);
// };

// Tab.prototype.varioblesUpdate = function () {
//     const props = this.defaultProps;
//     const _tablistName = props.element.querySelector(props.tablistName);
//     props.tablist = _tablistName;
// };

// Tab.prototype.init = function () {
//     this.varioblesUpdate();
//     this.addEvent();
//     this.active(this.defaultProps.beforeActive);
// };
