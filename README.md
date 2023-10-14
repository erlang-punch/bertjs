# bertjs

![Erlang Punch Bertjs License](https://img.shields.io/github/license/erlang-punch/bertjs)
![Erlang Punch Bertjs Top Language](https://img.shields.io/github/languages/top/erlang-punch/bertjs)
![Erlang Punch Bertjs Workflow Status (main branch)](https://img.shields.io/github/actions/workflow/status/erlang-punch/bertjs/test.yaml?branch=main)
![Erlang Punch Bertjs Last Commit](https://img.shields.io/github/last-commit/erlang-punch/bertjs)
![Erlang Punch Bertjs Code Size (bytes)](https://img.shields.io/github/languages/code-size/erlang-punch/bertjs)
![Erlang Punch Bertjs Repository File Count](https://img.shields.io/github/directory-file-count/erlang-punch/bertjs)
![Erlang Punch Bertjs Repository Size](https://img.shields.io/github/repo-size/erlang-punch/bertjs)

A production ready implementation of BERT/ETF in Javascript (inspired
by BERT-JS).

## Usage

`node-repl` is installed and functions exported (or not) can be used
with node shell.

```sh
npm run repl
```

### Decoding

```javascript
// atom support
"test" === decode([131,100,0,4,116,101,115,116])

// erlang string support
"test" === decode([131,107,0,4,116,101,115,116])

// binary support
Uint8Array(4) [ 116, 101, 115, 116 ] === decode([131,109,0,0,0,4,116,101,115,116])

// list support
[[],[[],[]]] === decode([131,108,0,0,0,2,106,108,0,0,0,2,106,106,106,106])
```

### Encoding

```javascript
```

## Testing

```sh
npm test
```

## Type Mapping

The goal of this implementation is to offer a 1:1 mapping between
Erlang terms and Javascript types. A client SHOULD NOT have the
possility to create atoms (except for `null`, `true` and `false`) or
special terms but a server CAN send atoms or specials terms. In fact,
special terms SHOULD raise an exception on the client side, but atoms
SHOULD BE converted to String.

| erlang term           | to | javascript type | comment |
|-----------------------|----|-----------------|---------|
| `ATOM_EXT`            |    | `String`         | 
| `ATOM_UTF8_EXT`       |    | `String`         |
| `SMALL_ATOM_EXT`      |    | `String`         |
| `SMALL_ATOM_UTF8_EXT` |    | `String`         |
| `BINARY_EXT`          |    | `ArrayBuffer`    |
| `BIT_BINARY_EXT`      |    | `ArrayBuffer`    |
| `SMALL_INTEGER_EXT`   |    | `Number`         |
| `INTEGER_EXT`         |    | `Number`         |
| `LARGE_BIG_EXT`       |    | `Number`         |
| `SMALL_BIG_EXT`       |    | `Number`         |
| `FLOAT_EXT`           |    | `Number`         |
| `NEW_FLOAT_EXT`       |    | `Number`         |
| `STRING_EXT`          |    | `String`         |
| `LIST_EXT`            |    | `Array`          |
| `NIL_EXT`             |    | `Array`          | 
| `SMALL_TUPLE_EXT`     |    | `Map`            |
| `LARGE_TUPLE_EXT`     |    | `Map`            |
| `MAP_EXT`             |    | `Map`            |


| javascript type  | to | erlang term    | comments
|------------------|----|-----------------|---------|
| `Null`           |    | `ATOM_EXT`      | encoded as `nil`
| `String`         |    | `STRING_EXT`    | or binary_ext (depending of the content)
| `ArrayBuffer`    |    | `BINARY_EXT`    | -
| `Boolean`        |    | `ATOM_EXT`      | encoded as `true` or `false`
| `Map`            |    | `MAP_EXT`       |
| `Set`            |    | `LIST_EXT`      |
| `ArrayBuffer`    |    | `BINARY_EXT`    |
| `Array`          |    | `LIST_EXT`      |
| `Number`         |    | `NEW_FLOAT_EXT` |
| `Int8`           |    | `SMALL_INTEGER` | when 0 =< Int =< 255 
| `Int16`          |    | `INTEGER_EXT`   |
| `Int32`          |    | `INTEGER_EXT`   |
| `BigInt`         |    | `LARGE_BIG_EXT` |
| `Float`          |    | `NEW_FLOAT_EXT` |
| `Float32`        |    | `NEW_FLOAT_EXT` |
| `Float64`        |    | `NEW_FLOAT_EXT` |


## References and Resources

 - [`Null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
 - [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
 - [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
 - [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
 - [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
 - [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
 - [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
 - [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 - [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
 - [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
