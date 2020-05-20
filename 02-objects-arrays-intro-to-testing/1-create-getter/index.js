/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathArray = path.split('.');
    
    return (obj) => {
        let result = obj;
        pathArray.map( (item) => result = getValue(result, item) );
        return result;
    }

    function getValue (anotherObj, property) {
        if (typeof anotherObj !== 'object' || anotherObj === null) return;
        return anotherObj[property];
    }
}
