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

//네비게이션 start --------------------------------------------------------------------------//

//네비게이션 end --------------------------------------------------------------------------//

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
