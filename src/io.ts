/**
 * This module contains the IOs that are used to serialize and deserialize the values and data structures, is exports
 * some utils to create safe IOs that can handle undefined values
 * @module
 */


// @deno-types="npm:@types/qs@6.9.15"
import qs from "qs";
import { type IO, IOType, type IFilterCommonOutput } from "./types.ts";

/**
 * This function creates a safe IO that can handle undefined values
 * @param initialIO - The initial IO to use
 * @returns IO - The safe IO
 */
export const createSafeIO = <I, O>(initialIO: IO<I, O>): IO<I, O> => {
  return {
    serialize: ({ v, k }) => {
      return v === undefined
        ? ({
            value: undefined,
            key: k,
          } as IFilterCommonOutput<I>)
        : initialIO.serialize({ v, k });
    },
    deserialize: (pair) =>
      pair.value === undefined ? (undefined as O) : initialIO.deserialize(pair),
  };
};

/**
 * This IO serializes and deserializes strings
 */
export const textIO = createSafeIO<string, string>({
  serialize: ({ v, k }) => ({
    value: v,
    key: k,
  }),
  deserialize: ({ value }) => value,
});

/**
 * This IO serializes and deserializes numbers
 */
export const numberIO = createSafeIO<string, number>({
  serialize: ({ v, k }) => ({
    value: v.toString(),
    key: k,
  }),
  deserialize: ({ value }) => Number(value),
});

/**
 * This IO serializes and deserializes booleans
 */
export const booleanIO = createSafeIO<string, boolean>({
  serialize: ({ v, k }) => ({
    value: v ? "Yes" : "No",
    key: k,
  }),
  deserialize: ({ value }) => value === "Yes",
});

/**
 * This IO serializes and deserializes arrays
 */
export const arrayIO = createSafeIO<string, string[]>({
  serialize: ({ v, k }) => ({
    value: v.join(", "),
    key: k,
  }),
  deserialize: ({ value }) => value.split(", "),
});

/**
 * This IO serializes and deserializes objects
 */
export const objectIO = createSafeIO<string, Record<string, unknown>>({
  serialize: ({ v, k }) => ({
    value: qs.stringify({
      [k]: v,
    }),
    key: k,
  }),
  deserialize: ({ value, key }) =>
    qs.parse(value)[key] as Record<string, unknown>,
});

/**
 * This IO serializes and deserializes dates
 */
export const dateIO = createSafeIO<string, Date>({
  serialize: ({ v, k }) => ({
    value: v.toISOString(),
    key: k,
  }),
  deserialize: ({ value }) => new Date(value),
});

/**
 * This object contains the common default available IOs that are used to serialize and deserialize the values
 */
export const CommonSerializers = {
  [IOType.text]: textIO,
  [IOType.number]: numberIO,
  [IOType.boolean]: booleanIO,
  [IOType.radio]: arrayIO,
  [IOType.date]: dateIO,
  [IOType.multiple]: arrayIO,
  [IOType.record]: objectIO,
};
