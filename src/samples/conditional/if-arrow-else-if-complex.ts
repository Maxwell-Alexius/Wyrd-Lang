import { Token, AST, Operator as Op } from '../../types';
import { Arithmetic, Var, BooleanLiteral, StringLiteral, NumberLiteral, prioritize } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'condition1' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'condition2' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'result' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'condition1' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'Result is: ' },
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

  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'condition2' },
  { type: 'arrow', value: '=>' },
  { type: 'lparen', value: '(' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: ' is my lucky number' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'else' },
  { type: 'arrow', value: '=>' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Devil number is: ' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '666' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('condition1', DT.Bool),
    expr2: BooleanLiteral(false),
  },{
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('condition2', DT.Bool),
    expr2: BooleanLiteral(true),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('result', DT.Str),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Str,
      condition: Var('condition1', DT.Bool),
      expr1: {
        type: 'MethodInvokeExpr',
        name: 'concat',
        isNotBuiltin: false,
        receiver: StringLiteral('Result is: '),
        params: [
          {
            type: 'MethodInvokeExpr',
            name: 'toString',
            receiver: {
              type: 'BinaryOpExpr',
              return: DT.Num,
              operator: Op.Plus,
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
      expr2: {
        type: 'ConditionalExpr',
        condition: Var('condition2', DT.Bool),
        return: DT.Str,
        expr1: {
          type: 'MethodInvokeExpr',
          name: 'concat',
          isNotBuiltin: false,
          return: DT.Str,
          receiver: {
            type: 'MethodInvokeExpr',
            name: 'toString',
            isNotBuiltin: false,
            return: DT.Str,
            receiver: {
              type: 'BinaryOpExpr',
              operator: Op.Plus,
              return: DT.Num,
              expr1: {
                type: 'BinaryOpExpr',
                operator: Op.Asterisk,
                return: DT.Num,
                expr1: prioritize(Arithmetic(1, '+', 2)),
                expr2: NumberLiteral(4),
              },
              expr2: NumberLiteral(2)
            },
            params: []
          },
          params: [
            StringLiteral(' is my lucky number'),
          ],
        },
        expr2: {
          type: 'MethodInvokeExpr',
          name: 'concat',
          isNotBuiltin: false,
          receiver: StringLiteral('Devil number is: '),
          params: [
            {
              type: 'MethodInvokeExpr',
              name: 'toString',
              receiver: NumberLiteral(666),
              params: [],
              isNotBuiltin: false,
              return: DT.Str,
            },
          ],
          return: DT.Str,
        },
      },
    },
  },
];

const compiled = `\
const condition1 = false;
const condition2 = true;
const result = condition1 ? ('Result is: ').concat((123 + (456 * 789)).toString()) : (condition2 ? ((1 + 2) * 4 + 2).toString().concat(' is my lucky number') : ('Devil number is: ').concat((666).toString()));
`;

const minified = 'const condition1=false;const condition2=true;const result=condition1?(\'Result is: \').concat((123+(456*789)).toString()):(condition2?((1+2)*4+2).toString().concat(\' is my lucky number\'):(\'Devil number is: \').concat((666).toString()));';

export {
  tokens,
  ast,
  compiled,
  minified,
};
