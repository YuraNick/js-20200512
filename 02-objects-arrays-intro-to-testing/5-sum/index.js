/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum (n) {

    /**
     * почему вот так не будет работать преобразование sum в примитив (?) :
     * sum[Symbol.toPrimitive] = () => sum.sumVal;
     * получается, преобразование в примитив должно быть вынесено за тело функции (?)
     */

    /** 
     * хотя сам счетчик вот так можно было бы сделать:
     * if (sum.sumVal === undefined) sum.sumVal = 0;
     * sum.sumVal += n;
    */

    calcSumm.sumVal = Number(n) || 0;
    calcSumm[Symbol.toPrimitive] = () => calcSumm.sumVal;

    return calcSumm;

    function calcSumm (nextN) {
        calcSumm.sumVal += Number(nextN) || 0;
        return calcSumm;
    }
}
