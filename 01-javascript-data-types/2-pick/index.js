/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    // Яровиков Юрий
    let res = {};
    
    for (let [key, value] of Object.entries(obj)) {
        if (! fields.includes(key, 0)) continue;
        res[key] = value;
    }
    
    return res;
};
