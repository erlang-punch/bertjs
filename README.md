# bertjs

A production ready implementation of BERT/ETF in Javascript (inspired
by BERT-JS).

## Usage

## Type Mapping

The goal of this implementation is to offer a 1:1 mapping between
Erlang terms and Javascript types. A client SHOULD NOT have the
possility to create atoms (except for `null`, `true` and `false`) or
special terms but a server CAN send atoms or specials terms. In fact,
special terms SHOULD raise an exception on the client side, but atoms
SHOULD BE converted to String.

| erlang term          |to| javascript type | comment |
|-----------------------||------------------|---------|
| `ATOM_EXT`            || `String`         | 
| `ATOM_UTF8_EXT`       || `String`         |
| `SMALL_ATOM_EXT`      || `String`         |
| `SMALL_ATOM_UTF8_EXT` || `String`         |
| `BINARY_EXT`          || `ArrayBuffer`    |
| `BIT_BINARY_EXT`      || `ArrayBuffer`    |
| `SMALL_INTEGER_EXT`   || `Int8`           |
| `INTEGER_EXT`         || `Int32`          |
| `LARGE_BIG_EXT`       || `BigInt`         |
| `SMALL_BIG_EXT`       || `BigInt`         |
| `FLOAT_EXT`           || `Float`          |
| `NEW_FLOAT_EXT`       || `Float`          |
| `STRING_EXT`          || `String`         |
| `LIST_EXT`            || `Array`          |
| `NIL_EXT`             || `Array`          | 
| `SMALL_TUPLE_EXT`     || `Map`            |
| `LARGE_TUPLE_EXT`     || `Map`            |
| `MAP_EXT`             || `Set`            |


| javascript type  |to| erlang term    | comments
|-------------------||-----------------|---------|
| `Null`            || `ATOM_EXT`      | encoded as `nil`
| `String`          || `STRING_EXT`    | -
| `ArrayBuffer`     || `BINARY_EXT`    | -
| `Boolean`         || `ATOM_EXT`      | encoded as `true` or `false`
| `Map`             || `LIST_EXT`      | encoded as tuple or list of tuple
| `Set`             || `MAP_EXT`       |
| `ArrayBuffer`     || `BINARY_EXT`    |
| `Array`           || `LIST_EXT`      |
| `Number`          || `NEW_FLOAT_EXT` |
| `Int8`            || `SMALL_INTEGER` |
| `Int16`           || `INTEGER_EXT`   |
| `Int32`           || `INTEGER_EXT`   |
| `BigInt`          || `LARGE_BIG_EXT` |
| `Float`           || `NEW_FLOAT_EXT` |
| `Float32`         || `NEW_FLOAT_EXT` |
| `Float64`         || `NEW_FLOAT_EXT` |


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
