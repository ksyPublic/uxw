//babel
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly &&
            (symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            })),
            keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2
            ? ownKeys(Object(source), !0).forEach(function (key) {
                  _defineProperty(target, key, source[key]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
            : ownKeys(Object(source)).forEach(function (key) {
                  Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
              });
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}
//polyfill

//closest
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

//forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

//includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        },
    });
}
/**
 * Object.assign() polyfill for IE11
 * @see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign>
 */
if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true,
    });
}

//GLOBAL -------------------------------------------------------------------------
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

//에러
const Input = {
    //에러
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

    //에러 클리어
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

    //value 삭제버튼
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

    //InputBox value Checker
    InputCheck: function () {
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
        [].forEach.call(elements, function (item) {
            const target = item.querySelector('.input');
            target.addEventListener('keyup', onInput);
            target.addEventListener('keydown', onInput);
            target.addEventListener('change', onInput);
        });
    },
};

//네비게이션 start --------------------------------------------------------------------------//
const navigation = function (UI) {
    const NAV_BOX = 'aria-expanded';
    const elements = document.querySelectorAll(UI);
    const navEl = getObjectElements(elements);

    let _config = {
        target: null,
    };

    [].forEach.call(navEl, function (x) {
        const item = x.querySelectorAll('.nav__list .ic-button-nav');
        _config = {
            target: item,
        };
    });

    const _addEvent = function () {
        _config.target.forEach(function (item) {
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
        [].forEach.call(_config.target, function (item) {
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
//네비게이션 end --------------------------------------------------------------------------//
const getIndex = function (element) {
    if (!element) {
        return -1;
    }
    let currentElement = element;
    let index = 0;
    while (currentElement.previousElementSibling) {
        index += 1;
        currentElement = currentElement.previousElementSibling;
    }
    return index;
};

var swiperA11y = function swiperA11y(el, options) {
    return new window.Swiper(
        el,
        _objectSpread(
            _objectSpread({}, options),
            {},
            {
                threshold: 10,
                // 10px 이상 움직여야 슬라이드 기능작동
                a11y: {
                    nextSlideMessage: '다음 슬라이드',
                    prevSlideMessage: '이전 슬라이드',
                    firstSlideMessage: '첫번째 슬라이드',
                    lastSlideMessage: '마지막 슬라이드',
                },
                on: _objectSpread(
                    {
                        init: function init() {
                            var slides = this.slides;
                            var swiper = this;
                            var wrapper = this.el;
                            [].forEach.call(slides, function (el, i) {
                                var elTarget = options.a11yTarget ? el.querySelector(options.a11yTarget) : el;
                                elTarget.setAttribute('tabindex', 0);
                                elTarget.addEventListener('focusin', function () {
                                    setTimeout(function () {
                                        wrapper.scrollLeft = 0;
                                        swiper.slideTo(i, 100);
                                    }, 0);
                                });
                            });

                            if (options.init) {
                                options.init.apply(this);
                            }
                        },
                        afterInit: function afterInit() {
                            if (options.afterInit) {
                                options.afterInit.apply(this);
                            }
                        },
                    },
                    options.on,
                ),
            },
        ),
    );
};

//탭 start -------------------------------------------------------------------------------//
const Tab = function (element) {
    let defaultProps = {
        eventHandler: 'aria-controls',
        tabName: '[role="tab"]',
        tablistName: '[role="tablist"]',
        tabpanelName: '[role="tabpanel"]',
        tabpanel: null,
        tablist: null,
        tab: null,
        element: element,
        beforeActive: 0,
        activeIndex: 0,
        beforeSelection: {
            tab: null,
            tabpanel: null,
        },
        classes: {
            active: 'is-active',
        },
    };

    this.defaultProps = defaultProps;
};

Tab.prototype.addEvent = function () {
    const _this = this;
    const props = this.defaultProps;

    props.tablist.addEventListener('click', function (event) {
        if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
            event.preventDefault();
        }
        const target = event.target.closest(props.tabName);
        if (target) {
            props.tab = target;
            props.tabpanel = _this._getContent(target);
            _this._active();
        }
    });
};

Tab.prototype.active = function (target) {
    const props = this.defaultProps;
    if (!isNaN(target)) {
        const tablist = props.element.querySelector(props.tablistName);
        const tabs = tablist.querySelectorAll(props.tabName);
        props.tab = tabs[target];
        props.tabpanel = this._getContent(tabs[target]);
    }

    this._active();
};

Tab.prototype._getContent = function (target) {
    const props = this.defaultProps;
    const getID = target.getAttribute(props.eventHandler);
    const content = document.querySelector('#' + getID);
    return content;
};

Tab.prototype._active = function () {
    const props = this.defaultProps;
    this._deactive();
    props.tab.classList.add(props.classes.active);
    props.tabpanel.classList.add(props.classes.active);

    props.activeIndex = getIndex(props.tab);

    props.beforeSelection.tab = props.tab;
    props.beforeSelection.tabpanel = props.tabpanel;
    //웹접근성
    this._aria(props.tab, props.tabpanel, true);
};

Tab.prototype._deactive = function () {
    const props = this.defaultProps;
    const before = props.beforeSelection;
    if (before.tab) {
        before.tab.classList.remove(props.classes.active);
        before.tabpanel.classList.remove(props.classes.active);
    }
    this._aria(before.tab, before.tabpanel, false);
};

Tab.prototype._aria = function (tab, content, isActive) {
    if (!tab || !content) {
        return;
    }
    const isSelected = isActive ? true : false;
    const isHidden = isActive ? false : true;
    const tabIndex = isActive ? 0 : -1;
    tab.setAttribute('tabIndex', tabIndex);
    tab.setAttribute('aria-selected', isSelected);
    content.setAttribute('aria-hidden', isHidden);
};

Tab.prototype.varioblesUpdate = function () {
    const props = this.defaultProps;
    const _tablistName = props.element.querySelector(props.tablistName);
    props.tablist = _tablistName;
};

Tab.prototype.init = function () {
    this.varioblesUpdate();
    this.addEvent();
    this.active(this.defaultProps.beforeActive);
};

//탭 end ---------------------------------------------------------------------------------//

//툴팁 start -----------------------------------------------------------------------------//
const Tooltip = function (element) {
    let defaultProps = {
        tooltiplist: null,
        tooltip: null,
        container: null,
        timer: null,
        element: element,
        offset: [8, 8],
        position: 'xr yc',
        classes: {
            active: 'is-active',
        },
        elementPosition: null,
    };

    this.defaultProps = defaultProps;
};

Tooltip.prototype.addEvent = function () {
    const props = this.defaultProps;
    props.tooltip.addEventListener('mouseenter', this.SHOW(this));
    props.tooltip.addEventListener('mouseleave', this.CLOSE(this));
};

Tooltip.prototype.removeEvent = function () {
    const props = this.defaultProps;
    props.tooltip.removeEventListener('mouseenter', this.SHOW(this));
    props.tooltip.removeEventListener('mouseleave', this.CLOSE(this));
};

Tooltip.prototype._destroy = function () {
    this.removeEvent();
};

Tooltip.prototype.SHOW = function (proto) {
    const props = proto.defaultProps;
    return function () {
        props.timer = setTimeout(function () {
            proto._updatePosition();
        }, 1000);
    };
};

Tooltip.prototype.CLOSE = function (proto) {
    const props = proto.defaultProps;
    return function () {
        clearTimeout(props.timer);
        props.timer = 0;
        props.tooltiplist.classList.remove(props.classes.active);
    };
};

Tooltip.prototype._updatePosition = function () {
    const props = this.defaultProps;

    /**
     * 툴팁 포지션 업데이트
     */
    const positions = props.position.split(' ');
    const positionX = positions[0];
    const positionY = positions[1];
    const resultX = this._getPosition(positionX.toUpperCase());
    const resultY = this._getPosition(positionY.toUpperCase());

    if (props.elementPosition === 'bottom' || props.elementPosition === 'top') {
        props.tooltiplist.style.left = resultX + 'px';
        props.tooltiplist.style.top = resultY - props.offset[1] + 'px';
    } else if (props.elementPosition === 'left' || props.elementPosition === 'right') {
        props.tooltiplist.style.left = resultX + props.offset[0] + 'px';
        props.tooltiplist.style.top = resultY + 'px';
    } else {
        props.tooltiplist.style.left = resultX + 'px';
        props.tooltiplist.style.top = resultY + 'px';
    }

    props.tooltiplist.classList.add(props.classes.active);
};

Tooltip.prototype._getPosition = function (positionName) {
    const props = this.defaultProps;

    /**
     * X 축, Y축 검사하며
     * 툴팁이 짤리는 경우를 검사하여
     * 알맞는 포지션으로 변환하며 반환한다.
     *
     * XR(X축 Right가 화면에 짤리게 될 경우 -> XC로 변경, XC로 짤릴경우 XL로 변경)
     * Y축도 동일 로직으로 처리
     *
     * @param {*} positionName
     * @returns
     */
    const opennerRect = props.element.getBoundingClientRect();
    const stage = this._getCurrentStageInfo();
    const tw = props.tooltiplist.offsetWidth;
    const th = props.tooltiplist.offsetHeight;
    const screenLeft = stage.scrollLeft;
    const screenRight = stage.width + stage.scrollLeft;
    const screenTop = stage.scrollTop;
    const screenBottom = stage.height + stage.scrollTop;
    const opennerWidth = opennerRect.width;
    const opennerHeight = opennerRect.height;
    const opennerLeft = opennerRect.left + window.pageXOffset;
    const opennerTop = opennerRect.top + window.pageYOffset;
    const opennerBottom = opennerTop + opennerHeight;
    const opennerRight = opennerLeft + opennerWidth;
    const opennerXCenter = opennerLeft + opennerWidth / 2;
    const opennerYCenter = opennerTop + opennerHeight / 2;
    let calcPositionValue = 0;
    switch (positionName) {
        // x축 - left
        case 'XL':
            calcPositionValue = opennerLeft - tw;
            if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XC');
            break;
        // x축 - center
        case 'XC':
            calcPositionValue = opennerXCenter - tw / 2;
            if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XR');
            if (calcPositionValue + tw > screenRight) calcPositionValue = this._getPosition('XL');
            break;
        // x축 - right
        case 'XR':
            calcPositionValue = opennerRight;
            if (calcPositionValue + tw > screenRight) calcPositionValue = this._getPosition('XC');
            break;
        // y축 - top
        case 'YT':
            calcPositionValue = opennerTop - th;
            if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YC');
            break;
        // y축 - center
        case 'YC':
            calcPositionValue = opennerYCenter - th / 2;
            if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YB');
            if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YT');
            break;
        // y축 - bottom
        case 'YB':
            calcPositionValue = opennerBottom;
            if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YC');
            break;
    }
    return calcPositionValue;
};

Tooltip.prototype._getCurrentStageInfo = function () {
    const props = this.defaultProps;
    let info = {
        width: 0,
        height: 0,
        scrollLeft: 0,
        scrollTop: 0,
    };
    if (props.container === window) {
        info.width = window.innerWidth;
        info.height = window.innerHeight;
        info.scrollLeft = window.pageXOffset;
        info.scrollTop = window.pageYOffset;
    } else {
        info.width = props.container.offsetWidth;
        info.height = props.container.offsetHeight;
        info.scrollLeft = props.container.scrollLeft;
        info.scrollTop = props.container.scrollTop;
    }
    return info;
};

Tooltip.prototype.varioblesUpdate = function () {
    const props = this.defaultProps;
    let _tooltipTarget = 'aria-describedby';
    props.tooltip = props.element.querySelectorAll('[' + _tooltipTarget + ']')[0];

    const get = props.tooltip.getAttribute(_tooltipTarget);
    props.tooltiplist = document.querySelector('#' + get);
    const position = props.tooltiplist.getAttribute('data-placement');
    props.elementPosition = position;
    if (position) {
        switch (position) {
            case 'bottom':
                props.position = 'xc yt';
                break;
            case 'left':
                props.position = 'xc yc';
                break;
            case 'top':
                props.position = 'xc yb';
                break;
            case 'right':
                props.position = 'xr yc';
                break;

            default:
                'right';
        }
    }

    let appendContainer = props.container === null ? window : props.container;
    if (typeof appendContainer === 'string') {
        appendContainer = document.querySelector(appendContainer);
    }
    props.container = appendContainer;
};

Tooltip.prototype.init = function () {
    this.varioblesUpdate();
    this.addEvent();
};
//툴팁 end -----------------------------------------------------------------------------//

//드롭다운 end -----------------------------------------------------------------------------//
const Dropdown = function () {};
Dropdown.prototype.init = function () {
    this.varioblesUpdate();
    this.addEvent();
};

//드롭다운 end -----------------------------------------------------------------------------//

//common
const UIInitializer = function (target, UI) {
    const elements = document.querySelectorAll(target);
    elements.forEach(function (el) {
        const ui = new UI(el);
        ui.init();
    });
};

const commonFunc = function () {
    navigation('[role="navigation"]');
    Input.InputCheck();
};

function initialize() {
    UIInitializer('[data-ui-tooltip]', Tooltip);
    UIInitializer('[data-ui-tab]', Tab);
    UIInitializer('[data-ui-dropdown]', Dropdown);
    commonFunc();
}

window.UXW = {
    Tooltip: Tooltip,
    Tab: Tab,
    SwiperA11y: swiperA11y,
    Dropdown: Dropdown,
};

document.addEventListener('DOMContentLoaded', function () {
    initialize();
});
