import { describe, expectTypeOf, it } from 'vitest';
import { Graph } from './index.js';

/**
 * Those tests are not run. Their sole purpose is to test the types.
 */
describe('graph types', () => {
  it('should return the given node type', () => {
    const g = new Graph<string, { type: 'foo' | 'bar' }>();
    const props = g.nodes();

    expectTypeOf(props).toEqualTypeOf<string[]>();
  });

  it('should return the given edge properties type', () => {
    const g = new Graph<string, { type: 'foo' | 'bar' }>();
    const props = g.getEdgeProperties('a', 'b');

    expectTypeOf(props).toEqualTypeOf<{ type: 'foo' | 'bar' }>();
  });

  it('should only accept nodes of the given type', () => {
    const g = new Graph<{ id: string; label: string }>();
    g.addNode({ id: 'a', label: 'test' });

    // @ts-expect-error Wrong node type
    g.addNode('a');
  });

  it('should only accept properties of the given type', () => {
    const g = new Graph<string, { type: 'foo' | 'bar' }>();
    g.setEdgeProperties('a', 'b', { type: 'bar' });

    // @ts-expect-error Wrong properties type
    g.setEdgeProperties('a', 'b', { type: 'nope' });
  });

  it('should require edge properties if LinkProps is defined', () => {
    const g = new Graph<string, { type: string }>();

    g.addEdge('a', 'b', undefined, { type: 'foo' });
    g.addEdge('a', 'b', 1, { type: 'foo' });

    // @ts-expect-error
    g.addEdge('a', 'b', 1);
  });

  it('should not allow edge properties if LinkProps is never', () => {
    const g = new Graph<string>();
    g.addEdge('a', 'b');
    g.addEdge('a', 'b', 1);

    // @ts-expect-error Graph<string, never> does not allow edge properties
    g.addEdge('a', 'b', 1, 'notAllowed');
  });
});
