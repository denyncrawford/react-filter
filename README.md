# React Search Filters (WIP) 🔍

[![JSR](https://jsr.io/badges/@denyncrawford/react-filters)](https://jsr.io/@denyncrawford/react-filters)

A react hook that allows you to create search filters for your react application, using a simple api and input driven by default.

It comes with a set of default IOs that can be used to serialize and deserialize the values, but you can also create your own custom IOs to handle different types of values and data structures.

> **Note:** This is a work in progress and the API is still subject to change.

## Installation

This packages is only published to the jsr registry, please follow the instructions on the module page to see how to install it for your specific runtime/package manager.

## Usage

Once the package is installed, you can import the `useFilter` hook from the package and use it in your React component. Here's an example:

```tsx
import { useFilter } from "@denyncrawford/react-filters";

const MyComponent = () => {
  const { register } = useFilter();

  return (
    <div>
      <input
        type="text"
        {...register({
          name: "myFilter",
          displayName: "My Filter",
        })}
      />
      <input
        type="text"
        {...register({
          name: "myCustomIO",
          displayName: "My Custom IO",
          type: "myCustomIO",
          value: "myValue",
        })}
      />
    </div>
  );
};
```

## Custom IOs

You can create your own custom IOs to handle different types of values and data structures. Here's an example of how to create a custom IO for a `Date` value:

```tsx
import { createSafeIO } from "@denyncrawford/react-filters";

const dateIO = createSafeIO<string, Date>({
  serialize: ({ v, k }) => ({
    value: v.toISOString(),
    key: k,
  }),
  deserialize: ({ value }) => new Date(value),
});
```

In this example, we're creating a custom IO called `dateIO` that serializes and deserializes dates. The `serialize` function takes a `value` and a `key` as input, and returns an object with a `value` property that represents the serialized value and a `key` property that represents the key of the filter.

The `deserialize` function takes a `value` and returns a `Date` object that represents the deserialized value.

You can then use this custom IO in your `useFilter` hook by passing it as an argument to the `customIO` prop:

```tsx
import { useFilter } from "@denyncrawford/react-filters";

const MyComponent = () => {
  const { register } = useFilter({
    customIO: [
      {
        name: "myCustomIO",
        io: dateIO,
      },
    ],
  });

  return (
    <div>
      <DatePicker
        {...register({
          name: "date",
          type: "myCustomIO",
          defaultValue: new Date(),
          displayName: "Date",
        })}
      />
    </div>
  );
};
```

## Displaying values

You can display the values of the filters using the `serializedValues` and `deSerializedValues` properties of the `useFilter` hook. These properties are arrays that contain objects that represent the serialized and deserialized values of the filters, respectively.

Here's an example of how to display the values of the filters:

```tsx
import { useFilter } from "@denyncrawford/react-filters";

const MyComponent = () => {
  const { serializedValues, deSerializedValues } = useFilter();

  return (
    <div>
      <div>Serialized Values:</div>
      {serializedValues.map((value, index) => (
        <div key={index}>{value.value}</div>
      ))}
      <div>De-serialized Values:</div>
      {JSON.stringify(deSerializedValues)}
    </div>
  );
};
```

## Handling search

React search filters is agnostic and it doesn't have any built-in search/router functionality. You can use any query/router library of your choice to handle it. There's some strategies you can use to handle search:

- Getting deserialized values to provide to the query/router library directly.
- Using the `searchString` property of the `useFilter` hook to get the search string and pass it to the query/router library.

Here's an example of how to use the `searchString` property to get the search string:

```tsx
import { useFilter } from "@denyncrawford/react-filters";

const MyComponent = () => {
  const { searchString } = useFilter();

  return (
    <div>
      <div>Search String:</div>
      {searchString}
    </div>
  );
};
```

## API Reference

You can check the API documentation [here](https://jsr.io/@denyncrawford/react-filters/doc).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.