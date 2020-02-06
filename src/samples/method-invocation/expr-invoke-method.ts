import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';

const program = `\
(1 + 2 * 3).toStr()
`;

const tokens: Array<Token> = [
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'toStr',
    receiver: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: NumberLiteral(1),
      expr2: Arithmetic(2, '*', 3),
    },
    params: [],
    returnType: 'Str',
  },
];

const compiled = `\
(1 + (2 * 3)).toString();
`;

const minified = '(1+(2*3)).toString();';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
