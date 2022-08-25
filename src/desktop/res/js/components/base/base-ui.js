import Data from '../../vendor/data';

class UI {
    constructor(element, config) {
        if (!element) {
            this._throwError('option.wrapper is required.');
        }
        this._id = '';
        this._element = element;
        this._genID(config.id);
        Data.set(this._element, this.constructor.NAME, this);
    }

    static getInstance(element) {
        return Data.get(element, this.NAME);
    }

    static getInstances() {
        return Data.getAll(this.NAME);
    }

    /**
     * 컴포넌트 초기화
     */
    init() {
        // override
    }

    /**
     * 컴포넌트 업데이트
     */
    update() {
        // override
    }

    /**
     * 컴포넌트 삭제
     */
    destroy() {
        // override
        Data.remove(this._element, this.constructor.NAME);
        this._element = null;
    }

    /**
     * 현재 UI의 id 반환
     * @returns id
     */
    getID() {
        // 부모 클래스에서 구현
        return this._id;
    }

    /**
     * UI의 아이디를 생성한다.
     * @param {string} name 컴포넌트 이름
     * @param {string} id 컴포넌트 아이디
     */
    _genID(id) {
        this._id = id || `${this.constructor.NAME}-${Math.random().toString(36).substr(2, 9)}`;
    }

    _getRandomSerial() {
        return `id_${Math.random().toString(36).substr(2, 9)}`;
    }

    _eventName(eventName) {
        return `${eventName}.${this.constructor.NAME}`;
    }

    _throwError(message) {
        throw new Error(`say! --> ${this.constructor.NAME}: ${message}`);
    }

    _warn(message) {
        console.warn(`${this.constructor.NAME}: ${message}`);
    }
}

export default UI;
