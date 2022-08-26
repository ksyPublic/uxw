import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject } from '../utils/dom-util';

/**
 * versiton 0.0.1
 *
 */
const NAME = 'ui.dropdown';

const ROLE_LISTBOX = '[role="listbox"]';
const ARIA_HANPOPUP = 'aria-haspopup';
const ARIA_LABELLEBY = 'aria-labelledby';

const dataAttrConfig = {
    activeClass: 'is-active',
    deactiveClass: 'hide',
    time: 1000,
};

const defaultConfig = {
    ...dataAttrConfig,
};

class Dropdown extends UI {
    constructor(element, config = {}) {
        super(element, config);
        this._setupConfog(config);
        this._dropdown = null;
        this._current = {
            target: null,
            content: null,
        };
        this._timer = 0;
    }

    static GLOBAL_CONFIG = {};

    static get EVENT() {
        return {
            SHOW: `${NAME}.show`,
            HIDE: `${NAME}.hide`,
        };
    }

    static get NAME() {
        return NAME;
    }

    _setupConfog(config) {
        this._config = {
            ...defaultConfig,
            ...Dropdown.GLOBAL_CONFIG,
            ...config,
            ...dataSetToObject(this._element, dataAttrConfig, 'dropdown'),
        };
    }

    _addEvent() {
        EventHandler.on(this._element, super._eventName('mouseenter'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }

            const target = event.target;

            if (target) {
                this._current = {
                    target: target,
                    content: this._getContent(),
                };

                this._show();
            }
        });

        EventHandler.on(this._element, super._eventName('mouseleave'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }
            const { content } = this._current;
            this._hide(content);
        });
    }

    _defaultActive() {
        const listBox = this._element.nextElementSibling;
        listBox.classList.add('hide');
    }

    _show() {
        const { activeClass, deactiveClass, time } = this._config;
        const { content } = this._current;

        this._timer = setTimeout(() => {
            this._setPosition();
            content.classList.remove(deactiveClass);
            content.classList.add(activeClass);
        }, time);
    }

    _hide(content) {
        const { activeClass, deactiveClass } = this._config;

        clearTimeout(this._timer);

        content.classList.remove(activeClass);
        content.classList.add(deactiveClass);
    }

    _setPosition() {
        //
    }

    _getContent() {
        const content = this._element.nextElementSibling;

        return content;
    }

    _variolbesUpdate() {
        this._element = this._element.querySelector(`[${ARIA_HANPOPUP}]`);
        this._defaultActive();
    }

    init() {
        this._variolbesUpdate();
        this._addEvent();
    }
}

export default Dropdown;
