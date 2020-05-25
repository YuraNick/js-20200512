Необходимо передать в функцию такие параметры, при вызове с которыми
функция возвращает булевское значение "true"

Быстрые ответы приведены ниже, в комментарии перед каждой фенкцией

Для закрепления пройденного материала, JS решение с выводом в окно браузера размещено в hm-optional.js
и на https://glitch.com/edit/#!/hm-optional

```javascript

// ' ', {}, [], '0', 'false'
    function returnTrue0(a) {
        return a;
    }
    
// строка из 4-х символов, например '0000'
    function returnTrue1(a) {
      return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
    }

// NaN не равен сам себе
    function returnTrue2(a) {
        return a !== a;
    }

// returnTrue3(' ', 0, '0')
    function returnTrue3(a, b, c) {
        return a && a == b && b == c && a != c;
    }

// returnTrue4('9007199254740991')
    function returnTrue4(a) {
        return (a++ !== a) && (a++ === a);
    }

// returnTrue5({ '[object Object]' : 1 })
    function returnTrue5(a) {
        return a in a;
    }

// returnTrue5({ '[object Object]' : '[object Object]' })
    function returnTrue6(a) {
        return a[a] == a;
    }

// returnTrue7(-0, 0)
    function returnTrue7(a, b) {
        return a === b && 1/a < 1/b; 
    }
```
