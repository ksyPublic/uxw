import UI from './base/base-ui';

const NAME = 'ui.dropdown';

class Dropdown extends UI {
    constructor(element, config) {
        super(element, config);
    }

    addEvent() {
        console.log('@@@@');
    }

    init() {
        this.addEvent();
    }
}

export default Dropdown;
