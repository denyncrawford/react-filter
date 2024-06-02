/**
 * This module contains the controller component
 * A react component that allows you to create search filters for your react application, using a simple api and input driven by default.
 * @module
 */

// @deno-types="npm:@types/react@^18.0.0"
import { type HTMLProps, useEffect, useState } from "react";
import type { IRegisterProps, IControl } from "./types.ts";

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
export const Controller = (
  props: {
    control: IControl;
    render: (field: IControllerFieldPops) => JSX.Element;
  } & IRegisterProps
): JSX.Element => {
  const [found, setFound] = useState<HTMLProps<HTMLInputElement> | undefined>();
  useEffect(() => {
    const found = props.control.register(props);
    setFound(found);
  }, [props.control, props.name]);

  return (
    <>
      {found &&
        props.render({
          onChange: found.onChange as (value: unknown) => void,
          value: found.value,
          checked: !!found.checked,
        })}
    </>
  );
};
