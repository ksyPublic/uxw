import UI from './base/base-ui';
import { dataSetToObject } from '../utils/dom-util';
import EventHandler from '../vendor/EventHandler';

const NAME = 'ui.autoheightfit';

const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const dataAttrConfig = {
  cHeight: 0,
  debounceDelay: 100, //resize시 디바운스 딜레이값
};

const defaultConfig = {
  ...dataAttrConfig,
};

class AutoHeightFit extends UI {
  constructor(element, config = {}) {
    super(element, config);
    this._setupConfig(config);
  }

  static get NAME() {
    return NAME;
  }

  _setupConfig(config) {
    this._config = {
      ...defaultConfig,
      ...AutoHeightFit.GLOBAL_CONFIG,
      ...config,
      ...dataSetToObject(this._element, dataAttrConfig, 'autoHeightFit'),
    };
  }

  init() {
    this._addEvent();
  }

  _addEvent() {
    EventHandler.on(window, 'resize', this.resizeHandler)
    EventHandler.on(document, 'UILoaded', this.resizeHandler)
  }

  resizeHandler = debounce(() => {
    this._setResizeGridUpdate();
  }, 1);

  _removeEvent() {
    EventHandler.off(window, 'resize')
  }

  _destroy() {
    this._removeEvent();
  }

  _getTopPosition(el) {
    let yPos = 0;
    while (el) {
      if (el.tagName === 'BODY') {
        const scTop = document.documentElement.scrollTop;
        yPos += el.offsetTop - scTop + el.clientTop;
      } else {
        yPos += el.offsetTop  + el.clientTop;
      }

      el = el.offsetParent;
    }

    return yPos;
  }

  _setResizeGridUpdate() {
    const { cHeight } = this._config;
    const offsetTop = this._getTopPosition(this._element);


    const winHeight = window.innerHeight;
    const resultHeight = winHeight - offsetTop - cHeight;
    this._element.style.height = `${resultHeight}px`;
  }
}

export default AutoHeightFit;
