import { toHTML, getElement, dataSetToObject } from '../utils/dom-util';
import EventHandler from '../vendor/EventHandler';
import UI from './base/base-ui';

/**
 * version 0.0.1
 */
const NAME = 'ui.dialog';

const IDENTIFIER = {
  TRIGGER: 'data-dialog-trigger',
  CLOSE: 'data-dialog-close',
};

const dataAttrConfig = {
  bg: true,
  bgclose: true,
  destroy: false,
  openClass: 'show',
  closeClass: 'hide',
};

const defaultConfig = {
  ...dataAttrConfig,
  bgTemplate: `
      <div style="
        position: fixed; 
        width: 100%; 
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,0.6);">
      </div>`,
};

const ZINDEX = {
  CONTENT: 204,
  BACKDROP: 203,
  INCREASE: 1,
};

class Dialog extends UI {
  constructor(element, config = {}) {
    super(element, config);
    this._setupConfog(config);
    this._bg = null;
    this._closeButtons = null;
    this._isOpen = false;
    this._init();
  }

  static get EVENT() {
    return {
      OPEN: `${NAME}.open`,
      OPENED: `${NAME}.opened`,
      CLOSE: `${NAME}.close`,
      CLOSED: `${NAME}.closed`,
      FIRST_OPEN: `${NAME}.firstOpen`,
      LAST_CLOSE: `${NAME}.laseClose`,
    };
  }

  

  static GLOBAL_CONFIG = {};
  static COUNT = 0;

  static closeAll() {
    const instances = Dialog.getInstances();
    for (const p in instances) {
      if (Object.prototype.hasOwnProperty.call(instances, p)) {
        const dialog = instances[p];
        if (dialog) dialog.close();
      }
    }
  }

  static get NAME() {
    return NAME;
  }

  _zIndexOrderIncrease() {
    this._element.style.zIndex = ZINDEX.CONTENT += ZINDEX.INCREASE;
    if (this._bg) this._bg.style.zIndex = ZINDEX.BACKDROP += ZINDEX.INCREASE;
  }

  open() {
    this._open();
  }

  close() {
    this._close();
  }

  _open() {
    if (this._isOpen === true) return;
    this._varioblesUpdate();
    this._addEvent();
    this._showBackground();
    this._zIndexOrderIncrease();
    this._showDialog();
    this._isOpen = true;
    EventHandler.trigger(this._element, Dialog.EVENT.OPEN, {
      component: this,
    });

    if (Dialog.COUNT === 0) {
      EventHandler.trigger(window, Dialog.EVENT.FIRST_OPEN);
    }

    Dialog.COUNT++;
  }

  _showBackground() {
    if (this._bg) {
      document.body.appendChild(this._bg);
      this._bg.classList.add('fadeIn');
    }
  }

  getElement() {
    return this._element;
  }

  _showDialog() {
    this._element.classList.add(this._config.openClass);
  }

  _varioblesUpdate() {
    this._bg = this._config.bg ? this._createBackground() : null;
    this._closeButtons = this._element.querySelectorAll(`[${IDENTIFIER.CLOSE}]`);
  }

  _addEvent() {
    this._closeButtons.forEach(el => {
      EventHandler.one(el, super._eventName('click'), this._close.bind(this));
    });
  }

  _removeEvents() {
    if (this._closeButtons) {
      this._closeButtons.forEach(el => {
        EventHandler.off(el, super._eventName('click'));
      });
    }
    this._closeButtons = null;
  }

  _setupConfog(config) {
    this._config = {
      ...defaultConfig,
      ...Dialog.GLOBAL_CONFIG,
      ...config,
      ...dataSetToObject(this._element, dataAttrConfig, 'dialog'),
    };
  }

  _createBackground() {
    if (this._bg) return this._bg;
    return toHTML(this._config.bgTemplate);
  }

  _close(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    this._hideDialog();
    EventHandler.trigger(this._element, Dialog.EVENT.CLOSE, {
      component: this,
    });
  }

  _hideBackground() {
    if (this._bg) document.body.removeChild(this._bg);
  }

  _hideDialog() {
    this._element.classList.add(this._config.closeClass);
    this._element.classList.remove(this._config.openClass);
    EventHandler.one(this._element, 'animationend', () => {
      this._element.classList.remove(this._config.closeClass);
      this._hideBackground();
      EventHandler.trigger(this._element, Dialog.EVENT.CLOSED, {
        component: this,
      });
      this.destroy();
    });
  }

  destroy() {
    this._removeEvents();
    this._isOpen = false;
    if (this._config.destroy === true || this._config.destroy === 'true') {
      this._element.parentNode.removeChild(this._element);
      super.destroy();
    }

    Dialog.COUNT--;
    if (Dialog.COUNT <= 0) {
      EventHandler.trigger(window, Dialog.EVENT.LAST_CLOSE);
    }
  }

  _init() {
    this._element.setAttribute('aria-modal', 'true');
  }
}

EventHandler.on(document, `click.DIALOG_TRIGGER`, event => {
  const el = event.target.closest(`[${IDENTIFIER.TRIGGER}]`);
  if (!el) return;
  const target = el.getAttribute(IDENTIFIER.TRIGGER);

  if (target) {
    const dialogElement = getElement(target);
    if (dialogElement) {
      const dialog = Dialog.getInstance(dialogElement);
      if (dialog) {
        dialog.open();
      } else {
        new Dialog(dialogElement).open();
      }
    }
  }
});
export { defaultConfig };
export default Dialog;
