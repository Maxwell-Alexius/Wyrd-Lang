import { Token, AST, Operator } from '../../types';
import { Arithmetic, Var, BooleanLiteral, StringLiteral, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'condition' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'result' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'condition' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'msg' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Result is: ' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'msg' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '456' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '789' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'else' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'devilNumStr' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Devil number is: ' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'devilNumStr' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('condition', DT.Bool),
    expr2: BooleanLiteral(true),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('result', DT.Str),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Str,
      condition: Var('condition', DT.Bool),
      expr1: {
        type: 'DoBlockExpr',
        return: DT.Str,
        body: [
          {
            type: 'ConstDeclaration',
            return: DT.Void,
            expr1: Var('msg', DT.Str),
            expr2: StringLiteral('Result is: '),
          },
          {
            type: 'MethodInvokeExpr',
            name: 'concat',
            isNotBuiltin: false,
            receiver: Var('msg', DT.Str),
            params: [
              {
                type: 'MethodInvokeExpr',
                name: 'toString',
                receiver: {
                  type: 'BinaryOpExpr',
                  return: DT.Num,
                  operator: Operator.Plus,
                  expr1: NumberLiteral(123),
                  expr2: Arithmetic(456, '*', 789),
                },
                params: [],
                isNotBuiltin: false,
                return: DT.Str,
              },
            ],
            return: DT.Str,
          },    
        ],
      },
      expr2: {
        type: 'DoBlockExpr',
        return: DT.Str,
        body: [
          {
            type: 'ConstDeclaration',
            return: DT.Void,
            expr1: Var('devilNumStr', DT.Str),
            expr2: {
              type: 'MethodInvokeExpr',
              name: 'toString',
              receiver: NumberLiteral(666),
              params: [],
              isNotBuiltin: false,
              return: DT.Str,
            },
          },
          {
            type: 'MethodInvokeExpr',
            name: 'concat',
            isNotBuiltin: false,
            receiver: StringLiteral('Devil number is: '),
            params: [
              Var('devilNumStr', DT.Str),
            ],
            return: DT.Str,
          },
        ],
      },
    },
  },
];

const compiled = `\
const condition = true;
const result = condition ? (function () {
  const msg = 'Result is: ';
  return msg.concat((123 + (456 * 789)).toString());
})() : (function () {
  const devilNumStr = (666).toString();
  return ('Devil number is: ').concat(devilNumStr);
})();
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
