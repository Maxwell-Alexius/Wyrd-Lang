import { Token } from "../types";
import tokenMap from './tokenMap';
import { keywords, regex, builtinTypes } from './constants';

function LexerError(msg: string): never {
  throw new Error(`Lexer Error: ${msg}`);
}

export function lex(code: string): Array<Token> {
  const result: Array<Token> = [];

  let index = 0;
  let currentChar = code[index];
  let peekChar = code[index + 1];

  function nextChar(skip = 1) {
    index += skip;
    currentChar = code[index];
    peekChar = code[index + 1];
  }

  while (index < code.length) {
    if (regex.whitespace.test(currentChar)) {
      if (currentChar === '\n')
        result.push({ type: 'newline', value: '\n' });
      nextChar();
      continue;
    }

    if (tokenMap.has(currentChar)) {
      if (currentChar === '=' && peekChar === '>') {
        result.push(tokenMap.get('=>') as Token);
        nextChar(2);
        continue;
      }

      result.push(tokenMap.get(currentChar) as Token);
      nextChar();
      continue;
    }

    if (regex.number.test(currentChar)) {
      let parsedNumber = '';

      do {
        parsedNumber += currentChar;
        nextChar();
      } while (regex.number.test(currentChar) && index < code.length)

      result.push({ type: 'number', value: parsedNumber });
      continue;
    }

    if (regex.letter.test(currentChar)) {
      let parsedName = '';

      do {
        parsedName += currentChar;
        nextChar();
      } while (regex.naming.test(currentChar) && currentChar !== undefined)

      if (keywords.has(parsedName)) {
        result.push({ type: 'keyword', value: parsedName });
        continue;
      }
      if (builtinTypes.has(parsedName)) {
        result.push({ type: 'builtin-type', value: parsedName });
        continue;
      }

      result.push({ type: 'ident', value: parsedName });
      continue;
    }

    LexerError(`Unhandled Character: \`${currentChar}\``);    
  }

  return result;
}