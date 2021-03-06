import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { EmptyExpression } from '../constants';
import { ParserError } from '../error';

export function parseRecordLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.RecordLiteral {
  const recordName = tt.value;
  tt.next(); // Skip `ident`
  tt.next(); // Skip `{`

  const result: T.RecordLiteral = {
    type: 'RecordLiteral',
    properties: [],
    return: new DT(recordName),
  };

  const recordDef = scope.getRecord(recordName);
  const requiredPropertySet = new Set(recordDef.propertySet);
  while (true) {
    tt.skipNewlines();

    if (tt.isNot('ident'))
      ParserError(`Expect to have property name of record \`${recordName}\`, instead got token of type \`${tt.type}\``);
    const propName = tt.value;
    tt.next(); // Skip `ident`

    if (tt.isNot('colon'))
      ParserError(`Expect key-value pairs of record \`${recordName}\` to dilimited by \`colon\`, instead got token of type \`${tt.type}\``);
    tt.next(); // Skip `colon`

    if (!requiredPropertySet.has(propName))
      ParserError(`Property \`${propName}\` isn't exist in definition of record \`${recordName}\``);
    requiredPropertySet.delete(propName);
    const propDef = recordDef.getProperty(propName);
    const propValue: T.RecordPropertyValue = {
      name: propName,
      type: propDef.type,
      value: EmptyExpression,
    };

    let propValueExpr: T.Expr = EmptyExpression;
    const propValueAST: T.AST = [];
    while (true) {
      propValueExpr = parseExpr(undefined, { scope, ast: propValueAST });
      propValueAST.push(propValueExpr);
      tt.next();
      if (tt.is('comma') || tt.is('rcurly')) break;
      if (tt.is('newline')) {
        tt.skipNewlines();
        if (tt.is('rcurly')) break;
        ParserError(`Expect record to closed with \`rcurly\` or contain new properties delimited by \`comma\`, instead got token of type: \`${tt.type}\``);
      }
    }

    if (propValueExpr.return.isNotAssignableTo(propValue.type))
      ParserError(`Expect property \`${propName}\` in record \`${recordDef.name}\` to receive value of type \`${propDef.type}\`, instead got value of type \`${propValueExpr.return}\``);

    propValue.value = propValueExpr;
    result.properties.push(propValue);

    if (tt.isNot('comma') && tt.is('rcurly')) break;
    tt.next(); // Skip comma
  }

  if (requiredPropertySet.size !== 0) {
    const propArr = Array.from(requiredPropertySet);
    for (let i = 0; i < propArr.length; i += 1) {
      const propName = propArr[i];
      const propDef = recordDef.getProperty(propName);
      if (propDef.type.nullable) {
        result.properties.push({
          name: propName,
          type: propDef.type,
          value: { type: 'NullLiteral', return: DT.Null, value: 'Null' },
        });

        requiredPropertySet.delete(propName);
      }
    }

    if (requiredPropertySet.size !== 0) {
      const formattedStr = Array.from(requiredPropertySet).map(v => `\`${v}\``).join(', ');
      ParserError(`Property of record \`${recordName}\` is missing: ${formattedStr}`);  
    }
  }

  return result;
}
