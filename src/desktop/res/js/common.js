import 'element-closest-polyfill';
import EventHandler from './vendor/EventHandler';
import { toHTML } from './utils/dom-util';
import Scrollbar from 'smooth-scrollbar';
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
        modals[0].classList.add('is-active2');
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
  let dimmer = false;
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
        modal.classList.remove('is-active');
        modal.setAttribute(`${LAYER_OPEND}`, 'false');
        EventHandler.one(modal, 'animationend', () => {
          modal.classList.remove('is-deactive');
          modal.style.zIndex = ZINDEX.INIT;
        });
      }
    });

    if (layerModal.getAttribute(`${LAYER_OPEND}`) === 'false') {
      // createHtml.classList.add('fadeIn');
      if (!dimmer) {
        document.body.appendChild(createHtml);
        dimmer = true;
      }
      layerModal.classList.add('is-active');
      layerModal.setAttribute(`${LAYER_OPEND}`, 'true');

      EventHandler.one(layerModal, 'animationend', () => {
        layerModal.classList.remove('is-deactive');
      });
    }
  };

  const _hide = target => {
    const modal = target.closest('.modal');
    if (modal.getAttribute(`${LAYER_OPEND}`) === 'true') {
      // createHtml.classList.remove('fadeOut');
      document.body.removeChild(createHtml);
      modal.classList.remove('is-active2');
      modal.classList.remove('is-active');
      modal.setAttribute(`${LAYER_OPEND}`, 'false');
      dimmer = false;

      // EventHandler.one(modal, 'animationend', () => {
      //   modal.classList.remove('is-active2');
      //   modal.classList.remove('is-deactive2');
      // });
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
  const bescroll = 'modal--layer__bescroll';
  const el = document.querySelectorAll(`.${bescroll} .tab--scroll .tab__inner`);
  const tabEl = document.querySelector(`.${bescroll} .tab`);

  const modalScroll = event => {
    const parentEl = event.target.querySelector('.floating-menu-wrap--type2 .accordion--type3');
    if (event.target.scrollTop > 96) {
      parentEl.classList.add('is-fixed');
    } else {
      parentEl.classList.remove('is-fixed');
    }
  };

  if (!tabEl) return;
  tabEl.addEventListener(UXW.Tab.EVENT.CHANGE, function (event) {
    var currentTab = event.current;
    var beforeTab = event.before;
    // 변경전 페이지적용
    if (currentTab.content) {
      const acc = currentTab.content.querySelector(`.${bescroll} .tab--scroll .tab__inner`);
      const _floating = acc.querySelector('.floating-menu-wrap--type2 .accordion--type3');
      const allNavi = _floating.querySelectorAll('.accordion__panel a');

      allNavi.forEach(item => {
        item.classList.remove('is-active');
      });
      if (acc.scrollTop > 0) {
        _floating.classList.add('is-fixed');
      } else {
        _floating.classList.remove('is-fixed');
      }
    }
  });

  [].forEach.call(el, function (item) {
    item.addEventListener('scroll', modalScroll);
  });
};
/* //모달에 스크롤이 있을경우 */

const achorScroll = () => {
  const DATA_TOGGLE = 'data-toggle-section';
  const ARIA_PRESSED = 'aria-pressed';
  const toggleAll = document.querySelectorAll('[' + DATA_TOGGLE + ']');
  const arr = [];

  const removeNavi = function (childTarget) {
    childTarget.forEach(_child => {
      _child.classList.remove('is-active');
    });
  };

  const sectionShow = function (event) {
    event.preventDefault();
    const target = event.target;
    const sector = target.getAttribute(DATA_TOGGLE);
    const childTarget = target.closest('.accordion__item').querySelectorAll('.accordion__panel a');

    const beforeParent = target.closest('.tab__inner').querySelectorAll('[' + DATA_TOGGLE + ']');
    const getID = [].map.call(beforeParent, function (x) {
      return x.getAttribute(DATA_TOGGLE);
    });

    const uniqueArr = [].filter.call(getID, function (element, index) {
      return getID.indexOf(element) === index;
    });

    [].forEach.call(uniqueArr, function (g) {
      const x = document.querySelectorAll(g);
      x[0].classList.remove('is-active');
    });

    const _href = target.getAttribute('href');
    let _toHref = document.querySelector(_href);

    if (target) {
      removeNavi(childTarget);
      Object.keys(modalInnerScroll).forEach(index => {
        setTimeout(function () {
          modalInnerScroll[index].scrollIntoView(_toHref);
        }, 1);

        if (target.getAttribute(ARIA_PRESSED) || target.tagName === 'BUTTON') {
          modalInnerScroll[index].scrollTo(0, 0);
        }
      });

      const getSector = document.querySelector(sector);
      getSector.classList.add('is-active');
    }
  };

  if (toggleAll.length > 0) {
    [].map.call(toggleAll, function (item) {
      item.addEventListener('click', sectionShow);
      arr.push(item);
    });
  }

  window.achorItems = {
    selector: {
      ...arr,
    },
  };
};

const defaultScroll = () => {
  const tabScrollEl = document.querySelectorAll('.tab--scroll .tab__inner');
  const arr = [];

  const achorScrollDeactiveNavi = function (section) {
    section.forEach(item => {
      const _id = item.id;
      const _targetAll = document.querySelectorAll(`[href='#${_id}']`);
      if (!_targetAll[0]) {
        return;
      }
      _targetAll[0].classList.remove('is-active');
    });
  };

  const achorScrollActiveNavi = function (status, el) {
    const section = el.querySelectorAll('section');

    section.forEach(sec => {
      let top = status.y;
      let offset = sec.offsetTop;
      let height = sec.offsetHeight;
      let id = sec.getAttribute('id');

      if (top >= offset && top < offset + height) {
        achorScrollDeactiveNavi(section);
        const target = document.querySelector(`[href='#${id}']`);
        target ? target.classList.add('is-active') : false;
      }
    });
  };
  [].map.call(tabScrollEl, item => {
    if (!item.closest('.modal--layer__bescroll')) {
      const tabInnerScroll = Scrollbar.init(item, {
        syncCallbacks: true,
      });
    }

    if (item.closest('.modal--layer__bescroll')) {
      const modalInnerScroll = Scrollbar.init(item, {
        syncCallbacks: true,
      });

      arr.push(modalInnerScroll);

      const getAcc = modalInnerScroll.containerEl.querySelector('.accordion--type3');

      modalInnerScroll.addListener(status => {
        const offset = status.offset;
        achorScrollActiveNavi(offset, modalInnerScroll.containerEl);

        if (offset.y > 112) {
          getAcc.classList.add('is-fixed');
          getAcc.style.top = offset.y + 'px';
        } else {
          getAcc.classList.remove('is-fixed');
          getAcc.style.top = 0 + 'px';
        }
      });
    }
  });

  window.modalInnerScroll = {
    ...arr,
  };

  Scrollbar.initAll();
};

const initFunc = () => {};

const initialize = () => {
  navigation('[role="navigation"]');
  modalLayer('[role="navigation"]');
  modalScrollContent();
  cardRefresh();
  autoScrollContent();
  defaultScroll();
  achorScroll();
};

const commonInit = {
  initFunc,
  initialize,
};

export default commonInit;
