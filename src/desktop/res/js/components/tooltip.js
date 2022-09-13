import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';
import { dataSetToObject } from '../utils/dom-util';

/**
 * tooltip verstion 0.0.1
 */

const NAME = 'ui.tooltip';

const ARIA_DESCRIBEDBY = 'aria-describedby';
const TOOLTIP_TIME = 'data-tooltip-time';
const DATA_PLACEMENT = 'data-placement';

const dataAttrConfig = {
  activeClass: 'active',
  active: 0,
  time: 1000,
  offset: [8, 8],
};

const defaultConfig = {
  ...dataAttrConfig,
};

/**
 * 타겟이 되는 툴팁
 * <div class="nav__item tooltip-button">
        <button type="button" class="ic-button-nav" aria-describedby="tooltip2" aria-label="UXW라이팅 가이드">
            <i class="ic ic-guidebook" aria-hidden="true"></i>
        </button>
        <a class="text" href="#none" alt="용어사전검색 바로가기">UXW라이팅 가이드</a>
    </div>
 * 
 * 
 * 열리는 툴팁 박스
    <div class="tooltip__box">
        <div id="tooltip2" role="tooltip" class="tooltip" data-visible data-placement="right">
            <span class="tooltip__title">UXW라이팅 가이드</span>
        </div>
    </div>
 */

class Tooltip extends UI {
  constructor(element, config = {}) {
    super(element, config);
    this._setupConfog(config);
    this._tooltip = null;
    this._current = {
      tooltip: null,
      content: null,
    };
    this._getTime = null;
    this._position = 'xr yc';
    this._timer = null;
    this._container = null;
    this._elementPosition = null;
  }

  static GLOBAL_CONFIG = {};

  static get EVENT() {
    return {
      SHOW: `${NAME}.show`,
      HIDE: `${NAME}.hide`,
    };
  }

  static get NAME() {
    return NAME;
  }

  _setupConfog(config) {
    this._config = {
      ...defaultConfig,
      ...Tooltip.GLOBAL_CONFIG,
      ...config,
      ...dataSetToObject(this._element, dataAttrConfig, 'tooltip'),
    };
  }

  _addEvent() {
    EventHandler.on(this._tooltip, super._eventName('mouseenter'), event => {
      if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
        event.preventDefault();
      }

      const target = event.target.closest(`[${ARIA_DESCRIBEDBY}]`);
      const getTime = this._tooltip.parentElement.getAttribute(`${TOOLTIP_TIME}`);
      if (target) {
        this._current = {
          tooltip: target,
          content: this._getContent(target),
        };

        this._getTime = getTime * 1000;
        this._getPosBind();
        this._show();
      }
    });

    EventHandler.on(this._tooltip, super._eventName('mouseleave'), event => {
      if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
        event.preventDefault();
      }

      const target = event.target.closest(`[${ARIA_DESCRIBEDBY}]`);

      if (target) {
        if (!this._current) {
          return;
        }
        const { tooltip, content } = this._current;
        this._hide(tooltip, content);
      }
    });
  }

  _getPosBind() {
    const { content } = this._current;

    const position = content.getAttribute(`${DATA_PLACEMENT}`);
    this._elementPosition = position;
    if (position) {
      switch (position) {
        case 'bottom':
          this._position = 'xc yt';
          break;
        case 'left':
          this._position = 'xc yc';
          break;
        case 'top':
          this._position = 'xc yb';
          break;
        case 'right':
          this._position = 'xr yc';
          break;

        default:
          'right';
      }
    }
  }

  _getContent(target) {
    const attr = target.getAttribute(`${ARIA_DESCRIBEDBY}`);
    const content = document.querySelector(`#${attr}`);
    return content;
  }

  _removeEvent() {
    EventHandler.off(this._tooltip, super._eventName('mouseenter'));
    EventHandler.off(this._tooltip, super._eventName('mouseleave'));
  }

  destroy() {
    this._removeEvent();
  }

  _show() {
    const { time } = this._config;
    this._timer = setTimeout(
      () => {
        this._updatePosition();
      },
      this._getTime ? this._getTime : time,
    );
  }

  _hide(tooltip, content) {
    const { activeClass } = this._config;
    clearTimeout(this._timer);
    content.classList.remove(activeClass);
  }

  _updatePosition() {
    const { activeClass, offset } = this._config;
    const { content } = this._current;

    /**
     * 툴팁 포지션 업데이트
     */
    const positions = this._position.split(' ');

    const positionX = positions[0];
    const positionY = positions[1];
    const resultX = this._getPosition(positionX.toUpperCase());
    const resultY = this._getPosition(positionY.toUpperCase());

    if (this._elementPosition === 'bottom' || this._elementPosition === 'top') {
      Object.assign(content.style, {
        left: `${resultX}px`,
        top: `${resultY - offset[1]}px`,
      });
    } else if (this._elementPosition === 'left' || this._elementPosition === 'right') {
      Object.assign(content.style, {
        left: `${resultX + offset[0]}px`,
        top: `${resultY}px`,
      });
    } else {
      Object.assign(content.style, {
        left: `${resultX}px`,
        top: `${resultY}px`,
      });
    }

    content.classList.add(activeClass);
  }

  _getPosition(positionName) {
    const { content } = this._current;

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
    const opennerRect = this._element.getBoundingClientRect();
    const stage = this._getCurrentStageInfo();
    const tw = content.offsetWidth;
    const th = content.offsetHeight;
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
        // if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XC');
        break;
      // x축 - center
      case 'XC':
        calcPositionValue = opennerXCenter - tw / 2;
        // if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XR');
        // if (calcPositionValue + tw > screenRight) calcPositionValue = this._getPosition('XL');
        break;
      // x축 - right
      case 'XR':
        calcPositionValue = opennerRight;
        // if (calcPositionValue + tw > screenRight) {
        //   calcPositionValue = this._getPosition('XC');
        // }

        break;
      // y축 - top
      case 'YT':
        calcPositionValue = opennerTop - th;
        // if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YC');
        break;
      // y축 - center
      case 'YC':
        calcPositionValue = opennerYCenter - th / 2;
        // if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YB');
        // if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YT');
        break;
      // y축 - bottom
      case 'YB':
        calcPositionValue = opennerBottom;
        // if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YC');
        break;
    }
    return calcPositionValue;
  }

  _getCurrentStageInfo() {
    let info = {
      width: 0,
      height: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
    if (this._container === window) {
      info.width = window.innerWidth;
      info.height = window.innerHeight;
      info.scrollLeft = window.pageXOffset;
      info.scrollTop = window.pageYOffset;
    } else {
      info.width = this._container.offsetWidth;
      info.height = this._container.offsetHeight;
      info.scrollLeft = this._container.scrollLeft;
      info.scrollTop = this._container.scrollTop;
    }

    return info;
  }

  _varioblesUpdate() {
    this._tooltip = this._element.querySelector('[' + ARIA_DESCRIBEDBY + ']');

    const getContainer = this._tooltip.getAttribute('data-container');

    let appendContainer = getContainer === null ? window : getContainer;
    if (typeof appendContainer === 'string') {
      appendContainer = document.querySelector('#' + appendContainer);
    }
    this._container = appendContainer;
  }

  init() {
    this._current = null;
    this._varioblesUpdate();
    this._addEvent();
  }
}

export default Tooltip;
