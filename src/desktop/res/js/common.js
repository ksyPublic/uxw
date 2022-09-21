import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';
import { toHTML } from './utils/dom-util';

/* eslint-disable prettier/prettier */

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

const createHtml = toHTML(bgTemplate);
const LAYER_OPEND = 'data-layer-opend';

const getObjectElements = elements => {
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
  const tabs = lyContainer?.querySelectorAll('.tab');
  const side = document?.querySelector('.side');

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

const navigation = (UI, options) => {
  const ARIA_EXPANDED = 'aria-expanded';
  const ARIA_CONTROLS = 'aria-controls';
  const DEFAULT_ACTIVE = 'data-navigation-defaultActive';
  const elements = document.querySelectorAll(UI);
  const navEl = getObjectElements(elements);

  if (!elements) {
    return;
  }

  let config = {
    target: null,
    nextTarget: null,
    active: options ? options : null,
  };

  [].forEach.call(navEl, x => {
    const target = x.querySelectorAll('.nav__list .ic-button-nav');
    const toTarget = x.querySelectorAll('.nav__item a');
    const defaultActive = x.querySelector(`[${ARIA_EXPANDED}]`).getAttribute(`${DEFAULT_ACTIVE}`);
    config = {
      target: target,
      nextTarget: toTarget,
      active: options ? options : defaultActive,
    };
  });

  const addEvent = () => {
    if (!config.target) {
      return;
    }
    config.target.forEach((item, index) => {
      EventHandler.on(item, 'click', navClickable);
      EventHandler.on(config.nextTarget[index], 'click', navClickable);
    });
  };

  const navClickable = event => {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }
    _aria();
    beforeSelection();
    const target = event.target.closest(`[${ARIA_CONTROLS}]`) === null ? event.target.previousElementSibling : event.target.closest(`[${ARIA_CONTROLS}]`);
    target.classList.add('is-active');
    tooltipInit();
  };

  const beforeSelection = () => {
    [].forEach.call(config.target, item => {
      item.classList.remove('is-active');
    });
  };

  const tooltipInit = () => {
    const _tooltipBox = document.querySelector('.tooltip__box');
    _tooltipBox.classList.add('is-beactive');
  };

  const defaultSelection = () => {
    //DEFAULT_ACTIVE가 있을시 오픈
    const modals = document.querySelectorAll('.modal--layer');
    if (modals.length === 0) {
      return;
    }

    modals.forEach(m => {
      if (m.id === config.target[config.active]?.getAttribute(`${ARIA_CONTROLS}`)) {
        config.target[config.active].classList.add('is-active');
        modals[0].classList.add('is-active');
        modals[0].setAttribute(`${LAYER_OPEND}`, 'true');
        // createHtml.classList.add('fadeIn');
        document.body.appendChild(createHtml);
        _aria();
      } 
    });
  };

  const _aria = () => {
    const navExpaned = elements[0].querySelector(`[${ARIA_EXPANDED}]`);
    const getExpaned = navExpaned.getAttribute(ARIA_EXPANDED);
    getExpaned === 'false' ? [navExpaned.setAttribute(ARIA_EXPANDED, 'true')] : null;
    elements[0].classList.add('is-open');
  };

  function _init() {
    addEvent();
    defaultSelection();
  }

  _init();
};

