/**
 * This module contains all the types of the module
 * @module
 */

// deno-lint-ignore-file no-explicit-any
import type { HTMLProps, MutableRefObject } from "react";

/**
 * This enum contains the different types of filters that can be used
 */
export enum IOType {
  text = "text",
  number = "number",
  boolean = "boolean",
  radio = "radio",
  date = "date",
  multiple = "multiple",
  record = "record",
}

/**
 * This interface defines the common input/output of a filter
 */
export interface IO<I extends unknown = string, O = unknown> {
  serialize: (value: { v: O; k: string }) => IFilterCommonOutput<I>;
  deserialize: (value: IFilterCommonOutput<I>) => O;
}

/**
 * This interface defines the common output of a filter
 */
export interface IFilterCommonOutput<T> {
  value: T;
  key: string;
  label?: string;
}

/**
 * This interface defines the controller filter
 */
export interface IControllerFilter {
  name: string;
  type?: keyof typeof IOType;
  key?: string;
  defaultValue?: unknown;
  displayName?: string;
  validate?: (value: unknown) => boolean;
  value?: unknown;
}

/**
 * This interface defines the register method props
 */
export interface IRegisterProps
  extends Omit<IControllerFilter, "key" | "value"> {}

/**
 * This interface defines the custom IO that can be used to extend filter types with custom serialization/deserialization
 */
export interface ICustomIO {
  name: string;
  io: IO<any, any>;
}

/**
 * This interface defines the main hook filer props
 */
export interface IFilerProps {
  defaultValues?: IControllerFilter[];
  customIO?: ICustomIO[];
}

/**
 * This interface defines the control object
 */
export interface IControl {
  registeredFields: MutableRefObject<HTMLProps<HTMLInputElement>[]>;
  register: (props: IControllerFilter) => HTMLProps<HTMLInputElement>;
}

/**
 * This interface defines the main filter hook return value
 */
export type UserFilter = (props: IFilerProps) => {
  filters: IControllerFilter[];
  register: (props: IControllerFilter) => HTMLProps<HTMLInputElement>;
  displayValues: {
    key: string;
    value: any;
  }[];
  setValue: (name: string, value: unknown) => void;
  setValues: (values: IControllerFilter[]) => void;
  getValue: (name: string) => unknown;
};
