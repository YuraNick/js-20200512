const variants = [];
const comments = {
  nothing : ''
};

const myObj = {
    // функции переписаны в объектом стиле для дальнейшего удобного использования
   returnTrue0(a) {
        return a;
    },
  returnTrue1(a) {
      return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
    },
  returnTrue1(a) {
      return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
    },
  returnTrue2(a) {
        return a !== a;
    },
  returnTrue3(a, b, c) {
        return a && a == b && b == c && a != c;
    },
  returnTrue4(a) {
        return (a++ !== a) && (a++ === a);
    },
  returnTrue5(a) {
        return a in a;
    },
  returnTrue6(a) {
        return a[a] == a;
    },
  returnTrue7(a, b) {
        return a === b && 1/a < 1/b; 
    }
}


variants[0] = ' '; // аргумент для returnTrue0
comments[0] = "' '"; // аргумент для returnTrue0 в текстовом виде
    
variants[1] = '0000';  // аргумент для returnTrue1
comments[1] = "'0000'"; // аргумент для returnTrue1 в текстовом виде
    
variants[2] = NaN; // аргумент для returnTrue2
comments[2] = 'NaN'; // аргумент для returnTrue2 в текстовом виде
     
variants[3] = [' ', 0, '0']; // аргумент для returnTrue3
comments[3] = "' ', 0, '0'"; // аргумент для returnTrue3 в текстовом виде

variants[4] = '9007199254740991'; // аргумент для returnTrue4
comments[4] = "'9007199254740991'"; // аргумент для returnTrue4 в текстовом виде

variants[5] = {'[object Object]':1}; // аргумент для returnTrue5
comments[5] = "{'[object Object]':1}"; // аргумент для returnTrue5 в текстовом виде

variants[6] = {'[object Object]':'[object Object]'}; // аргумент для returnTrue6
comments[6] = "{'[object Object]':'[object Object]'}"; // аргумент для returnTrue6 в текстовом виде

variants[7] = [-0, 0]; // аргумент для returnTrue7
comments[7] = "-0, 0"; // аргумент для returnTrue7 в текстовом виде

 
const result = {
    // повторение преобразования в примитив
  [Symbol.toPrimitive]() {
    let resultStroke = '';
    for (const [key, val] of Object.entries(this)) {
      resultStroke += `${key} = ${Boolean(val.value)} // ${val.comment} <br><br>`;
    }
    return resultStroke;
  },
};



for (const key in variants) {
  const fParams = variants[key];
  const fName = 'returnTrue' + key;
  const fNameWithParam = `${fName}(${fParams})`;
  const fResult = Array.isArray(fParams) ? myObj[fName](...fParams) : myObj[fName](fParams);
  
  result[fNameWithParam] = {
    comment : comments[key] || '',
    value : fResult
  }
  
}

// вывод на страницу
const element = document.createElement('div');
element.innerHTML = result;
document.body.append(element);