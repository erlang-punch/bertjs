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
 */
var bert = require('../bert/index.js');
var expect = require('chai').expect;

describe('Decoder', () => {
    describe('Default decoding behavior', () => {
        it('should fail when a not valid ETF/BERT payload is passed', () => {
            let invalid_payload = function () { bert.decode([0,1,2,3]) };
            expect(invalid_payload).to.throw();
        });

        // @TODO An empty payload AFTER a valid header SHOULD fail.
        // it('should not fail when a valid payload is passed', function () {
        //     let valid_payload = [131];
        //    expect(bert.decode(valid_payload)).to.be.equal(null);
        // });
    });
    describe('Atoms support', () => {
        it('should decode ATOM_EXT', () => {
            let input = [131,100,0,4,116,101,115,116];
            let atom_ext = bert.decode(input);
            let result = "test";
            expect(atom_ext).to.be.equal(result);
        });
        it('should decode SMALL_ATOM_EXT', () => {
            let input = [131,115,4,116,101,115,116];
            let small_atom_ext = bert.decode(input);
            let result = "test";
            expect(small_atom_ext).to.be.equal(result);
        });
        it('should decode SMALL_ATOM_UTF8_EXT', () => {
            let input = [131,119,4,240,157,149,150];
            let small_atom_utf8 = bert.decode(input);
            let result = '𝕖';
            expect(small_atom_utf8).to.be.equal(result);
        });
        it('should decode ATOM_UTF8_EXT', () => {
            let input = [131,119,255,206, 181,225,188,176, 206,180,206,173,
                         206,189,206,177, 206,185,206,188, 225,189,178,206,
                         189,206,188,206, 183,206,180,225, 189,178,206,189,
                         207,128,206,187, 225,189,180,206, 189,206,177,225,
                         189,144,207,132, 225,189,184,207, 132,206,191,225,
                         191,166,207,132,  206,191,46,206, 181,225,188,176,
                         206,180,206,173, 206,189,206,177, 206,185,206,188,
                         225,189,178,206, 189,206,188,206, 183,206,180,225,
                         189,178,206,189, 207,128,206,187, 225,189,180,206,
                         189,206,177,225, 189,144,207,132, 225,189,184,207,
                         132,206,191,225, 191,166,207,132,  206,191,46,206,
                         181,225,188,176, 206,180,206,173, 206,189,206,177,
                         206,185,206,188, 225,189,178,206, 189,206,188,206,
                         183,206,180,225, 189,178,206,189, 207,128,206,187,
                         225,189,180,206, 189,206,177,225, 189,144,207,132,
                         225,189,184,207, 132,206,191,225, 191,166,207,132,
                          206,191,46,206, 181,225,188,176, 206,180,206,173,
                         206,189,206,177, 206,185,206,188, 225,189,178,206,
                         189,206,188,206, 183,206,180,225, 189,178,206,189,
                         207,128,206,187, 225,189,180,206, 189,206,177,225,
                         189,144,207,132, 225,189,184,207, 132,206,191,225,
                         191,166,207,132, 206,191
                        ];
            let atom_utf8 = bert.decode(input);
            let result = 'εἰδέναιμὲνμηδὲνπλὴναὐτὸτοῦτο.'
                       + 'εἰδέναιμὲνμηδὲνπλὴναὐτὸτοῦτο.'
                       + 'εἰδέναιμὲνμηδὲνπλὴναὐτὸτοῦτο.'
                       + 'εἰδέναιμὲνμηδὲνπλὴναὐτὸτοῦτο';
            expect(atom_utf8).to.be.equal(result);
        });
    });
    describe('Boolean support', () => {
        it('should decode an ATOM_EXT "nil" to null', () => {
            let input = [131,100,0,3,110,105,108];
            let atom = bert.decode(input);
            let result = null;
            expect(atom).to.be.equal(result);
        });
        it('should decode an ATOM_EXT "true" to true', () => {
            let input = [131,100,0,4,116,114,117,101];
            let atom = bert.decode(input);
            let result = true;
            expect(atom).to.be.equal(result);
        });
        it('should decode an ATOM_EXT "false" to false', () => {
            let input = [131,100,0,5,102,97,108,115,101];
            let atom = bert.decode(input);
            let result = false;
            expect(atom).to.be.equal(result);
        });
    });
    describe('Integers support', () => {
        it('should decode a SMALL_INTEGER_EXT set to 0', () => {
            let input = [131,97,0];
            let integer = bert.decode(input);
            let result = 0;
            expect(integer).to.be.equal(result);
        });
        it('should decode a SMALL_INTEGER_EXT set to 255', () => {
            let input = [131,97,255];
            let integer = bert.decode(input);
            let result = 255;
            expect(integer).to.be.equal(result);
        });
        it('should decode a INTEGER_EXT set to 256', () => {
            let input = [131,98,0,0,1,0];
            let integer = bert.decode(input);
            let result = 256;
            expect(integer).to.be.equal(result);
        });
        it('should decode a INTEGER_EXT set to 2_147_483_647', () => {
            let input = [131,98,127,255,255,255];
            let integer = bert.decode(input);
            let result = 2147483647;
            expect(integer).to.be.equal(result);
        });
        it('should decode a INTEGER_EXT set to -2_147_483_648', () => {
            let input = [131,98,128,0,0,0];
            let integer = bert.decode(input);
            let result = -2147483648;
            expect(integer).to.be.equal(result);
        });
    });
    describe('String support', () => {
        it('should decode a STRING_EXT', () => {
            let input = [131,107,0,4,116,101,115,116];
            let string = bert.decode(input);
            let result = "test";
            expect(string).to.be.equal(result);
        });
    });
    describe('Binary support', () => {
        it('should decode an empty BINARY_EXT', () => {
            let input = [131,109,0,0,0,0];
            let string = bert.decode(input);
            let result = new Uint8Array(0);
            expect(string).to.be.deep.equal(result);
        });
        it('should decode a BINARY_EXT', () => {
            let input = [131,109,0,0,0,4,116,101,115,116];
            let string = bert.decode(input);
            let result = () => {
                let array = new Uint8Array(4);
                array[0] = 116;
                array[1] = 101;
                array[2] = 115;
                array[3] = 116;
                return array;
            };
            expect(string).to.be.deep.equal(result());
        });
    });
        describe('List support', () => {
        it('should decode a NIL_EXT (empty list)', () => {
            let input = [131,106];
            let string = bert.decode(input);
            let result = [];
            expect(string).to.be.deep.equal(result);
        });
        it('should decode a list of ATOM_EXT', () => {
            let input = [131,108,0,0, 0,3,100,0,
                         1,97,100,0,  1,98,100,0,
                         1,99,106];
            let list = bert.decode(input);
            let result = ["a", "b", "c"];
            expect(list).to.be.deep.equal(result);
        });
        it('should decode a list of STRING_EXT', () => {
            let input = [131,108,0,0, 0,2,107,0,
                         5,116,101,115, 116,49,107,0,
                         5,116,101,115, 116,50,106];
            let list = bert.decode(input);
            let result = ["test1", "test2"];
            expect(list).to.be.deep.equal(result);
        })
        it('should decode a list of SMALL_INTEGER_EXT and INTEGER_EXT', () => {
            let input = [131,108,0,0,0,4,97,1,97,2,97,3,98,0,0,1,0,106];
            let list = bert.decode(input);
            let result = [1,2,3,256];
            expect(list).to.be.deep.equal(result);
        });
        it('should decode a list of LIST_EXT', () => {
            let input = [131,108,0,0,0,3,106,106,108,0,0,0,2,106,106,106,106];
            let list = bert.decode(input);
            let result = [[],[],[[],[]]];
            expect(list).to.be.deep.equal(result);
        });
        it('should decode a list of BINARY_EXT', () => {
            let input = [131,108,0,0,0,2,109,0,0,0,3,1,2,3,109,0,0,0,3,4,5,6,106];
            let list = bert.decode(input);
            let binary = (array) => {
                let bin = new Uint8Array(array.length);
                for (let i=0; i<array.length; i++) {
                    bin[i] = array[i];
                }
                return bin;
            }
            let result = [binary([1,2,3]), binary([4,5,6])];
            expect(list).to.be.deep.equal(result);
        });
    });
});
