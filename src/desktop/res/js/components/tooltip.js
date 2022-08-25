import UI from './base/base-ui';
import EventHandler from '../vendor/EventHandler';

class Tooltip extends UI {
    constructor(element, config) {
        super(element, config);
        (this._element = element),
            (this._tooltiplist = null),
            (this._tooltip = null),
            (this._container = null),
            (this._timer = null),
            (this._element = element),
            (this._offset = [8, 8]),
            (this._position = 'xr yc'),
            (this.elementPosition = null),
            (this._classes = {
                active: 'is-active',
            });
    }

    addEvent() {
        const { _tooltip } = this;
        EventHandler.on(_tooltip, 'mouseenter', this.SHOW(this));
        EventHandler.on(_tooltip, 'mouseleave', this.CLOSE(this));
    }

    removeEvent() {
        const { _tooltip } = this;
        EventHandler.off(_tooltip, 'mouseenter', this.SHOW(this));
        EventHandler.off(_tooltip, 'mouseleave', this.CLOSE(this));
    }

    _destroy() {
        this.removeEvent();
    }

    SHOW(proto) {
        return function () {
            proto._timer = setTimeout(function () {
                proto._updatePosition();
            }, 1000);
        };
    }

    CLOSE(proto) {
        return function () {
            clearTimeout(this._timer);
            proto._timer = 0;
            proto._tooltiplist.classList.remove(proto._classes.active);
        };
    }

    _updatePosition() {
        const props = this.defaultProps;

        /**
         * 툴팁 포지션 업데이트
         */
        const positions = this._position.split(' ');
        const positionX = positions[0];
        const positionY = positions[1];
        const resultX = this._getPosition(positionX.toUpperCase());
        const resultY = this._getPosition(positionY.toUpperCase());

        if (this._elementPosition === 'bottom' || this._elementPosition === 'top') {
            this._tooltiplist.style.left = resultX + 'px';
            this._tooltiplist.style.top = resultY - this._offset[1] + 'px';
        } else if (this._elementPosition === 'left' || this._elementPosition === 'right') {
            this._tooltiplist.style.left = resultX + this._offset[0] + 'px';
            this._tooltiplist.style.top = resultY + 'px';
        } else {
            this._tooltiplist.style.left = resultX + 'px';
            this._tooltiplist.style.top = resultY + 'px';
        }

        this._tooltiplist.classList.add(this._classes.active);
    }

    _getPosition(positionName) {
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
        const tw = this._tooltiplist.offsetWidth;
        const th = this._tooltiplist.offsetHeight;
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
                if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XC');
                break;
            // x축 - center
            case 'XC':
                calcPositionValue = opennerXCenter - tw / 2;
                if (calcPositionValue < screenLeft) calcPositionValue = this._getPosition('XR');
                if (calcPositionValue + tw > screenRight) calcPositionValue = this._getPosition('XL');
                break;
            // x축 - right
            case 'XR':
                calcPositionValue = opennerRight;
                if (calcPositionValue + tw > screenRight) calcPositionValue = this._getPosition('XC');
                break;
            // y축 - top
            case 'YT':
                calcPositionValue = opennerTop - th;
                if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YC');
                break;
            // y축 - center
            case 'YC':
                calcPositionValue = opennerYCenter - th / 2;
                if (calcPositionValue < screenTop) calcPositionValue = this._getPosition('YB');
                if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YT');
                break;
            // y축 - bottom
            case 'YB':
                calcPositionValue = opennerBottom;
                if (calcPositionValue + th > screenBottom) calcPositionValue = this._getPosition('YC');
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

    varioblesUpdate() {
        let _tooltipTarget = 'aria-describedby';
        this._tooltip = this._element.querySelectorAll('[' + _tooltipTarget + ']')[0];

        const get = this._tooltip.getAttribute(_tooltipTarget);
        this._tooltiplist = document.querySelector('#' + get);
        const position = this._tooltiplist.getAttribute('data-placement');
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

        let appendContainer = this._container === null ? window : this._container;
        if (typeof appendContainer === 'string') {
            appendContainer = document.querySelector(appendContainer);
        }
        this._container = appendContainer;
    }

    init() {
        this.varioblesUpdate();
        this.addEvent();
    }
}

export default Tooltip;
