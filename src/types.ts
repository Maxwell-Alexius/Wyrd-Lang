import { Scope, DataType as DT } from './parser/utils';

export type Token = { type: string; value: string };

export const enum Precedence {
  High = 1,
  Equal = 0,
  Low = -1,
};

export const enum Operator {
  Plus = '+',
  Dash = '-',
  Asterisk = '*',
  Slash = '/',
  Percent = '%',
  // Lparen = '(',
  // Rparen = ')',
  // Lbracket = '[',
  // Rbracket = ']',
  // Lcurly = '{',
  // Rcurly = '}',
  // Eq = '=',
  // Amp = '&',
  // Pipe = '|',
  // Question = '?',
  // Bang = '!',
  // Sharp = '#',
  // Dollar = '$',
  // At = '@',
  // Wavy = '~',
  // Colon = ':',
  // Semicolon = ';',
  Gt = '>',
  GtEq = '>=',
  Lt = '<',
  LtEq = '<=',
  EqEq = '==',
  BangEq = '!=',
  // Caret = '^',
  // Dot = '.',
  // Comma = ',',
  // Underscore = '_'
}

export interface Operand {
  left: DT;
  right: DT;
  return: DT;
}

export type ParseOptions = {
  ast?: AST;
  scope?: Scope | (() => Scope);
};

export type AST = Array<Expr>;

interface Expression {
  type: string;
  return: DT;
}

export type Expr =
  EmptyExpr
| BinaryOpExpr
| NotExpr
| OrExpr
| AndExpr
| VarDeclaration
| VarAssignmentExpr
| AssignmentExpr
| PrioritizedExpr
| ConditionalExpr
| FunctionDeclaration
| FunctionInvokeExpr
| MethodInvokeExpr
| IdentLiteral
| NumberLiteral
| StringLiteral
| BooleanLiteral
| NullLiteral
| ListLiteral
| TypeLiteral;

export interface EmptyExpr extends Expression {
  type: 'EmptyExpr';
  return: typeof DT.Invalid;
};

export interface NumberLiteral extends Expression {
  type: 'NumberLiteral';
  value: string;
  return: typeof DT.Num;
};

export interface StringLiteral extends Expression {
  type: 'StringLiteral';
  value: string;
  return: typeof DT.Str;
};

export interface BooleanLiteral extends Expression {
  type: 'BooleanLiteral';
  value: 'True' | 'False';
  return: typeof DT.Bool;
};

export interface NullLiteral extends Expression {
  type: 'NullLiteral';
  value: 'Null';
  return: typeof DT.Null;
};

export interface ListLiteral extends Expression {
  type: 'ListLiteral';
  values: Array<Expr>;

  // TODO: Element type can be derived from return since it is replaced by the DataType class
  elementType: DT;
};

export interface IdentLiteral extends Expression {
  type: 'IdentLiteral';
  value: string;
};

export interface TypeLiteral extends Expression {
  type: 'TypeLiteral';
  value: string;
  return: typeof DT.Void;
};

export interface VarDeclaration extends Expression {
  type: 'VarDeclaration';
  expr1: IdentLiteral;
  expr2: Expr;
  return: typeof DT.Void;
};

export interface VarAssignmentExpr extends Expression {
  type: 'VarAssignmentExpr';
  expr1: IdentLiteral;
  expr2: Expr;
  return: typeof DT.Void;
}

export interface AssignmentExpr extends Expression {
  type: 'AssignmentExpr';
  expr1: Expr;
  expr2: Expr;
  return: typeof DT.Void;
};

export interface PrioritizedExpr extends Expression {
  type: 'PrioritizedExpr';
  expr: Expr;
};

export interface ConditionalExpr extends Expression {
  type: 'ConditionalExpr';
  condition: Expr;
  expr1: Expr;  // Condition is Truethy
  expr2: Expr; // Condition is Falsey
};

export interface BinaryOpExpr extends Expression {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2: Expr;
};

export interface NotExpr extends Expression {
  type: 'NotExpr';
  expr: Expr;
  return: typeof DT.Bool;
};

export interface OrExpr extends Expression {
  type: 'OrExpr';
  expr1: Expr;
  expr2: Expr;
  return: typeof DT.Bool;
};

export interface AndExpr extends Expression {
  type: 'AndExpr';
  expr1: Expr;
  expr2: Expr;
  return: typeof DT.Bool;
};

export type Argument = { ident: string; type: DT };

export interface FunctionDeclaration extends Expression {
  type: 'FunctionDeclaration';
  name: string;
  arguments: Array<Argument>;
  outputType: DT;
  body: Array<Expr>;
  return: typeof DT.Void;
};

export interface FunctionInvokeExpr extends Expression {
  type: 'FunctionInvokeExpr';
  name: string;
  params: Array<Expr>;
};

export interface MethodInvokeExpr extends Expression {
  type: 'MethodInvokeExpr';
  name: string;
  receiver: Expr;
  params: Array<Expr>;
};
