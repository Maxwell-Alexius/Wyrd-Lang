export type Token = {
  type: string;
  value: string;
};

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

export const enum WyrdPrimitives {
  Num = 'Num',
  Str = 'Str',
  Bool = 'Bool',
  Null = 'Null',
  Unknown = 'Unknown',
};

export type Variable = {
  name: string;
  isConst: boolean;
  type: WyrdPrimitives;
};

export type Scope = {
  parentScope: null | Scope;
  variables: Map<string, Variable>;
};

export type AST = Array<Expr>;

export type Expr =
  BinaryOpExpr        |
  NotExpr             |
  OrExpr              |
  AndExpr             |
  AssignmentExpr      |
  PrioritizedExpr     |
  ConditionalExpr     |
  FunctionDeclaration |
  IdentLiteral        |
  NumberLiteral       |
  StringLiteral       |
  BooleanLiteral      |
  NullLiteral
;

export type NumberLiteral = {
  type: 'NumberLiteral';
  value: string;
};

export type StringLiteral = {
  type: 'StringLiteral';
  value: string;
}

export type BooleanLiteral = {
  type: 'BooleanLiteral';
  value: 'True' | 'False';
}

export type NullLiteral = {
  type: 'NullLiteral';
  value: 'Null';
}

export type IdentLiteral = {
  type: 'IdentLiteral';
  value: string;
};

export type AssignmentExpr = {
  type: 'AssignmentExpr';
  expr1: Expr;
  expr2?: Expr;
}

export type PrioritizedExpr = {
  type: 'PrioritizedExpr';
  expr?: Expr;
};

export type ConditionalExpr = {
  type: 'ConditionalExpr';
  condition?: Expr;
  expr1?: Expr;  // Condition is Truethy
  expr2?: Expr; // Condition is Falsey
}

export type BinaryOpExpr = {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2?: Expr;
};

export type NotExpr = {
  type: 'NotExpr';
  expr?: Expr;
}

export type OrExpr = {
  type: 'OrExpr';
  expr1: Expr;
  expr2?: Expr;
}

export type AndExpr = {
  type: 'AndExpr';
  expr1: Expr;
  expr2?: Expr;
}

export type Argument = { ident: string; type: string };

export type FunctionDeclaration = {
  type: 'FunctionDeclaration';
  name: string;
  arguments: Array<Argument>;
  outputType: string;
  body: Array<Expr>;
}
