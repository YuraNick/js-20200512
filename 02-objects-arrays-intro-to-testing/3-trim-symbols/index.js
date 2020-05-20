/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (isNaN(size)) return string;

    const obj = {
        identicalCnt : 1,
        prevLetter : '',
        setMaxCnt : size
    };
    
    return string.split('').filter( (item) => filterBySize(item, obj) ).join('');

    function filterBySize(curLetter, setObj) {
        setObj.identicalCnt = (curLetter === setObj.prevLetter) ? ++setObj.identicalCnt : 1;
        setObj.prevLetter = curLetter;
        return Boolean(setObj.identicalCnt <= setObj.setMaxCnt);
    }

}
