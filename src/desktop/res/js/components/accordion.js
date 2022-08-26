import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject } from '../utils/dom-util';

/**
 * versiton 0.0.1
 */
const NAME = 'ui.accordion';

const ARIA_CONTROLS = 'aria-controls';

const dataAttrConfig = {
    default: -1,
    defaults: -1,
    toggle: true,
    activeClass: 'is-active',
};

const defaultConfig = {
    ...dataAttrConfig,
    stateClass: {
        expand: 'expand',
        expanding: 'expanding',
        expanded: 'expanded',
    },
};

class Accordion extends UI {
    constructor(element, config = {}) {
        super(element, config);
        this._setupConfog(config);
        this._activeIndex = 0;
        this._accordionlist = null;
        this._current = {
            header: null,
            content: null,
        };
        this._before = {
            header: null,
            content: null,
        };
    }

    static get EVENT() {
        return {
            OPEN: `${NAME}.open`,
            OPENED: `${NAME}.opened`,
            CLOSE: `${NAME}.close`,
            CLOSED: `${NAME}.closed`,
        };
    }

    static get NAME() {
        return NAME;
    }

    static redraw() {
        const insList = Accordion.getInstances();
        if (insList.length > 0) {
            insList.forEach(ins => {
                ins._defaultActive();
            });
        }
    }

    init() {
        this._addEvent();
        this._current = null;
        this._before = null;
        this._defaultActive();
    }

    _defaultActive() {
        if (this._config.default !== -1) {
            this.open(this._config.default);
            return;
        }
        if (this._config.defaults !== -1) {
            const headerIndexList = this._config.defaults.split(',');
            [...headerIndexList].forEach(n => {
                this.open(n);
            });
            return;
        }
        const headers = this._element.querySelectorAll(`[${ARIA_CONTROLS}]`);

        headers.forEach(el => {
            if (el.classList.contains(this._config.activeClass)) {
                this.open(el);
            }
        });
    }

    _addEvent() {
        EventHandler.on(this._element, super._eventName('click'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }
            const { toggle, activeClass } = this._config;
            const target = event.target.closest(`[${ARIA_CONTROLS}]`);
            if (target) {
                this._current = {
                    header: target,
                    content: this._getContent(target),
                };

                if (toggle) {
                    if (this._current.header.classList.contains(activeClass)) {
                        this._close(this._current);
                    } else {
                        this._open();
                    }
                } else {
                    this._open();
                }
            }
        });
    }

    _removeEvents() {
        EventHandler.off(this._element, super._eventName('click'));
    }

    open(target) {
        this._selectCurrent(target);
        this._open();
    }

    _open() {
        const { activeClass, stateClass } = this._config;
        const { header, content } = this._current;
        header.classList.add(activeClass);
        this._dispatch(Accordion.EVENT.OPEN, {
            current: this._current,
        });
        content.classList.add(stateClass.expanding);
        content.classList.remove(stateClass.expand);
        content.style.height = `${content.scrollHeight}px`;
        EventHandler.one(content, 'transitionend', () => {
            content.classList.remove(stateClass.expanding);
            content.classList.add(stateClass.expand);
            content.classList.add(stateClass.expanded);
            content.style.height = '';
            this._dispatch(Accordion.EVENT.OPEND, {
                current: this._current,
            });
        });
        this._before = { header, content };
        this._aria(this._current, true);
    }

    close() {
        this._selectCurrent(target);
        this._close();
    }

    _close(target) {
        const { activeClass, stateClass } = this._config;
        const { header, content } = target;
        this._aria(target, false);
        content.style.height = `${content.getBoundingClientRect().height}px`;
        content.heightCache = content.offsetHeight;
        content.style.height = ``;
        content.classList.add(stateClass.expanding);
        content.classList.remove(stateClass.expand);
        content.classList.remove(stateClass.expanded);
        EventHandler.one(content, 'transitionend', () => {
            content.classList.remove(stateClass.expanding);
            content.classList.add(stateClass.expand);
            this._dispatch(Accordion.EVENT.CLOSED, {
                current: target,
            });
        });
        this._dispatch(Accordion.EVENT.CLOSE, {
            current: target,
        });
        header.classList.remove(activeClass);
    }

    destroy() {
        this._removeEvents();
    }

    _selectCurrent(target) {
        // 인덱스
        if (!isNaN(target)) {
            const accHeaders = this._element.querySelectorAll(`[${ARIA_CONTROLS}]`);
            this._current = {
                header: accHeaders[target],
                content: this._getContent(accHeaders[target]),
            };
        } else {
            // 셀렉터 스트링
            if (typeof target === 'string') {
                const header = this._element.querySelector(target);
                console.log('열루');
                this._current = {
                    header,
                    content: this._getContent(header),
                };
            } else {
                // 엘리먼트
                const content = target;
                this._current = {
                    header: content,
                    content: this._getContent(content),
                };
            }
        }
    }

    _getContent(target) {
        if (!target) super._throwError(`[${target}] not found!`);
        const get = target.getAttribute(`${ARIA_CONTROLS}`);
        const content = document.querySelector(`#${get}`);
        if (!content) {
            super._throwError(`[${contentName}] does not match any content element! `);
        }

        return content;
    }

    /**
     * 웹 접근성 aria 속성 및 tabindex 설정
     * @param {*} target
     * @param {*} isActive
     */
    _aria(target, isActive = true) {
        const { toggle } = this._config;
        const { header, content } = target;
        const isSelected = isActive ? true : false;
        const isHidden = isActive ? false : true;
        header.setAttribute('aria-expanded', isSelected);
        if (toggle === false) {
            header.setAttribute('aria-disabled', isActive);
        }
        content.setAttribute('aria-hidden', isHidden);
    }
    _setupConfog(config) {
        this._config = {
            ...defaultConfig,
            ...Accordion.GLOBAL_CONFIG,
            ...config,
            ...dataSetToObject(this._element, dataAttrConfig, 'accordion'),
        };
    }

    _dispatch(event, params) {
        EventHandler.trigger(this._element, event, params);
    }
}

export default Accordion;
