import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject, getElement } from '../utils/dom-util';

/**
 * versiton 0.0.1
 *
 */
const NAME = 'ui.dropdown';

const ROLE_OPTIONS = '[role="option"]';
const ARIA_HANPOPUP = 'aria-haspopup';
const ARIA_LABELLEBY = 'aria-labelledby';
const DATA_LISTBOX_VALUE = 'data-listbox-value';
const DATA_BUTTON_VALUE = 'data-button-value';

const dataAttrConfig = {
    activeClass: 'is-active',
    activedClass: 'is-shown',
    time: 300,
    copyed: null,
};

const defaultConfig = {
    ...dataAttrConfig,
};

class Dropdown extends UI {
    constructor(element, config = {}) {
        super(element, config);
        this._setupConfog(config);
        this._dropdown = null;
        this._options = null;
        this._beforeData = null;
        this._currentData = null;
        this._menu = null;
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
            OPTIONS_CLICK: `${NAME}.click`,
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
            this._menu = event.target.nextElementSibling;
            if (target) {
                this._current = {
                    target: target,
                    content: this._getContent(target),
                };
                target.setAttribute(`${DATA_BUTTON_VALUE}`, target.textContent);
                EventHandler.trigger(this._element, Dropdown.EVENT.SHOW, {
                    current: this._current,
                });

                this._options = this._current.content.querySelectorAll(`${ROLE_OPTIONS}`);

                [].forEach.call(this._options, item => {
                    item.setAttribute(`${DATA_LISTBOX_VALUE}`, item.textContent);
                    this._beforeData = this._options[0].getAttribute(`${DATA_LISTBOX_VALUE}`);
                    EventHandler.on(item, super._eventName('click'), this._clickItem.bind(this));
                    EventHandler.trigger(this._element, Dropdown.EVENT.OPTIONS_CLICK, {
                        options: this,
                    });
                });

                this.show();
            }
        });

        EventHandler.on(this._element.closest('.dropdown'), super._eventName('mouseleave'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }

            const { content } = this._current;

            EventHandler.trigger(this._element, Dropdown.EVENT.CLOSE, {
                current: this._current,
            });
            this.hide(content);
        });
    }

    _destroy() {
        this._removeEvent();
    }

    _removeEvent() {
        EventHandler.off(this._element, super._eventName('mouseenter'));
        EventHandler.off(this._element, super._eventName('mouseleave'));
    }

    show() {
        this._show();
    }

    hide(content) {
        this._hide(content);
    }

    _clickItem(event) {
        if (event.target.getAttribute('role') !== 'option') {
            return;
        }
        this._currentData = event.target.getAttribute(`${DATA_LISTBOX_VALUE}`);
        this._focusItem(event.target);
    }

    _focusItem(element) {
        this._options.forEach(noEl => {
            noEl.setAttribute('aria-selected', 'false');
        });
        element.setAttribute('aria-selected', 'true');
        this.changeNodes(element);
    }
    _getValue(element) {
        return element.getAttribute(`${DATA_LIST_VALUE}`);
    }

    changeNodes(element) {
        this._element.textContent = this._currentData;
        this._element.setAttribute(`${DATA_BUTTON_VALUE}`, this._currentData);

        this._firstItems(element).textContent = element.textContent;
        this._firstItems(element).setAttribute(`${DATA_LISTBOX_VALUE}`, this._currentData);
        this._currentData = element.getAttribute(`${DATA_LISTBOX_VALUE}`);

        element.textContent = this._beforeData;
        element.setAttribute(`${DATA_LISTBOX_VALUE}`, this._beforeData);
        this._beforeData = this._firstItems(element).getAttribute(`${DATA_LISTBOX_VALUE}`);
    }

    _firstItems(element) {
        const firstItems = element.closest('.dropdown').querySelectorAll(`${ROLE_OPTIONS}`)[0];
        return firstItems;
    }

    _show() {
        const { activeClass, activedClass, time } = this._config;
        const { content } = this._current;
        this._dropdown = content.closest('.dropdown');
        this._timer = setTimeout(() => {
            content.classList.add(activeClass);
            this._dropdown.classList.add(activedClass);
        }, time);
    }

    _hide(content) {
        if (!content) {
            return;
        }
        this._completeHide(content);
    }

    _completeHide(content) {
        const { target } = this._current;
        const { activeClass, activedClass } = this._config;

        clearTimeout(this._timer);
        target.parentElement.classList.remove(activedClass);
        content.classList.remove(activeClass);
    }

    _getContent() {
        const content = this._element.nextElementSibling;
        return content;
    }

    _variolbesUpdate() {
        this._element = this._element.querySelector(`[${ARIA_HANPOPUP}]`);
    }

    init() {
        this._variolbesUpdate();
        this._addEvent();
    }
}

export default Dropdown;
