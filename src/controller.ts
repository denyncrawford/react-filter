// deno-lint-ignore-file no-explicit-any
/**
 * This module contains the controller component
 * A react component that allows you to create search filters for your react application, using a simple api and input driven by default.
 * @module
 */


import type { IRegisterProps, IControl } from "./types.ts";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";


/**
 * Pops for the controller field
 * @param props - Pops for the controller field
 */
export interface IControllerFieldPops {
  onChange: (value: unknown) => void;
  value: string | number | readonly string[] | undefined;
  checked: boolean;
}

/**
 * Renders the controller field, this is util when you have a custom input that needs to be registered
 * @param props - Renders the controller field
 */
export const Controller = (props: {
  control: { current: IControl };
  render: (field: IControllerFieldPops) => JSX.Element;
} & IRegisterProps) => {
  const found = props.control.current.register(props);
  return /*#__PURE__*/_jsx(_Fragment, {
    children: found && props.render({
      onChange: value => {
        let _found$onChange;
        (_found$onChange = found.onChange) === null || _found$onChange === void 0 || _found$onChange.call(found, {
          target: {
            value,
            checked: !!value
          }
        } as any);
      },
      value: found.value,
      checked: !!found.checked
    })
  });
};