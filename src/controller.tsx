import { useEffect, useState } from "react";
import type {
  IRegisterProps,
  IControl,
} from "./types.ts";

interface IControllerFieldPops {
  onChange: (value: unknown) => void;
  value: string | number | readonly string[] | undefined;
  checked: boolean;
}

export const Controller = (
  props: {
    control: IControl;
    render: (field: IControllerFieldPops) => JSX.Element;
  } & IRegisterProps
) => {
  const [found, setFound] = useState();
  useEffect(() => {
    const found = props.control.register(props);
    setFound(found);
  }, [props.control, props.name]);

  return (
    <>
      {found &&
        props.render({
          onChange: found.onChange,
          value: found.value,
          checked: found.checked,
        })}
    </>
  );
};
