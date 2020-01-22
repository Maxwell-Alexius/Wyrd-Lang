import * as T from '../types';
import { ParserError } from './error';
import { compare } from './precedence';

export function parseBinaryOpExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  prevExpr: T.Expr,
): [T.Token, T.Expr] {
  let operator: T.Operator;
  switch(curTok.value) {
    case '+': operator = T.Operator.Plus; break;
    case '-': operator = T.Operator.Dash; break;
    case '*': operator = T.Operator.Asterisk; break;
    case '/': operator = T.Operator.Slash; break;
    case '%': operator = T.Operator.Percent; break;
    default: ParserError(`Unhandled BinaryOpExpr Operator \`${curTok.value}\``)
  }

  if (prevExpr.type === 'BinaryOpExpr') {
    const precedence = compare(prevExpr.operator, operator);

    if (precedence === -1) /* Low level */ {
      [curTok, prevExpr.expr2] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr.expr2 as T.Expr);
      return [curTok, prevExpr];
    } else /* Eq or higher level */ {
      const newNode: T.BinaryOpExpr = {
        type: 'BinaryOpExpr',
        operator,
        expr1: prevExpr as T.Expr,
      };

      curTok = nextToken();
      parseExpr(newNode as T.Expr);
      return [curTok, newNode];
    }
  }

  if (prevExpr.type === 'AssignmentExpr') {
    [curTok, prevExpr.expr2] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr.expr2 as T.Expr);
    return [curTok, prevExpr];
  }

  if (prevExpr.type === 'FunctionDeclaration') {
    let parsedExpr: T.Expr;
    [curTok, parsedExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr.body.pop() as T.Expr);
    prevExpr.body.push(parsedExpr);
    return [curTok, prevExpr];
  }

  curTok = nextToken();
  const result: T.BinaryOpExpr = {
    type: 'BinaryOpExpr',
    operator,
    expr1: prevExpr,
  };

  return [curTok, parseExpr(result) as T.BinaryOpExpr];
}