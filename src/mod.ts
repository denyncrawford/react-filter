// deno-lint-ignore-file no-unused-vars
// @deno-types="npm:@types/qs@6.9.15"
import qs from "qs";
// @deno-types="npm:@types/react@^18.0.0"
import {
  type ChangeEvent,
  type HTMLProps,
  useMemo,
  useRef,
  useState,
} from "react";

import { CommonSerializers } from "./io.ts";

import {
  type IControllerFilter,
  type IFilerProps,
  type IRegisterProps,
  type IFilterCommonOutput,
  type IControl,
  IOType,
} from "./types.ts";
import type { ICustomIO } from "./types.ts";

/**
 * This is the main function that returns the filtering component
 * @param params {@link IFilerProps} - The props that are passed to the filter hook
 * @returns Hook handlers and read-only values
 */
export const useFilter = (params?: IFilerProps) => {
  const filters = useRef<IControllerFilter[]>(params?.defaultValues || []);

  /**
   * This is the object that contains the IOs that are used to serialize and deserialize the values
   * @type IOs - {@link ICustomIO}[]
   */
  const IOs = useMemo(() => {
    return {
      ...params?.customIO?.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.name]: cur.io,
        };
      }, {}),
      ...CommonSerializers,
    };
  }, [params?.customIO]);

  const [_re, _forceRerender] = useState(0);

  const _registeredFields = useRef<HTMLProps<HTMLInputElement>[]>([]);

  const _isRegistered = (name: string) => {
    return _registeredFields.current.find((f) => f.name === name);
  };

  const _setValue = (filter: IControllerFilter) => {

    const filterType = filter.type || IOType.text


    const serializedDefault: IControllerFilter = {
      ...filter,
      type: filterType,
      ...IOs[filterType].serialize({
        // @ts-ignore - TODO: Fix this
        v: filter.value,
        // @ts-ignore - TODO: Fix this
        k: filter.name,
      }),
    };

    return filters.current.length === 0
      ? [serializedDefault]
      : filters.current.find((f) => f.name === serializedDefault.name)
      ? filters.current.map((f) => {
          return f.name === serializedDefault.name
            ? { ...f, ...serializedDefault }
            : f;
        })
      : [...filters.current, serializedDefault];
  };

  const _setValues = (values: IControllerFilter[]) => {
    return filters.current.map((filter) => {
      if (values.find((f) => f.name === filter.name)) {
        return {
          ...filter,
          ...IOs[filter.type!].serialize({
            // @ts-ignore - TODO: Fix this
            v: values.find((f) => f.name === filter.name)?.value,
            // @ts-ignore - TODO: Fix this
            k: filter.name,
          }),
        };
      }
      return {
        ...filter,
        ...IOs[filter.type!].serialize({
          // @ts-ignore - TODO: Fix this
          v: filter.value,
          // @ts-ignore - TODO: Fix this
          k: filter.name,
        }),
      };
    });
  };

  const _getRawFilterAsKeyValue = <T>(
    filter: IControllerFilter
  ): IFilterCommonOutput<T> => {
    const value = IOs[filter.type!].deserialize({
      key: filter.name,
      value: filter.value as T extends string ? T : string,
    });
    return {
      key: filter.name,
      value: value as T,
      label: filter.displayName || filter.name,
    };
  };

  /**
   * This function sets the value of a filter
   * @param filter {@link IControllerFilter} - The filter to set the value of
   */

  const setValue = (name: string, value: unknown) => {
    const filter = filters.current.find((f) => f.name === name);
    if (filter) {
      const newFilters = _setValue({
        ...filter,
        value,
      });

      filters.current = newFilters;
      _forceRerender((prev) => prev + 1);
    }
  };

  /**
   * This function sets the values of multiple filters
   * @param values {@link IControllerFilter}[] - The filters to set the values of
   */
  const setValues = (values: IControllerFilter[]) => {
    const newFilters = _setValues(values);
    filters.current = newFilters;
    _forceRerender((prev) => prev + 1);
  };

  /**
   * This function gets the value of a filter
   * @param name - The name of the filter to get the value of
   * @returns The value of the filter
   */
  const watch = (name: string) => {
    const filter = filters.current.find((filter) => filter.name === name);
    const io = IOs[filter?.type!];
    if (filter) {
      return _getRawFilterAsKeyValue<ReturnType<typeof io.deserialize>>(filter);
    }
    return {
      key: name,
      value: undefined,
    };
  };

  /**
   * This function returns the de-serialized values of the filters
   * @returns Array - {@link IFilterCommonOutput}[] - The serialized values of the filters
   */
  const deSerializedValues = useMemo(() => {
    return filters.current
      .filter((f) => f.value !== undefined)
      .map(_getRawFilterAsKeyValue);
  }, [filters.current, _re]);

  /**
   * This function returns the serialized values of the filters
   * @returns Array - {@link IFilterCommonOutput}[] - The serialized values of the filters
   */
  const serializedValues = useMemo(() => {
    return filters.current
      .filter((f) => f.value !== undefined)
      .map((f) => ({
        key: f.key,
        value: f.value,
        label: f.displayName || f.name,
      }));
  }, [filters.current, _re]);

  /**
   * This is the object that contains the methods to register and control the filters
   * @type Control - {@link IControl}
   */
  const control = useRef<IControl>({
    registeredFields: _registeredFields,
    register: (props) => {
      const registered = _isRegistered(props.name);

      if (registered) {
        return registered;
      }

      const newFilter = _setValue({
        ...props,
        value: props.defaultValue || props.value,
      });
      filters.current = newFilter;

      const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value =
          props.type === "boolean"
            ? e?.target?.checked
            : e?.target?.value || undefined;
        setValue(props.name, value);
      };

      const payload = {
        name: props.name,
        checked:
          (props.type === "boolean" &&
            filters.current.find((f) => f.name === props.name)?.value ===
              "Yes") ||
          undefined,
        onChange,
      };

      _registeredFields.current.push(payload);

      return payload;
    },
  });

  /**
   * This function registers a filter
   * @param props {@link IRegisterProps} - The props to register the filter with
   * @returns The registered filter
   */
  const register = (props: IRegisterProps): HTMLProps<HTMLInputElement> => {
    return control.current.register(props);
  };

  /**
   * This function creates a search string from the filters
   * @returns string - The search string
   */
  const createSearchParams = (filters: IControllerFilter[]) => {
    const deserializedFilters = filters
      .map((f) => ({
        ...f,
        value: IOs[f.type!].deserialize({
          key: f.name,
          value: f.value as string,
        }),
      }))
      .map((f) => {
        if (
          typeof f.value === "string" ||
          typeof f.value === "number" ||
          typeof f.value === "boolean"
        ) {
          return `${f.key}=${f.value}`;
        }
        return qs.stringify({
          [f.key!]: f.value,
        });
      })
      .join("&");
    return deserializedFilters ? `?${deserializedFilters}` : "";
  };

  /**
   * This computed value returns the search string of the filters
   * @returns string - The search string
   */
  const searchString = useMemo(() => {
    return createSearchParams(
      filters.current.filter((f) => f.value !== undefined)
    );
  }, [deSerializedValues]);

  return {
    filters,
    control,
    searchString,
    serializedValues,
    deSerializedValues,
    setValue,
    register,
    setValues,
    watch,
  };
};
