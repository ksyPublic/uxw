import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject, getIndex } from '../utils/dom-util';

const VERSION = '0.0.1';
const NAME = 'ui.accordion';

const ARIA_CONTROLS = 'aria-controls';

const dataAttrConfig = {
    toggle: true,
    activeClass: 'active',
    active: 0,
    contentDisplay: null,
};

const defaultConfig = {
    ...dataAttrConfig,
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

    init() {
        this._initEvents();
        this._current = null;
        this._before = null;
    };



    _initEvents() {
        EventHandler.on(this._element, super._eventName('click'), (event) => {
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
                        this._open()
                    }
                } else {
                    this._open();
                }
            }
        })
    }

    open(target) {
        this._selectCurrent(target);
        this._open();
    }

    _open() {
        const { activeClass } = this._config;
        const { header, content } = this._current;

        header.classList.add(activeClass);
        this._dispatch(Accordion.EVENT.OPEN, {
            current: this._current,
        });
        content.classList.add(activeClass);
        this._before = { header, content };
    }

    close() {
        this._selectCurrent(target);
        this._close();
    }

    _close(target) {
        const { activeClass } = this._config;
        const { header, content } = target;

        header.classList.remove(activeClass);

        this._dispatch(Accordion.EVENT.CLOSE, {
            current: target,
        });
        content.classList.remove(activeClass);
    }

    update() {
        //
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
                const tab = target;
                this._current = {
                    header: tab,
                    content: this._getContent(tab),
                };
            }
        }
    }

    _getContent(target) {
        const get = target.getAttribute(`${ARIA_CONTROLS}`)
        const content = document.querySelector(`#${get}`);
        return content;
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