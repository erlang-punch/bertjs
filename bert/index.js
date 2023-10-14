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
const BERT_ATOM_EXT = 100;

/**
 * Decodes an ETF/BERT payload. This function can return differend
 * types based on its input.
 *
 * @param {ArrayBuffer} payload Data to decode
 */
function decode(payload) {
    if (Array.isArray(payload)) {
        let buffer = array_to_array_buffer(payload);
        let view = new DataView(buffer);
        return decode_header(view);
    }
    if (payload.name === 'ArrayBuffer') {
        let view = new DataView(buffer);
        return decode_header(view);
    }
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
    return decode_inner(next_view);
}

/**
 * Decodes inner terms from the payload.
 *
 */
function decode_inner(view) {
    let identifier = view.getUint8(view);
    switch (identifier) {
    case undefined:
        if (view.byteOffset === 1)
            return null;
    case BERT_ATOM_EXT:
        let next_view = update_view(view, 1);
        return decode_atom_ext(next_view);
    default:
        throw new TypeError(`Unsupported type found with code ${identifier}`);
    }
}

/**
 * Decodes an ATOM_EXT term.
 *
 * @param {view} A DataView object.
 * @returns {view} An updated view with new offset.
  */
function decode_atom_ext(view) {
    let length = view.getUint16(view);
    let data_view = update_view(view, 2);
    let atom = "";
    for (let i=0; i<length; i++) {
        let c = data_view.getUint8(i);
        atom += String.fromCharCode(c);
    }
    // let next_view = update_view(data_view, length);
    // return next_view;
    return atom;
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
