import { toHTML } from '../utils/dom-util';
import EventHandler from '../vendor/EventHandler';

const NAME = 'ui.loading-spinner';
const CLASSES = {
    activeClass: 'is-active',
    deativeClass: 'is-deactive',
};

class Spinner {
    constructor() {
        this._spinner = null;
        this._count = 0;
        this._template = toHTML(`
        <div class="spinner-wrap">
            <div class="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        `);
    }

    static get NAME() {
        return NAME;
    }

    show() {
        if (this._count <= 0) {
            const spinnerWrap = document.querySelector('.message');
            this._spinner = spinnerWrap;

            this._spinner.insertBefore(this._template, this._spinner.firstChild);
            this._template.classList.add(CLASSES.activeClass);
            this._spinner.classList.add(CLASSES.activeClass);
        }
        this._count++;
    }

    hide(isForceHide = false) {
        const hasParent = this._template.parentNode;
        if (isForceHide) {
            if (hasParent) {
                this._template.classList.remove(CLASSES.activeClass);
                this._spinner.classList.remove(CLASSES.activeClass);

                this._count = 0;
            }
        } else {
            this._count = Math.max(this._count - 1, 0);
            if (this._count < 1) {
                if (hasParent) {
                    this._template.classList.remove(CLASSES.activeClass);
                    this._spinner.classList.remove(CLASSES.activeClass);

                    this._spinner.removeChild(this._template);
                }
            }
        }
    }
}

export default new Spinner();
