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

const autoScrollContent = () => {
  const lyContainer = document.querySelector('.ly-container');
  const tabs = lyContainer.querySelectorAll('.tab');
  const side = document.querySelector('.side');

  if (!tabs) {
    return;
  } else {
    if (tabs.length > 0 && side) {
      document.body.classList.remove('is-beside');
      Object.assign(lyContainer.style, {
        overflow: 'hidden',
      });
    } else {
      document.body.classList.add('is-beside');
      Object.assign(lyContainer.style, {
        overflow: 'auto',
      });
    }
  }
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

  if (!elements) {
    return;
  }

  let config = {
    target: null,
    nextTarget: null,
  };

  [].forEach.call(navEl, x => {
    const target = x.querySelectorAll('.nav__list .ic-button-nav');
    const toTarget = x.querySelectorAll('.nav__item a');

    config = {
      target: target,
      nextTarget: toTarget,
    };
  });

  const addEvent = function () {
    if (!config.target) {
      return;
    }
    config.target.forEach((item, index) => {
      EventHandler.on(item, 'click', navClickable);
      EventHandler.on(config.nextTarget[index], 'click', navClickable);
    });
  };

  const navClickable = function (event) {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }

    const parentTarget = event.currentTarget.closest('[' + NAV_BOX + ']');
    const attr = parentTarget.getAttribute(NAV_BOX);
    let check = attr;
    check === 'false' ? [parentTarget.setAttribute(NAV_BOX, 'true')] : null;
    // [parentTarget.setAttribute(NAV_BOX, 'false')]
    beforeSelection();
    if (event.target.tagName === 'A') {
      const prevTarget = event.target.closest('.nav__item').querySelector('.ic-button-nav');
      prevTarget.classList.add('is-active');
    } else {
      event.currentTarget.classList.add('is-active');
      defaultSelection();
    }
  };

  const beforeSelection = function () {
    [].forEach.call(config.target, item => {
      item.classList.remove('is-active');
    });
  };

  const defaultSelection = function () {
    const _nav = document.querySelector('[' + NAV_BOX + ']');
    const _tooltipBox = document.querySelector('.tooltip__box');
    if (!_nav) {
      return;
    }

    _tooltipBox.classList.add('is-beactive');

    // const _get = _nav.getAttribute(NAV_BOX);
    // if (_get !== true) {
    //   // _tooltipBox.classList.add('is-beactive');
    // } else {
    // }
  };

  function _init() {
    addEvent();
    // defaultSelection();
  }

  _init();
};

const initFunc = () => {
  navigation('[role="navigation"]');
  cardRefresh();
  autoScrollContent();
};

const initialize = () => {};

const commonInit = {
  initFunc,
  initialize,
};

export default commonInit;
