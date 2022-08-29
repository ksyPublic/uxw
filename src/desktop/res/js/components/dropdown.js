import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject } from '../utils/dom-util';

/**
 * versiton 0.0.1
 *
 */
const NAME = 'ui.dropdown';

const ROLE_OPTIONS = '[role="option"]';
const ROLE_LISTBOX = '[role="listbox"]';
const ARIA_HANPOPUP = 'aria-haspopup';
const ARIA_LABELLEBY = 'aria-labelledby';
const DATA_LISTBOX_VALUE = 'data-listbox-value';
const DATA_BUTTON_VALUE = 'data-button-value';

const dataAttrConfig = {
    activeClass: 'is-active',
    activedClass: 'is-shown',
    time: 100,
    toggle: true,
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
        this._labeled = null;
        this._menu = null;
        this._current = {
            target: null,
            content: null,
            lebel: null,
        };
        this._offsetPos = null;
        this._parentElement = null;
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
        EventHandler.on(this._element, super._eventName('click'), event => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }
            const { toggle, activeClass } = this._config;
            const target = event.target.closest(`[${ARIA_HANPOPUP}]`);
            if (target) {
                this._before();

                const hanpopup = this._element.getAttribute(`${ARIA_HANPOPUP}`);
                const dropmenu = target.closest('.dropdown').querySelector(`[role="${hanpopup}"]`);
                const desc = dropmenu.getAttribute(`${ARIA_LABELLEBY}`);
                const datalabel = document.querySelector(`#${desc}`);
                this._offsetPos = this._parentElement.getBoundingClientRect();

                this._current = {
                    target: target,
                    content: dropmenu,
                    label: datalabel,
                };

                if (toggle) {
                    if (this._current.target.classList.contains(activeClass)) {
                        this._hide();
                    } else {
                        this._show();
                    }
                } else {
                    this._show();
                }

                EventHandler.trigger(this._element, Dropdown.EVENT.SHOW, {
                    current: this._current,
                });
            }
        });

        this._options.forEach(item => {
            item.setAttribute(`${DATA_LISTBOX_VALUE}`, item.textContent);
            this._beforeData = this._options[0].getAttribute(`${DATA_LISTBOX_VALUE}`);
            EventHandler.on(item, super._eventName('click'), this._clickItem.bind(this));

            EventHandler.trigger(this._element, Dropdown.EVENT.OPTIONS_CLICK, {
                options: this,
            });
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

    hide() {
        this._hide();
    }

    _before() {
        const { activeClass, activedClass } = this._config;
        const reusltAll = NAME.replace('ui', '');
        const allItems = document.querySelectorAll(reusltAll);
        allItems.forEach(items => {
            items.classList.remove(activedClass);
            const _listbox = items.querySelector(`${ROLE_LISTBOX}`);
            const _menu = items.querySelector(`[${ARIA_HANPOPUP}]`);

            _listbox.classList.remove(activeClass);
            _menu.classList.remove(activeClass);
        });
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
        this._changeNodes(element);
    }

    _changeNodes(element) {
        const { label } = this._current;

        label.textContent = this._currentData;
        label.setAttribute(`${DATA_BUTTON_VALUE}`, this._currentData);

        this._firstItems(element).textContent = element.textContent;
        this._firstItems(element).setAttribute(`${DATA_LISTBOX_VALUE}`, this._currentData);
        this._currentData = element.getAttribute(`${DATA_LISTBOX_VALUE}`);

        element.textContent = this._beforeData;
        element.setAttribute(`${DATA_LISTBOX_VALUE}`, this._beforeData);
        this._beforeData = this._firstItems(element).getAttribute(`${DATA_LISTBOX_VALUE}`);

        this._hide();
    }

    _firstItems() {
        const firstItems = this._parentElement.querySelectorAll(`${ROLE_OPTIONS}`)[0];
        return firstItems;
    }

    _show() {
        const { activeClass, activedClass, time } = this._config;
        const { content, target } = this._current;

        target.classList.add(activeClass);

        this._timer = setTimeout(() => {
            content.classList.add(activeClass);
            this._parentElement.classList.add(activedClass);
        }, time);
    }

    _hide() {
        const { target } = this._current;
        const { activeClass } = this._config;

        target.classList.remove(activeClass);
        this._completeHide();
    }

    _completeHide() {
        const { target, content } = this._current;
        const { activeClass, activedClass } = this._config;

        clearTimeout(this._timer);
        target.parentElement.classList.remove(activedClass);
        content.classList.remove(activeClass);

        //이벤트 초기화
        // if (this._options) {
        //     this._options.forEach(item => {
        //         item.setAttribute(`${DATA_LISTBOX_VALUE}`, '');
        //         this._beforeData = '';
        //         EventHandler.off(item, super._eventName('click'));
        //     });
        // }
    }

    _variolbesUpdate() {
        this._element = this._element.querySelector(`[${ARIA_HANPOPUP}]`);
        this._parentElement = this._element.closest('.dropdown');
        this._options = this._parentElement.querySelectorAll(`${ROLE_OPTIONS}`);
    }

    init() {
        this._variolbesUpdate();
        this._addEvent();
    }
}

EventHandler.on(document, 'click', event => {
    if (event.target.closest('.dropdown') === null) {
        const drops = document.querySelectorAll('.dropdown');
        drops.forEach(x => {
            x.querySelector('button').classList.remove('is-active');
            x.querySelector('.dropdown__menu').classList.remove('is-active');
        });
    }
});

export default Dropdown;
