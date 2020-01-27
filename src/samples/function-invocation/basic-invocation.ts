import { Token, AST, Operator as Op, ParseOptions, FunctionPattern } from '../../types';

const program = `\
print "Hello"
addition 2, 3
complex 1 + 2 * 3, 4 / 5 - 6
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'print' },
  { type: 'string', value: 'Hello' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'addition' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'complex' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '5' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '6' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionInvokeExpr',
    name: 'print',
    params: [
      { type: 'StringLiteral', value: 'Hello', returnType: 'Str' }
    ],
    returnType: 'Null',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition',
    params: [
      { type: 'NumberLiteral', value: '2', returnType: 'Num' },
      { type: 'NumberLiteral', value: '3', returnType: 'Num' },
    ],
    returnType: 'Num'
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'complex',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          expr2: { type: 'NumberLiteral', value: '3', returnType: 'Num' },  
        },
      },
    ],
    returnType: 'Num',
  },
];

const compiled = `\
print("Hello");
addition(2, 3);
complex(1 + (2 * 3), (4 / 5) - 6);
`;

const parseOptions: ParseOptions = {
  functions: new Map<string, FunctionPattern>([
    ['print', { name: 'print', patterns: new Set([Symbol.for('Str.Null')]) }],
    ['addition', { name: 'addition', patterns: new Set([Symbol.for('Num.Num.Num')]) }],
    ['complex', { name: 'complex', patterns: new Set([Symbol.for('Num.Num.Num')]) }],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
};
