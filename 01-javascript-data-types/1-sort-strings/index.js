/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    // Яровиков Ю.В.

    return arr.sort((a, b) => {
        
        if (a === b) {
            // исходные строки одинаковые
            return 0;
        }

        // направление сортировки в численном виде
        const ascResult = (param === 'asc') ? 1 : -1;

        for (let i = 0; i < a.length; i++) {
            // побуквенное сравнение
            
            if (i > b.length - 1) {
                // начало a такое же, как b, раз дошли до этой буквы, но a длиньше
                return ascResult;
            }

            const aLetter = a[i];
            const bLetter = b[i];

            if (aLetter === bLetter) {
                // исходные буквы одинаковы - берем следующую букву
                continue;
            }

            // буквы разные - приведем к одному регистру
            const aLowerLetter = aLetter.toLowerCase();
            const bLowerLetter = bLetter.toLowerCase();

            if (aLowerLetter === bLowerLetter) {
                // буквы одинаковые, но разного регистра
                if (aLowerLetter === aLetter) {
                    return ascResult;
                } 
                return -ascResult;
            }

            // буквы разные, далее регистр можно не проверять
            
            const yo = 'ё';
            if (aLowerLetter === yo || bLowerLetter === yo) {
                // проверка на ё, обе сразу уже не могут быть ё
                const ye = 'е';

                if (aLowerLetter === yo) {
                    if (ye < bLowerLetter) return -ascResult;
                    return ascResult;
                }

                // bLowerLetter === yo
                if (ye < aLowerLetter) return ascResult;
                return -ascResult;
            }

            // буквы разные с учетом регистра, ни одна из не ё - остатеся простое сравнение
            if (aLowerLetter > bLowerLetter) return ascResult;
            if (aLowerLetter === bLowerLetter) return 0;
            if (aLowerLetter < bLowerLetter) return -ascResult;
        }

        // слово a закончилось, значит слово b длиньше
        return ascResult;
        
    });

}
