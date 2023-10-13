// Copyright (c) 2023 Erlang Punch
// Copyright (c) 2023 Mathieu Kerjouan
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the “Software”), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// -------------------------------------------------------------------
//
// This Javascript module is an implementation of BERT (Binary ERlang
// Term), a subset of ETF (Erlang Term Format), mainly used to
// communicate with external entities from Erlang nodes.

// define ETF code as constant.
const BERT_START = 131;
const BERT_ATOM_EXT = 100;

// 
function decode(payload) {
    return decode_header(payload);
}

// check if the header is valid
function decode_header(payload) {
    var identifier = payload.shift(1);
    if (identifier !== BERT_START) {
        throw new TypeError("Invalid BERT header " + identifier);
    }
    return decode_inner(payload);
}

//
function decode_inner(payload) {
    var identifier = payload.shift(1);
    switch (identifier) {
    case undefined:
        return null;
    case BERT_ATOM_EXT:
        return decode_atom_ext(payload);
    default:
        throw new TypeError("Unsupported type with code " + identifier);
    }
}

// Export decode and encode functions by default.
module.exports = {
    decode
};
