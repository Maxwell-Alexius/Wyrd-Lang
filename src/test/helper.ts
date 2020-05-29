import { lex } from '../lexer';
import { parse } from '../parser';
import { Scope } from '../parser/utils';
import * as Path from 'path';
import setupBuiltinMethods from '../parser/builtin-methods';
import setupBuiltinOperators from '../parser/builtin-operators';
import { generateCode } from '../code-generator';
import { compile } from '..';
import * as T from '../types';

export function FundamentalCompileTest(
  name: string,
  options?: {
    debugParser?: boolean;
    focusedASTIndex?: number;
  },
) {
  const testSamplePath = `../samples/${name}`;
  const [folder, testCase] = name.split('/');
  const dir = Path.join(__dirname, '..', 'samples', folder);
  const debugParser = options?.debugParser ?? false;

  let program: string;
  let tokens: Array<T.Token>;
  let ast: T.AST;
  let compiled: string;
  let parseOptions: T.ParseOptions | undefined;

  describe(testCase.split('-').join(' '), () => {
    beforeAll(async () => {
      const testCase = await import(testSamplePath);
      program = testCase.program;
      tokens = testCase.tokens;
      ast = testCase.ast;
      compiled = testCase.compiled;
      parseOptions = testCase.parseOptions;
    });
  
    it('lexes the program into tokens correctly', () => {
      const result: Array<T.Token> = lex(program);
      expect(result.length).toBe(tokens.length);
      expect(result).toMatchObject(tokens);
    });
  
    it('parses the tokens into AST correctly', () => {
      let globalScope = new Scope();

      if (parseOptions?.scope)
        globalScope = parseOptions.scope(globalScope);

      const listGT = globalScope.declareGenericType('List');
      listGT.declareTypeParameter('element');
    
      setupBuiltinMethods(globalScope);
      setupBuiltinOperators(globalScope);

      const { ast: result } = parse(tokens, dir, globalScope);
      if (debugParser) {
        const index = options?.focusedASTIndex ?? 0;
        console.log(JSON.stringify(result[index], undefined, 2));
      }
      expect(result.length).toBe(ast.length);
      expect(result).toMatchObject(ast);
    });
  
    it('generates JS code from AST correctly', () => {
      const result = generateCode(ast);
      expect(result).toBe(compiled);
    });
  
    if (!debugParser) {
      it('compiles the Wyrd program into JavaScript code correctly', () => {
        const { result } = compile(program, { parseOptions, dir });
        expect(result).toBe(compiled);
      });
    }  
  });
}
