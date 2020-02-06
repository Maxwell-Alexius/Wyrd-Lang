import * as T from '../types';

export function createFunctionPatterns(
  functionPatterns: Array<[string, Array<[string, string]>]>
): Map<string, T.FunctionPattern> {
  return new Map<string, T.FunctionPattern>(
    functionPatterns.map(([name, patterns]) => createFunctionPattern(name, patterns))
  );
}

export function createFunctionPattern(
  name: string,
  patterns: Array<[string, string]>
): [string, T.FunctionPattern] {
  const result: [string, T.FunctionPattern] = [
    name,
    {
      name,
      patterns: new Map<Symbol, T.FunctionPatternInfo>(),
    }
  ];

  patterns.forEach(pattern => {
    const inputSymbol = Symbol.for(pattern[0]);
    const patternInfo: T.FunctionPatternInfo = {
      returnType: pattern[1],
    };

    result[1].patterns.set(inputSymbol, patternInfo);
  });

  return result;
}

export function Var(name: string, type: string): T.IdentLiteral {
  return { type: 'IdentLiteral', value: name, returnType: type };
}

export function NumberLiteral(value: number): T.NumberLiteral {
  return { type: 'NumberLiteral', value: value.toString(), returnType: 'Num' };
}

export function StringLiteral(value: string): T.StringLiteral {
  return { type: 'StringLiteral', value, returnType: 'Str' };
}

export function BooleanLiteral(bool: boolean): T.BooleanLiteral {
  return { type: 'BooleanLiteral', value: bool ? 'True' : 'False', returnType: 'Bool' };
}

export function NullLiteral(): T.NullLiteral {
  return { type: 'NullLiteral', value: 'Null', returnType: 'Null' };
}

export function prioritize(expr: T.Expr): T.PrioritizedExpr {
  return {
    type: 'PrioritizedExpr',
    returnType: expr.returnType,
    expr,
  };
}

export function Arithmetic(
  operand1: number | string | T.Expr,
  op: '+' | '-' | '*' | '/' | '%',
  operand2: number | string | T.Expr,
): T.BinaryOpExpr {
  let operator: T.Operator;
  switch (op) {
    case '+': operator = T.Operator.Plus;     break;
    case '-': operator = T.Operator.Dash;     break;
    case '*': operator = T.Operator.Asterisk; break;
    case '/': operator = T.Operator.Slash;    break;
    case '%': operator = T.Operator.Percent;  break;
  }

  let expr1: T.Expr, expr2: T.Expr;

  if (typeof operand1 === 'number')
    expr1 = NumberLiteral(operand1);
  else if (typeof operand1 === 'string')
    expr1 = { type: 'IdentLiteral', value: operand1, returnType: 'Num' };
  else
    expr1 = operand1;

  if (typeof operand2 === 'number')
    expr2 = NumberLiteral(operand2);
  else if (typeof operand2 === 'string')
    expr2 = { type: 'IdentLiteral', value: operand2, returnType: 'Num' };
  else
    expr2 = operand2;

  return {
    type: 'BinaryOpExpr',
    operator,
    returnType: 'Num',
    expr1,
    expr2,
  };
}
