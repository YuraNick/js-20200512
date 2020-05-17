import { sortStrings } from './index';

describe('javascript-data-types/sort-strings', () => {
  it('should return sorted by "asc" array of strings', () => {
    expect(sortStrings(['b', 'c', 'a'])).toEqual(['a', 'b', 'c']);
  });
  console.log( 'should return sorted by "asc" array of strings', sortStrings(['b', 'c', 'a']) );

  it('should return sorted by "desc" array of strings', () => {
    expect(sortStrings(['b', 'c', 'a'], 'desc')).toEqual(['c', 'b', 'a']);
  });
  console.log( 'should return sorted by "desc" array of strings', sortStrings(['b', 'c', 'a'], 'desc') );

  it('should correctly sort language-specific characters', () => {
    expect(sortStrings(['абрикос', 'яблоко', 'ёжик'])).toEqual(['абрикос', 'ёжик', 'яблоко']);
  });
  console.log( 'should correctly sort language-specific characters', sortStrings(['абрикос', 'яблоко', 'ёжик']) );

  it('should correctly sort strings started from uppercase', () => {
    expect(sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик']))
      .toEqual(['Абрикос', 'абрикос', 'Ёжик', 'ёжик', 'Яблоко', 'яблоко']);
  });
  console.log( 'should correctly sort strings started from uppercase', sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик']) );
  
});
