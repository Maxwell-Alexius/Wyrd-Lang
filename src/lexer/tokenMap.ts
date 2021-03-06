import { Token } from '../types';

const tokenMaps = new Map<string, Token>([
  ['+', { type: 'plus', value: '+' }],
  ['-', { type: 'dash', value: '-' }],
  ['*', { type: 'asterisk', value: '*' }],
  ['/', { type: 'slash', value: '/' }],
  ['%', { type: 'percent', value: '%' }],
  ['\\', { type: 'bslash', value: '\\' }],
  ['(', { type: 'lparen', value: '(' }],
  [')', { type: 'rparen', value: ')' }],
  ['[', { type: 'lbracket', value: '[' }],
  [']', { type: 'rbracket', value: ']' }],
  ['{', { type: 'lcurly', value: '{' }],
  ['}', { type: 'rcurly', value: '}' }],
  ['=', { type: 'eq', value: '=' }],
  ['==', { type: 'eqeq', value: '==' }],
  ['=>', { type: 'arrow', value: '=>' }],
  ['->', { type: 'ref', value: '->' }],
  ['&', { type: 'amp', value: '&' }],
  ['|', { type: 'pipe', value: '|' }],
  ['|>', { type: 'pipe-op', value: '|>' }],
  ['?', { type: 'question', value: '?' }],
  ['!', { type: 'bang', value: '!' }],
  ['!=', { type: 'bangeq', value: '!=' }],
  ['$', { type: 'dollar', value: '$' }],
  ['@', { type: 'at', value: '@' }],
  ['~', { type: 'wavy', value: '~' }],
  [':', { type: 'colon', value: ':' }],
  [';', { type: 'semicolon', value: ';' }],
  ['>', { type: 'gt', value: '>' }],
  ['<', { type: 'lt', value: '<' }],
  ['>=', { type: 'gteq', value: '>=' }],
  ['<=', { type: 'lteq', value: '<=' }],
  ['^', { type: 'caret', value: '^' }],
  ['.', { type: 'dot', value: '.' }],
  [',', { type: 'comma', value: ',' }],
  ['_', { type: 'underscore', value: '_' }],
  ['\n',  { type: 'newline', value: '\n' }],

  // Sharp is used as comment in Wyrd-Lang, so it is inactive
  // ['#', { type: 'sharp', value: '#' }],
]);

export default tokenMaps;
