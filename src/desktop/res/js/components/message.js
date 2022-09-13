import EventHandler from '../vendor/EventHandler';
import { toHTML } from '../utils/dom-util';

const NAME = 'ui.message';

const CLASSES = {
  activeClass: 'is-active',
  deativeClass: 'is-deactive',
};

const defaultConfig = {
  container: `<div class="message__text text-blue"></div>`,
  lifeTime: 2000,
};

class Message {
  constructor(config = {}) {
    this._config = {
      ...defaultConfig,
      ...config,
    };
    this._box = null;
    this._message = null;
    this._element = null;
  }

  static get NAME() {
    return NAME;
  }

  static MESSAGE_COUNT = 0;
  static HOLDER = null;

  static getContainer(template) {
    if (Message.HOLDER === null) {
      Message.HOLDER = toHTML(template);
    }
    return Message.HOLDER;
  }

  show(message, options = {}, el) {
    this._message = message;
    this._element = el ? document.querySelector(`${el}`) : document.querySelector('#toast');
    Message.getContainer(this._config.container).innerText = this._message;
    this._element.appendChild(Message.HOLDER);
    this._element.classList.add(CLASSES.activeClass);
    Message.MESSAGE_COUNT++;
    if (options === 'noop') {
      return;
    } else {
      setTimeout(() => {
        this.hide();
      }, this._config.lifeTime);
    }
  }

  hide() {
    this._element.classList.add(CLASSES.deativeClass);
    this._element.classList.remove(CLASSES.activeClass);
    EventHandler.one(this._element, 'animationend', () => {
      this.destroy();
      this._element.classList.remove(CLASSES.deativeClass);
      Message.MESSAGE_COUNT--;
    });
  }

  destroy() {
    Message.getContainer(this._config.container);
  }
}

export default new Message();
