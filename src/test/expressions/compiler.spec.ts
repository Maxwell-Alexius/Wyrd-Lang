import { compile } from '../..';

describe('Compiler', () => {
  it('compiles the sample program successfully', async () => {
    const { program, compiled } = await import('../../examples/sample-program');
    expect(compile(program)).toBe(compiled);
  });

  it('compiles all method invocation with all builtin methods', async () => {
    const { program, compiled } = await import('../../examples/builtin-methods');
    expect(compile(program)).toBe(compiled);
  });
});
