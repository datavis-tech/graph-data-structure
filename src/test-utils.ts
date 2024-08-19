import { expect } from 'vitest';
import { Serialized } from './types.js';

export function checkSerialized(graph: Serialized<string>) {
  expect(graph.nodes.length).toEqual(3);
  expect(graph.links.length).toEqual(2);

  expect(graph.nodes[0]).toEqual('a');
  expect(graph.nodes[1]).toEqual('b');
  expect(graph.nodes[2]).toEqual('c');

  expect(graph.links[0]?.source).toEqual('a');
  expect(graph.links[0]?.target).toEqual('b');
  expect(graph.links[1]?.source).toEqual('b');
  expect(graph.links[1]?.target).toEqual('c');
}

export function comesBefore(arr: ReadonlyArray<unknown>, a: unknown, b: unknown) {
  let aIndex = 0,
    bIndex = 0;
  arr.forEach(function (d, i) {
    if (d === a) {
      aIndex = i;
    }
    if (d === b) {
      bIndex = i;
    }
  });

  return aIndex < bIndex;
}
