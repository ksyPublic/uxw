/* eslint-disable prettier/prettier */
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
    check: function () {
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
            item.addEventListener('click', navClickable);
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
    Input.check();
};

const initialize = () => {};

const commonInit = {
    initFunc,
    initialize,
    Input,
};

export default commonInit;
