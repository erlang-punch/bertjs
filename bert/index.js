/**
 * Copyright (c) 2023 Erlang Punch
 * Copyright (c) 2023 Mathieu Kerjouan
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * -------------------------------------------------------------------
 *
 * This Javascript module is an implementation of BERT (Binary ERlang
 * Term), a subset of ETF (Erlang Term Format), mainly used to
 * communicate with external entities from Erlang nodes. It tries to
 * follow functional programming principle.
 *
 * -------------------------------------------------------------------
 *
 * Main data structures used in this code is ArrayBuffer and
 * DataView. The goal is to store the payload in a safe place and
 * update the view and its offset when parsing it. In case of error
 * during the processing of the payload, we can generate the position
 * of the bad value.
 *
 * See also:
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
 * - https://javascript.info/arraybuffer-binary-arrays
 *
 */

/**
 * define ETF code as constant, the full list can be easily be fetch
 * from Erlang Term Format documentation section.
 *
 * See also:
 * - https://www.erlang.org/doc/apps/erts/erl_ext_dist
 */
const BERT_START = 131;
// Atoms support
const BERT_ATOM_EXT = 100;
const BERT_SMALL_ATOM_EXT = 115;
const BERT_SMALL_ATOM_UTF8_EXT = 119;
const BERT_ATOM_UTF8_EXT = 118;

// Numbers support
const BERT_SMALL_INTEGER_EXT = 97;
const BERT_INTEGER_EXT = 98;
// const BERT_SMALL_BIG_EXT = 110;
// const BERT_LARGE_BIG_EXT = 111;
// const BERT_FLOAT_EXT = 99;
// const NEW_FLOAT_EXT = 70;

// String support
const BERT_STRING_EXT = 107;

// List support
const BERT_NIL_EXT = 106;
const BERT_LIST_EXT = 108;

// Binary support
const BERT_BINARY_EXT = 109;

// Tuple support
// const BERT_SMALL_TUPLE_EXT = 104;
// const BERT_LARGE_TUPLE_EXT = 105;

// Map support
// const BERT_MAP_EXT = 116;

/**
 * Decodes an ETF/BERT payload. This function can return differend
 * types based on its input.
 *
 * @param {ArrayBuffer} payload Data to decode
 */
function decode(payload) {
    // convert an Array to ArrayBuffer
    if (Array.isArray(payload)) {
        let buffer = array_to_array_buffer(payload);
        let view = new DataView(buffer);
        return decode_header(view);
    }

    // if it's an ArrayBuffer, just use it
    if (payload.name === 'ArrayBuffer') {
        let view = new DataView(buffer);
        return decode_header(view);
    }

    // else the data-structure is not supported.
    throw new TypeError(`Invalid type provided as arguments`);
}

/**
 * Checks if the header is present and valid.
 */
function decode_header(view) {
    let identifier = view.getUint8(view);
    if (identifier !== BERT_START) {
        throw new TypeError(`Invalid BERT header found with code ${identifier}`);
    }
    let next_view = update_view(view, 1);
    let [term, final_view] =decode_inner(next_view);
    return term;
}

/**
 * Decodes inner terms from the payload. The firt element MUST be a
 * supported term.
 *
 */
function decode_inner(view) {
    let identifier = view.getUint8(view);
    let next_view = update_view(view, 1);
    switch (identifier) {
    case undefined:
        if (view.byteOffset === 1)
            return null;
    case BERT_ATOM_EXT:
        return decode_atom_ext(next_view);
    case BERT_SMALL_ATOM_EXT:
        return decode_small_atom_ext(next_view);
    case BERT_SMALL_ATOM_UTF8_EXT:
        return decode_small_atom_utf8_ext(next_view);
    case BERT_SMALL_INTEGER_EXT:
        return decode_small_integer_ext(next_view);
    case BERT_INTEGER_EXT:
        return decode_integer_ext(next_view);
    case BERT_STRING_EXT:
        return decode_string_ext(next_view);
    case BERT_LIST_EXT:
        return decode_list_ext(next_view);
    case BERT_NIL_EXT:
        return decode_nil_ext(next_view);
    case BERT_BINARY_EXT:
        return decode_binary_ext(next_view);
    default:
        throw new TypeError(`Unsupported type found with code ${identifier}`);
    }
}

/**
 * Decodes an ATOM_EXT term. "nil" atom is converted to null, "true"
 * is converted to true and "false" is converted to false.
 *
 * @param {view} A DataView object.
 * @returns {term} A decoded Atom as String.
 */
function decode_atom_ext(view) {
    let length = view.getUint16(view);
    let data_view = update_view(view, 2);
    let atom = "";
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        atom += String.fromCharCode(c);
    }
    let next_view = update_view(data_view, length);
    switch (atom) {
    case "nil":
        return [null, next_view];
    case "true":
        return [true, next_view];
    case "false":
        return [false, next_view];
    default:
        return [atom, next_view];
    }
}

