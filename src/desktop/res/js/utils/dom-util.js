/**
 * 엘리먼트에 선언되어있는 data attribute를 오브젝트 형태로 반환
 * UI 컴포넌트에서 data attribute로 속성 값 전달할 떄 사용
 * @param {*} element
 * @returns
 */
export const dataSetToObject = (element, dataAttrConfig, prefix = '') => {
    const config = {};
    for (const key in dataAttrConfig) {
        if (Object.prototype.hasOwnProperty.call(dataAttrConfig, key)) {
            const attrvalue = element.dataset[`${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`];
            if (attrvalue) {
                config[key] = attrvalue;
            }
        }
    }
    return config;
};

/**
 *
 * @param {*} element
 * @returns
 */
export const getIndex = element => {
    if (!element) {
        return -1;
    }
    let currentElement = element;
    let index = 0;
    while (currentElement.previousElementSibling) {
        index += 1;
        currentElement = currentElement.previousElementSibling;
    }
    return index;
};