const modalLayer = UI => {
  // 220921 수정
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
    INIT: 201,
  };

  if (!elements) {
    return;
  }

  let config = {
    target: null,
    nextTarget: null,
    layerContent: null,
    closeButton: null,
  };

  const varioblesUpdate = () => {
    [].forEach.call(navEl, x => {
      const navButton = x.querySelectorAll('.nav__list .ic-button-nav');
      const target = navButton;
      const layerCurrent = navButton;
      const toTarget = x.querySelectorAll('.nav__item a');
      const closebtn = document.querySelectorAll(`[${LAYER_CLOSE}]`);

      config = {
        target: target,
        nextTarget: toTarget,
        layerContent: layerCurrent,
        closeButton: closebtn,
      };
    });
  };

  const addEvent = () => {
    if (!config.target) {
      return;
    }
    config.target.forEach((item, index) => {
      EventHandler.on(item, 'click', layerClick);
      EventHandler.on(config.nextTarget[index], 'click', layerClick);
    });

    config.closeButton.forEach(item => {
      EventHandler.on(item, 'click', layerClose);
    });
  };

  const _removeEvents = () => {
    config.target.forEach((item, index) => {
      EventHandler.off(item, 'click');
      EventHandler.off(config.nextTarget[index], 'click');
    });
  };

  const _zIndexOrderIncrease = layerModal => {
    layerModal.style.zIndex = ZINDEX.CONTENT;
    navEl[0].style.zIndex = ZINDEX.CONTENT + 1;
  };

  const layerClick = event => {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }

    const target = event.target.closest(`[${ARIA_CONTROLS}]`);

    const getAttr = target === null ? event.target.previousElementSibling.getAttribute(`${ARIA_CONTROLS}`) : target.getAttribute(`${ARIA_CONTROLS}`);
    const layerModal = document.querySelector(`#${getAttr}`);
    if (!layerModal) {
      return;
    }

    _show(layerModal);
  };

  const layerClose = event => {
    if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
      event.preventDefault();
    }
    const target = event.currentTarget;
    _hide(target);
  };

  const _show = layerModal => {
    layers.forEach(modal => {
      if (modal === layerModal) {
        _zIndexOrderIncrease(layerModal);
      } else {
        // modal.classList.add('is-deactive');
        modal.classList.remove('is-active2');
        modal.setAttribute(`${LAYER_OPEND}`, 'false');
        EventHandler.one(modal, 'animationend', () => {
          modal.classList.remove('is-deactive2');
          modal.style.zIndex = ZINDEX.INIT;
        });
      }
    });

    if (layerModal.getAttribute(`${LAYER_OPEND}`) === 'false') {
      // createHtml.classList.add('fadeIn');
      document.body.appendChild(createHtml);
      layerModal.classList.add('is-active2');
      layerModal.setAttribute(`${LAYER_OPEND}`, 'true');

      EventHandler.one(layerModal, 'animationend', () => {
        layerModal.classList.remove('is-deactive2');
      });
    }
  };

  const _hide = target => {
    const modal = target.closest('.modal');
    if (modal.getAttribute(`${LAYER_OPEND}`) === 'true') {
      // createHtml.classList.remove('fadeOut');
      document.body.removeChild(createHtml);
      modal.classList.add('is-deactive2');
      modal.setAttribute(`${LAYER_OPEND}`, 'false');

      EventHandler.one(modal, 'animationend', () => {
        modal.classList.remove('is-active2');
        modal.classList.remove('is-deactive2');
      });
    }
    _allClose();
  };

  const _allClose = () => {
    elements[0].classList.remove('is-open');
    elements[0].querySelector(`[${ARIA_EXPANDED}]`).setAttribute(`${ARIA_EXPANDED}`, false);
    tooltipBox.classList.remove('is-beactive');
    config.target.forEach(item => {
      item.classList.remove('is-active');
    });
  };

  const _init = () => {
    varioblesUpdate();
    addEvent();
  };

  _init();
};

/* 모달에 스크롤이 있을경우 */
const modalScrollContent = () => {
  const el = document.querySelectorAll('.modal--layer__bescroll .tab--scroll .tab__inner');
  const floating = document.querySelectorAll('.modal--layer__bescroll .tab--scroll .floating-menu-wrap--type2 .accordion--type3');
  const modalScroll = event => {
      if(event.target.scrollTop > 96) {
          [].forEach.call(floating, function(item) {
              item.classList.add('is-fixed');
          });
      } else {
          [].forEach.call(floating, function(item) {
              item.classList.remove('is-fixed');
          });
      }
  };

  const tabEl = document.querySelector('.modal--layer__bescroll .tab')
  tabEl.addEventListener(UXW.Tab.EVENT.CHANGE, function (event) {
      var currentTab = event.current;
      var beforeTab = event.before;
      //변경전 페이지적용
      if(currentTab.content) {
        const acc = currentTab.content.querySelector('.modal--layer__bescroll .tab--scroll .tab__inner')
        const _floating = acc.querySelector('.floating-menu-wrap--type2 .accordion--type3');
        if(acc.scrollTop > 0) {
          _floating.classList.add('is-fixed');
        } else {
          _floating.classList.remove('is-fixed');
        }
      }

  });
  
  [].forEach.call(el, function(item) {
      item.addEventListener('scroll', modalScroll)
  })
};
/* 모달에 스크롤이 있을경우 */

const initFunc = () => {};

const initialize = () => {
  navigation('[role="navigation"]');
  modalLayer('[role="navigation"]');
  modalScrollContent();
  cardRefresh();
  autoScrollContent();
};

const commonInit = {
  initFunc,
  initialize,
};

export default commonInit;
