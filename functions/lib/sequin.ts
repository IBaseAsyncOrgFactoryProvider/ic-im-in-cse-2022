/*
Copyright (c) 2012-2017 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export default class Stream {
  private _bases: { [k: string]: number[] };

  constructor(sequence: Uint8Array | number[], bits?: number) {
    bits = bits || (sequence instanceof Uint8Array ? 8 : 1);
    var binary = '',
      b: string | any[],
      i: number,
      n: number;

    for (i = 0, n = sequence.length; i < n; i++) {
      b = this._get(sequence, i).toString(2);
      while (b.length < bits) b = '0' + b;
      binary = binary + b;
    }
    let binary2 = binary.split('').map(function (b) {
      return parseInt(b, 2);
    });

    this._bases = { '2': binary2 };
  }

  generate(n: number, base?: number, inner?: boolean): number | null {
    base = base || 2;

    var value: number | null = n,
      k = Math.ceil(Math.log(n) / Math.log(base)),
      r = Math.pow(base, k) - n,
      chunk: any;

      //@ts-ignore
    loop: while (value >= n) {
      chunk = this._shift(base, k);
      if (!chunk) return inner ? n : null;

      value = this._evaluate(chunk, base);

      if (value >= n) {
        if (r === 1) continue loop;
        this._push(r, value - n);
        value = this.generate(n, r, true);
      }
    }
    return value;
  }

  _get(sequence: Uint8Array | number[], i: number) {
    return sequence[i];
  }

  _evaluate(chunk: string | any[], base: number) {
    var sum = 0,
      i = chunk.length;

    while (i--) sum += chunk[i] * Math.pow(base, chunk.length - (i + 1));
    return sum;
  }

  _push(base: number, value: number) {
    this._bases[base] = this._bases[base] || [];
    this._bases[base].push(value);
  }

  _shift(base: string | number, k: number) {
    var list = this._bases[base];
    if (!list || list.length < k) return null;
    else return list.splice(0, k);
  }
}
