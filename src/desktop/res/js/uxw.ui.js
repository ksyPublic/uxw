/* eslint-disable new-cap */
import 'element-closest-polyfill';
import iePolyfill from './utils/iePolyfill';
import EventHandler from './vendor/EventHandler';
import Tab from './components/tab';
import Tooltip from './components/tooltip';
import Accordion from './components/accordion';
import Dropdown from './components/dropdown';
import Spinner from './components/loading-spinner';
import Message from './components/message';
import ConfirmMessage from './components/confirm';
import AlertMessage from './components/alert';
import Dialog from './components/dialog';
import AutoHeightFit from './components/autoHeightFit';
import commonInit from './common';
import { getRandomID } from './utils/random';
/**
 * UI 초기화 처리
 * @param {*} target
 * @param {*} UI
 * @param {*} options
 */
const UIInitializer = (target, UI, options = {}) => {
  const elements = document.querySelectorAll(target);
  elements.forEach(el => {
    if (!UI.getInstance(el)) {
      const ui = new UI(el, options);
      ui.init();
    }
  });
};

Tab.GLOBAL_CONFIG = {
  activeClass: 'is-active',
};

Accordion.GLOBAL_CONFIG = {
  activeClass: 'is-active',
};

Tooltip.GLOBAL_CONFIG = {
  activeClass: 'is-active',
};

Dropdown.GLOBAL_CONFIG = {
  activeClass: 'is-active',
};

Dialog.GLOBAL_CONFIG = {
  openClass: 'is-active',
  closeClass: 'is-deactive',
};

const Alert = (message, alertCallback = null) => {
  const dialog = new AlertMessage({
    layout: `
        <div class="modal modal--alert" role="alertdialog" aria-modal="true">
            <div class="modal__dialog">
                <div class="modal__content">
                <div class="modal__body">
                    {{message}}
                </div>
                <div class="modal__footer">
                    <button class="button pw100" data-dialog-close>확인</button>
                </div>
                </div>
            </div>
        </div>
        `,
    replacer: {
      '{{a11y}}': getRandomID(),
      '{{message}}': message,
    },
  });
  if (alertCallback.open) {
    EventHandler.one(dialog.getElement(), Dialog.EVENT.OPEN, event => {
      alertCallback.open.apply(event.component, []);
    });
  }
  if (alertCallback.close) {
    EventHandler.one(dialog.getElement(), Dialog.EVENT.CLOSE, event => {
      alertCallback.close.apply(event.component, []);
    });
  }
  if (alertCallback.opened) {
    EventHandler.one(dialog.getElement(), Dialog.EVENT.OPENED, event => {
      alertCallback.opened.apply(event.component, []);
    });
  }
  if (alertCallback.closed) {
    EventHandler.one(dialog.getElement(), Dialog.EVENT.CLOSED, event => {
      setTimeout(() => {
        alertCallback.closed.apply(event.component, []);
      }, 0);
    });
  }

  dialog._open();
};

const Confirm = (message, confirmCallback = null) => {
  const dialog = new ConfirmMessage({
    layout: `
  
    <div class="modal modal--confirm" role="alertdialog" aria-modal="true">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="modal__body">
            {{message}}
          </div>
          <div class="modal__footer">
              <button class="button button--type4 pw100" data-dialog-close>아니요</button>
              <button class="button pw100" data-dialog-confirm>예</button>
          </div>
        </div>
      </div>
    </div>
  
      `,
    replacer: {
      '{{a11y}}': getRandomID(),
      '{{message}}': message,
    },
  });
  EventHandler.one(dialog.getElement(), Dialog.EVENT.OPEN, event => {
    const confirm = dialog.getElement().querySelector('[data-dialog-confirm]');
    if (confirm) {
      EventHandler.one(confirm, 'click', () => {
        if (confirmCallback) {
          confirmCallback.apply(event.component);
        }
      });
    }
  });
  dialog._open();
};

const SwiperA11y = (el, options = {}) => {
  return new window.Swiper(el, {
    ...options,
    threshold: 10, // 10px 이상 움직여야 슬라이드 기능작동
    a11y: {
      nextSlideMessage: '다음 슬라이드',
      prevSlideMessage: '이전 슬라이드',
      firstSlideMessage: '첫번째 슬라이드',
      lastSlideMessage: '마지막 슬라이드',
    },
    on: {
      init: function () {
        const slides = this.slides;
        const swiper = this;
        const wrapper = this.el;
        [].forEach.call(slides, (el, i) => {
          const elTarget = options.a11yTarget ? el.querySelector(options.a11yTarget) : el;

          elTarget.setAttribute('tabindex', 0);
          EventHandler.on(elTarget, 'focusin', () => {
            setTimeout(() => {
              wrapper.scrollLeft = 0;
              swiper.slideTo(i, 100);
            }, 0);
          });
        });

        if (options.init) {
          options.init.apply(this);
        }
      },
      afterInit: function () {
        if (options.afterInit) {
          options.afterInit.apply(this);
        }
      },
      ...options.on,
    },
  });
};

const initialize = () => {
  // 오토헤이트핏
  UIInitializer('.box--autoheight', AutoHeightFit);

  // 툴팁
  UIInitializer('.tooltip-button', Tooltip);

  // 드롭다운 셀렉트
  UIInitializer('.dropdown', Dropdown);

  // 탭
  UIInitializer('[data-ui-tab]', Tab);

  // 아코디언
  UIInitializer('[data-ui-accordion]', Accordion);
  commonInit.initialize();
  return 'initialized';
};

if (window.UXW) {
  console.warn('');
  console.warn('   이 경고 문구는 [uxw.ui.js] 파일이 중복으로 로드되는 경우에 출력됩니다.');
  console.warn('   중복로드를 찾아 제거하세요.');
  console.warn('');
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initialize();
    commonInit.initFunc();
    EventHandler.trigger(document, 'UILoaded');
    console.log('UI Load');
  });
}

const ui = {
  initialize,
  Tooltip,
  Tab,
  AutoHeightFit,
  Accordion,
  SwiperA11y,
  Dropdown,
  Spinner,
  Message,
  Dialog,
  Confirm,
  Alert,
};

window.UXW = { ...ui };