/**
 * Decodes a SMALL_ATOM_EXT term.
 *
 * @param {view} A DataView object.
 * @returns {term} A decoded Atom as String.
 */
function decode_small_atom_ext(view) {
    let length = view.getUint8(view);
    let data_view = update_view(view, 1);
    let atom = "";
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        atom += String.fromCharCode(c);
    }
    let next_view = update_view(data_view, length);
    return [atom, next_view];
}

/**
 * Decodes a SMALL_ATOM_UTF8_EXT term.
 *
 * @param {view} A DataView object.
 * @returns {term} A decoded Atom as String.
 */
function decode_small_atom_utf8_ext(view) {
    let length = view.getUint8(view);
    let data_view = update_view(view, 1);
    let atom = new Uint8Array(length);
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        atom[i] = c;
    }
    let next_view = update_view(data_view, length);
    return [new TextDecoder().decode(atom), next_view];
}

/**
 * Decodes a ATOM_UTF8_EXT term.
 *
 * @param {view} A DataView object.
 * @returns {term} A decoded Atom as String.
 */
function decode_atom_utf8_ext(view) {
    let length = view.getUint16(view);
    let data_view = update_view(view, 2);
    let atom = new Uint8Array(length);
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        atom[i] = c;
    }
    let next_view = update_view(data_view, length);
    return [new TextDecoder().decode(atom), next_view];
}

/**
 * Decodes a SMALL_INTEGER_EXT term.
 *
 * param {view} A DataView object.
 * returns {integer} An integer.
 */
function decode_small_integer_ext(view) {
    let integer = view.getUint8(view);
    let next_view = update_view(view,1);
    return [integer, next_view];
}

/**
 * Decodes an INTEGER_EXT term.
 *
 * param {view} A DataView object.
 * returns {integer} An integer.
 */
function decode_integer_ext(view) {
    let integer = view.getInt32(view);
    let next_view = update_view(view,4);
    return [integer, next_view];
}

/**
 * Decodes a STRING_EXT term. This is an Erlang string containing only
 * integers values from 0 to 255.
 *
 * param {view} A DataView object.
 * returns {string} An ASCII string.
 */
function decode_string_ext(view) {
    let length = view.getUint16(view);
    let data_view = update_view(view, 2);
    let string = new Uint8Array(length);
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        string[i] = c;
    }
    let next_view = update_view(data_view, length);
    return [new TextDecoder().decode(string), next_view];
}

/**
 * This function can't work for the moment, because we are not sharing
 * "view" state. All compound terms can't work without that. Anyway, we
 * already have the logic for practically all common terms.
 *
 */
function decode_list_ext(view) {
    let length = view.getUint32(view);
    let data_view = update_view(view, 4);
    let list = new Array();
    for (let i=0; i<length; i++) {
        let [item, next_view] = decode_inner(data_view);        
        list.push(item);
        data_view = next_view
    }
    let [n, final_view] = decode_inner(data_view);
    if (n.length === 0)
        return [list, final_view];
    else
        throw new Error("List does not contain a final NIL_EXT.");
}

/**
 * Decodes a NIL_EXT term. It will return an empty list.
 *
 * param {view} A DataView object.
 * returns {array} An empty array.
 */
function decode_nil_ext(view) {
    return [[], view];
}

/**
 * Decodes a BINARY_EXT term. It will return a TypedArray, but it
 * should probably be better to let the control on this part of the
 * code to the developer. It could be automatically converted to the
 * wanted data-structures.
 *
 * param {view} A DataView object.
 * returns {binary} An Uint8Array object.
 */
function decode_binary_ext(view) {
    let length = view.getUint32(view);
    let data_view = update_view(view, 4);
    let string = new Uint8Array(length);
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        string[i] = c;
    }
    let next_view = update_view(data_view, length);
    return [string, next_view];
}

/**
 * Updates a view with a new offset pointing to the same buffer.
 *
 * @param {view} a DataView object
 * @param {offset} a positive integer
 */
function update_view(view, offset) {
    let next_view = new DataView(view.buffer, view.byteOffset+offset);
    return next_view;
}

/**
 * Converts an Array to an ArrayBuffer. Array passed as argument MUST
 * contain only 1 byte (or 8 bits) values as integer, from 0 to 255
 * inclusive. This function will throw an exception if any other
 * values is found in the array.
 *
 * @param {array} An Array Object containing integers from 0 to 255
 * @returns {ArrayBuffer} the converted Array as ArrayBuffer
 */
function array_to_array_buffer(array) {
    let array_length = array.length;
    let buffer = new ArrayBuffer(array_length);
    let view = new DataView(buffer);
    for (let i=0; i<array_length; i++) {
        let item = array[i];
        if (item>=0 && item <= 255)
            view.setUint8(i, array[i]);
        else
            throw new TypeError(`Invalid value "${item}" "found in array`);
    }
    return buffer;
}

/**
 * Exports decode() and encode() functions.
 *
 */
module.exports = {
    decode
};
