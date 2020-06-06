import { Token, AST } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'record' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'name' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'age' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'hasPet' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'maxwell' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Maxwell' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '18' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    expr1: Var('maxwell', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Maxwell') },
        { name: 'age', type: DT.Num, value: NumberLiteral(18) },
        { name: 'hasPet', type: DT.Bool, value: BooleanLiteral(false) }
      ],
      return: new DT('UserInfo')
    },
    return: DT.Void,
  },
];

const compiled = `\
const maxwell = { name: 'Maxwell', age: 18, hasPet: false };
`;

const minified = 'const maxwell={name:\'Maxwell\',age:18,hasPet:false};';

export {
  tokens,
  ast,
  compiled,
  minified,
};
