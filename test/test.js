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

var bert = require('../bert/index.js');
var expect = require('chai').expect;

describe('Decoder', function () {
    it('should fail when a not valid ETF/BERT payload is passed', function () {
        let invalid_payload = function () { bert.decode([0,1,2,3]) };
        expect(invalid_payload).to.throw();
    });
    it('should not fail when a valid payload is passed', function () {
        let valid_payload = [131];
        expect(bert.decode(valid_payload)).to.be.equal(null);
    });
});