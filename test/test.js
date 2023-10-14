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
    
    describe('Should have specific behaviors', () => {
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
    
    describe('Should support Atoms', () => {
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
    
    describe('Should support Boolean', () => {
        it('should decode an ATOM_EXT "undefined" to undefined', () => {
            let input = [131,100,0,9,117,110,100,101,102,105,110,101,100];
            let atom = bert.decode(input);
            let result = undefined;
            expect(atom).to.be.equal(result);
        });
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
    
    describe('Should support Integers', () => {
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

    describe('Should support Floats', () => {
        it('should decode FLOAT_EXT', () => {
            let input = [131,99,49,48, 46,49,49,48, 48,48,48,48, 48,48,48,48,
                         48,48,48,48, 48,48,48,48, 48,48,48,48, 48,101,45,48,
                         49];
            let float = bert.decode(input);
            let result = 1.011;
            expect(float).to.be.equal(result);
        });

        it('should decode NEW_FLOAT_EXT', () => {
            let input = [131,70,63,240,45,14,86,4,24,147];
            let float = bert.decode(input);
            let result = 1.011;
            expect(float).to.be.equal(result);
        });
    });

    describe('Should support BigInt', () => {
        it('should decode SMALL_BIG_EXT', () => {
            let input = [131,110,20,0, 199,113,28,199, 113,156,185,123,
                         128,138,160,75, 22,67,46,219, 76,61,242,1];
            let bigint = bert.decode(input);
            let result = 11111111111111111111111111111111111111111111111n;
            expect(bigint).to.be.equal(result);
        });
        // produce infinity.
        // it('should decode SMALL_BIG_EXT', () => {
        //     let input = [131,111,0,0, 1,170,0,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,28, 199,113,28,199, 113,28,199,113,
        //                 28,199,113,86, 181,85,216,126, 190,129,73,45,
        //                 236,137,236,120, 63,216,204,64, 87,88,56,180,
        //                 171,133,109,87, 105,40,79,114, 33,82,170,255,
        //                 40,135,141,215, 217,61,130,8, 201,255,237,51,
        //                 64,108,111,63, 131,75,204,252, 202,58,92,3,
        //                 20,203,152,50, 152,154,67,125, 164,102,255,97,
        //                 236,203,100,30, 147,131,31,92,
        //                 156,252,109,234, 236,133,105,140,
        //                 221,30,158,207, 245,119,120,214,
        //                 230,40,138,47, 74,160,15,101, 221,243,203,223,
        //                 203,182,29,98, 95,126,40,190, 18,87,235,233,
        //                 58,165,211,199, 76,156,155,110, 57,105,74,67,
        //                 25,205,26,206, 94,8,102,168, 34,137,55,254,
        //                 140,15,61,25, 60,228,17,222, 52,102,119,140,
        //                 51,29,216,67, 171,241,0,127, 212,153,114,173,
        //                 215,234,85,199, 187,232,83,103,
        //                 120,187,223,18, 142,89,111,254,
        //                 250,32,223,125, 117,30,49,63, 93,25,96,115,
        //                 24,159,129,237, 232,209,73,252, 3,111,35,89,
        //                 244,70,161,155, 55,116,197,39, 82,210,74,185,
        //                 190,164,230,234, 108,246,143,119,
        //                 121,133,177,30, 138,38,38,168, 47,71,252,242,
        //                 170,101,0,76, 39,14,73,25, 78,242,33,92,
        //                 161,187,60,138, 92,162,128,132, 39,114,243,70,
        //                 196,99,101,108, 210,197,192,66, 25,16,92,187,
        //                 155,205,105,122, 238,108,108,53,
        //                 35,103,249,77, 11,158,172,164, 18,139,93,63,
        //                 114,209,99,127, 3];
        //     let string = bert.decode(input);
        //     let result = 1n;
        //     expect(string).to.be.equal(result);
        // });
    });
    
    describe('Should support String', () => {
        it('should decode a STRING_EXT', () => {
            let input = [131,107,0,4,116,101,115,116];
            let string = bert.decode(input);
            let result = "test";
            expect(string).to.be.equal(result);
        });
    });
    
    describe('Should support Binary', () => {
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

    describe('Shoud support List', () => {
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
    
    describe('Should support Map', () => {
        it('should decode an empty MAP_EXT', () => {
            let input = [131,116,0,0,0,0];
            let map = bert.decode(input);
            let result = new Map();
            expect(map).to.be.deep.equal(result);
        });
        it('should decode a MAP_EXT with integers as key and value', () => {
            let input = [131,116,0,0,0,1,97,1,97,2];
            let map = bert.decode(input);
            let result = (new Map()).set(1,2);
            expect(map).to.be.deep.equal(result);
        });
        it('should decode a MAP_EXT with atoms as key and value', () => {
            let input = [131,116,0,0,0,1,100,0,1,97,100,0,1,98];
            let map = bert.decode(input);
            let result = (new Map()).set("a","b");
            expect(map).to.be.deep.equal(result);
        });
        it('should decode a MAP_EXT with list as key and value', () => {
            let input = [131,116,0,0,0,1,106,106];
            let map = bert.decode(input);
            let result = (new Map()).set([],[]);
            expect(map).to.be.deep.equal(result);
        });
        it('should decode a MAP_EXT with (empty) binary as key and value', () => {
            let input = [131,116,0,0,0,1,109,0,0,0,0,109,0,0,0,0];
            let map = bert.decode(input);
            let result = (new Map()).set(new Uint8Array(), new Uint8Array());
            expect(map).to.be.deep.equal(result);
        });
        it('should decode a MAP_EXT with random kind of term as key and values', () => {
            // #{ a => 1, [] => "b", <<>> => #{} }
            let input = [131,116,0,0, 0,3,100,0, 1,97,97,1,
                         106,107,0,1, 98,109,0,0, 0,0,116,0,
                         0,0,0];
            let map = bert.decode(input);
            let ret = () => {
                let m = new Map();
                m.set('a', 1);
                m.set([], 'b');
                m.set(new Uint8Array(), new Map());
                return m;
            };
            let result = ret();
            expect(map).to.be.deep.equal(result);
        });
    });
    
    /*
    describe('Should support Tuple', () => {
        it('should decode an empty SMALL_TUPLE_EXT', () => {
            let input = [131,104,0];
            let tuple = bert.decode(input);
            let result = [];
            expect(tuple).to.be.deep.equal(result);
        });
        it('should decode a SMALL_TUPLE_EXT with atoms', () => {
            let input = [131,104,2,100,0,2,111,107,100,0,4,116,101,115,116];
            let tuple = bert.decode(input);
            let result = ??? []
        });
        it('should decode an empty LARGE_TUPLE_EXT', () => {
            let input = [131,105,0,0,0,0];
            let tuple = bert.decode(input);
            let result = ??? []
        });
        it('should decode a LARGE_TUPLE_EXT with atoms', () => {
            let input = [131,105,0,0, 1,1,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0, 97,0,97,0, 97,0,97,0,
                          97,0,97,0, 97,0,97,0];
            let tuple = bert.decode(input);
            let result = ??? []
        });
    });
    */
});
