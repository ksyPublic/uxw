import { toHTML } from '../utils/dom-util';
import Dialog from './dialog';

class ConfirmMessage {
    constructor(
        config = {
            layout: ``,
            replacer: {},
        },
    ) {
        this._instance = null;
        this._element = this._createElement(config);
        document.body.appendChild(this._element);
        // 다이나믹한 컨텐츠는 바로 삭제
        this._instance = new Dialog(this._element, {
            destroy: true,
        });
        return this._instance;
    }

    open() {
        this._instance.open();
    }

    close() {
        this._instance.close();
    }

    getElement() {
        return this._element;
    }

    _createElement(config) {
        const { layout, replacer } = config;
        let source = layout;
        for (const key in replacer) {
            if (Object.prototype.hasOwnProperty.call(replacer, key)) {
                source = source.replaceAll(key, replacer[key]);
            }
        }
        return toHTML(source);
    }
}

export default ConfirmMessage;
