import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';
import { toHTML, isVisible } from './utils/dom-util';

/* eslint-disable prettier/prettier */

const LAYER_OPEND = 'data-layer-opend';

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
  const ARIA_EXPANDED = 'aria-expanded';
  const ARIA_CONTROLS = 'aria-controls';
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

  const navAria = function (attr, parentTarget) {
    attr === 'false' ? [parentTarget.setAttribute(ARIA_EXPANDED, 'true')] : null;
    return attr;
  };

  const navClickable = function (event) {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }

    const parentTarget = event.currentTarget.closest('[' + ARIA_EXPANDED + ']');
    const attr = parentTarget.getAttribute(ARIA_EXPANDED);

    navAria(attr, parentTarget);
    beforeSelection();
    parentTarget.parentElement.classList.add('is-open');

    const target = event.target.closest(`[${ARIA_CONTROLS}]`) === null ? event.target.previousElementSibling : event.target.closest(`[${ARIA_CONTROLS}]`);
    target.classList.add('is-active');
    defaultSelection();
  };

  const beforeSelection = function () {
    [].forEach.call(config.target, item => {
      item.classList.remove('is-active');
    });

    
  };

  const defaultSelection = function () {
    const _tooltipBox = document.querySelector('.tooltip__box');
    _tooltipBox.classList.add('is-beactive');
  };

  function _init() {
    addEvent();
  }

  _init();
};

const modalLayer = function (UI) {
  const bgTemplate = `
  <div style="
    position: fixed; 
    width: 100%; 
    height: 100%;
    left: 0;
    top: 0;
    z-index:102;
    background-color: rgba(0,0,0,0.6);">
  </div>`;

  const elements = document.querySelectorAll(UI);
  const navEl = getObjectElements(elements);
  const tooltipBox = document.querySelector('.tooltip__box');
  const layers = document.querySelectorAll('.modal--layer');
  const ARIA_CONTROLS = 'aria-controls';
  const ARIA_EXPANDED = 'aria-expanded';
  const LAYER_CLOSE = 'data-layer-close';
  const ZINDEX = {
    CONTENT: 201,
    INCREASE: 1,
    INIT:201,
  };

  const createHtml = toHTML(bgTemplate);

  if (!elements) {
    return;
  }

  let config = {
    target: null,
    nextTarget: null,
    layerContent: null,
    closeButton: null,
  };

  const varioblesUpdate = function () {
    [].forEach.call(navEl, x => {
      const navButton = x.querySelectorAll('.nav__list .ic-button-nav');
      const target = navButton;
      const layerCurrent = navButton;
      const toTarget = x.querySelectorAll('.nav__item a');

      config = {
        target: target,
        nextTarget: toTarget,
        layerContent: layerCurrent,
      };
    });
  };

  const addEvent = function () {
    if (!config.target) {
      return;
    }
    config.target.forEach((item, index) => {
      EventHandler.on(item, 'click', layerClick);
      EventHandler.on(config.nextTarget[index], 'click', layerClick);
    });
  };

  const _removeEvents = function () {
    config.target.forEach((item, index) => {
      EventHandler.off(item, 'click');
      EventHandler.off(config.nextTarget[index], 'click');
    });
  };

  const _zIndexOrderIncrease = function(layerModal) {
    layerModal.style.zIndex = ZINDEX.CONTENT += ZINDEX.INCREASE;
  }

  const layerClick = function (event) {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }

    const target = event.target.closest(`[${ARIA_CONTROLS}]`);

    const getAttr = target === null ? event.target.previousElementSibling.getAttribute(`${ARIA_CONTROLS}`) : target.getAttribute(`${ARIA_CONTROLS}`);
    const layerModal = document.querySelector(`#${getAttr}`);
    if (!layerModal) {
      return;
    }

    config.closeButton = layerModal.querySelector(`[${LAYER_CLOSE}]`);
    EventHandler.one(config.closeButton, 'click', layerClose);
    _show(layerModal);
  };

  const layerClose = function (event) {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }
    const target = event.currentTarget;
    _hide(target);
  };

  const _show = function (layerModal) {
    layers.forEach(modal => {
      if(modal === layerModal) {
        _zIndexOrderIncrease(layerModal);
      } else {
        modal.classList.add('is-deactive');
        modal.classList.remove('is-active');
        modal.setAttribute(`${LAYER_OPEND}`, 'false');
        EventHandler.one(modal, 'animationend', () => {
          modal.classList.remove('is-deactive');
          modal.style.zIndex = ZINDEX.INIT;
        });
      }
    });

    if (layerModal.getAttribute(`${LAYER_OPEND}`) === 'false') {
      createHtml.classList.add('fadeIn');
      document.body.appendChild(createHtml);
      layerModal.classList.add('is-active');
      layerModal.setAttribute(`${LAYER_OPEND}`, 'true');

      EventHandler.one(layerModal, 'animationend', () => {
        layerModal.classList.remove('is-deactive');
      });
    }
  };

  const _hide = function (target) {
    const modal = target.closest('.modal');
    if (modal.getAttribute(`${LAYER_OPEND}`) === 'true') {
      createHtml.classList.remove('fadeOut');
      document.body.removeChild(createHtml);
      modal.classList.add('is-deactive');
      modal.setAttribute(`${LAYER_OPEND}`, 'false');

      EventHandler.one(modal, 'animationend', () => {
        modal.classList.remove('is-active');
        modal.classList.remove('is-deactive');
      });
    }
    _allClose();
  };

  const _allClose = function () {
    elements[0].classList.remove('is-open');
    elements[0].querySelector(`[${ARIA_EXPANDED}]`).setAttribute(`${ARIA_EXPANDED}`, false);
    tooltipBox.classList.remove('is-beactive');
    config.target.forEach(item => {
      item.classList.remove('is-active');
    });
  };

  function _init() {
    varioblesUpdate();
    addEvent();
  }

  _init();
};

const initFunc = () => {
  navigation('[role="navigation"]');
  modalLayer('[role="navigation"]');
  cardRefresh();
  autoScrollContent();
};

const initialize = () => {};

const commonInit = {
  initFunc,
  initialize,
};

export default commonInit;
