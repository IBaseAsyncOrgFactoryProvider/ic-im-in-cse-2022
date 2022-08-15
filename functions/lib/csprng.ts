/*
Copyright (c) 2013-2017 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import Seq from './sequin';

const DEFAULT_BITS = 128,
  DEFAULT_RADIX = 16,
  DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

export default function rand(bits: number, radix: number) {
  bits = bits || DEFAULT_BITS;
  radix = radix || DEFAULT_RADIX;

  if (radix < 2 || radix > 36)
    throw new Error('radix argument must be between 2 and 36');

  let length = Math.ceil((bits * Math.log(2)) / Math.log(radix));
  let entropy = new Uint8Array(bits);
  crypto.getRandomValues(entropy);
  let stream = new Seq(entropy);
  let string = '';

  while (string.length < length) string += DIGITS[stream.generate(radix) as number];

  return string;
}
