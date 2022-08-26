import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';

/* eslint-disable prettier/prettier */

const getObjectElements = function (elements) {
    let arr = [];
    for (let key in elements) {
        if (Object.prototype.hasOwnProperty.call(elements, key)) {
            const attrvalue = elements[key];
            arr[key] = attrvalue;
        }
    }
    return arr;
};

const cardRefresh = () => {
    const card = 'data-card';
    const ARIA_PRESSED = 'aria-pressed';
    const elements = document.querySelectorAll('[' + card + ']');

    if (elements.legnth === 0) {
        return;
    }

    elements.forEach(item => {
        const isCard = item.getAttribute(card);
        const refresh = item.querySelector('.ic-button-refresh');

        EventHandler.on(refresh, 'click', event => {
            if (isCard) {
                event.currentTarget.setAttribute(ARIA_PRESSED, false);
                _before(item);
            } else {
                return;
            }
        });
    });

    const _before = target => {
        target.setAttribute(card, false);
    };
};

const navigation = function (UI) {
    const NAV_BOX = 'aria-expanded';
    const elements = document.querySelectorAll(UI);
    const navEl = getObjectElements(elements);

    let _config = {
        target: null,
    };

    [].forEach.call(navEl, x => {
        const item = x.querySelectorAll('.nav__list .ic-button-nav');
        _config = {
            target: item,
        };
    });

    const _addEvent = function () {
        _config.target.forEach(item => {
            EventHandler.on(item, 'click', navClickable);
        });
    };

    const navClickable = function (event) {
        if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
            event.preventDefault();
        }
        const parentTarget = event.currentTarget.closest('[' + NAV_BOX + ']');
        const attr = parentTarget.getAttribute(NAV_BOX);
        let check = attr;
        // check === "true" ? [parentTarget.setAttribute(NAV_BOX, "false")] : [parentTarget.setAttribute(NAV_BOX, "true")];
        beforeSelection();
        event.currentTarget.classList.add('is-active');
    };

    const beforeSelection = function () {
        [].forEach.call(_config.target, item => {
            item.classList.remove('is-active');
        });
    };

    function _init() {
        _addEvent();
        const _nav = document.querySelector('[' + NAV_BOX + ']');
        const _get = _nav.getAttribute(NAV_BOX);
        if (_get === 'true') {
            window.UXW.Tooltip._destroy;
        } else {
            window.UXW.Tooltip.addEvent;
        }
    }

    _init();
};

const initFunc = () => {
    navigation('[role="navigation"]');
    cardRefresh();
};

const initialize = () => {};

const commonInit = {
    initFunc,
    initialize,
};

export default commonInit;