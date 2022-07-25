---
title: Bitwise Operations

authors:
- kennel2
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Bitwise Operations

Bitwise operations are a set of operations on binary strings (also known as bit strings) that will evaluate and manipulate individual bits of their inputs sequentially. These operators are implemented in most high level programming languages and CPU instruction set architectures, having a wide range of use cases and being incredibly important for manipulating data at the bit level. Here, we will cover the most notable bitwise operators, explaining how they work and their applications.

## Important Bitwise Operators

### AND

Provided two equal length bit strings, the bitwise `AND` will perform the logical `AND` on each bit in the bit strings. For each bit position, if both binary strings contain a `1` in that position, `AND` will return a `1`. Otherwise, `AND` returns `0` in that position.

![img](../static/bitwise-operations/AND.gif)

Programming languages will typically implement bitwise `AND` with the `&` operator (distinct from `&&`) which supports operations over integers. Consider the following Python snippet:

```python
a = 0b100 # 4 represented in binary
b = 0b110 # 6 represented in binary
print(bin(a & b))
```
{% output %}
0b100
{% endoutput %}

### OR

Bitwise `OR` will perform logical `OR` on each bit, returning `1` if there is a `1` in either input for each bit position, returning `0` otherwise.

![img](../static/bitwise-operations/OR.gif)

Languages typically implement `OR` with the `|` operator (distinct from `||`) used on integer operations:

```python
a = 0b100
b = 0b110
print(bin(a | b))
```
{% output %}
0b110
{% endoutput %}

### XOR

`XOR` will perform a logical `XOR` on each bit, returning `1` if one and only one input contains a `1` in a position, returning `0` otherwise.

![img](../static/bitwise-operations/XOR.gif)

`XOR` is implemented with the `^` operator in most languages:

```python
a = 0b100
b = 0b110
print(bin(a ^ b))
```
{% output %}
0b10
{% endoutput %}

### NOT

Given a single input bitstring, bitwise `NOT` will invert every single bit in the bit string, flipping each `1` to a `0` and vice versa.

![img](../static/bitwise-operations/NOT.gif)

Programming languages typically implement `NOT` with the `~` operator:

```python
a = 0b100
print(bin(~a))
```
{% output %}
0b011
{% endoutput %}

### Bit shifting

Most programming languages implement two operators for performing bit shifts. Given a bit string and a number `n`, the left bit shift `<<` will shift a bitstring `n` bits to the left. If the appending a `0` byte in the least significant (leftmost) position each shift. For programming languages where the underlying data type of the bit string has a fixed byte length, a left bit shift will discard the most significant (right most) bit in the string. The following example is a bit shift executed on an unsigned 4 bit number.

![img](../static/bitwise-operations/leftshift.gif)

The right bit shift will move every bit in the string `n` bits to the right, discarding the least significant bit in the bit string and appending a `0` in the most significant position. If the input bit string is a signed data type and the sign bit is set to `1` (meaning the input is negative), then some implementations will insert a `1` in the most significant position to leave the operand negative, but this is not universal. The following is a bit shift on an unsigned 4 bit number.

![img](../static/bitwise-operations/rightshift.gif)

Bit shifting is implemented with the `<<` (for left shift) and `>>` (for right shift) operators:

```python
a = 0b110
print(bin(a >> 2))

b = 0b1
print(bin(b << 3))
```
{% output %}
0b1
0b1000
{% endoutput %}

### Try it yourself!

<script>
let pad_binstring = (str, padding_amt) => {
  var s = str;
  for (let i = 0; i < padding_amt; i++) {
    s = '0' + str;
  }
  return s;
}

let calculate_bitwise_op = () => {
  var binStr1 = document.getElementById('input_1').value;
  var binStr2 = document.getElementById('input_2').value;
  binStr1 = binStr1 ? binStr1 : '0';
  binStr2 = binStr2 ? binStr2 : '0';
  let displayFormat = document.querySelector('input[name="display_format"]:checked').value
  let operation = document.querySelector('input[name="operation"]:checked').value
  let binInt1 = parseInt(binStr1, 2);
  let binInt2 = parseInt(binStr2, 2);

  var result;
  switch(operation) {
    case 'AND':
      result = binInt1 & binInt2;
      break;
    case 'OR':
      result = binInt1 | binInt2;
      break;
    case 'NOT':
      result = ~binInt1;
      break;
    case 'XOR':
      result = binInt1 ^ binInt2;
      break;
    case '<<':
      result = binInt1 << binInt2;
      break;
    case '>>':
      result = binInt1 >> binInt2;
      break;
  }

  switch(displayFormat) {
    case 'binstring':
      if (result < 0) result *= -1;
      document.getElementById('output').innerHTML = result.toString(2);
      break;
    case 'unsignedint':
      if (result < 0) result *= -1;
      document.getElementById('output').innerHTML = result;
      break;
  }
}
</script>

<table>
  <tr>
    <td style="text-align: right; padding-right: 10px; padding-bottom:20px;"><label for="input_code_point">Input 1:</label></td>
    <td><input type="text" value="101" id="input_1" oninput="calculate_bitwise_op();"></td>
  </tr>
  <tr>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px; padding-bottom:20px;"><label for="input_2">Input 2:</label></td>
    <td><input type="text" value="010" id="input_2" oninput="calculate_bitwise_op();"></td>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px;">Output:</td>
    <td><span id="output"><abbr title="Output"></abbr> </span></td>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px;">Operation:</td>
    <td>
      <input type="radio" name="operation" id="operation_AND" value="AND" checked onchange="calculate_bitwise_op();"></td><label for="operation_AND" style="padding-right: 20px">AND</label>
      <input type="radio" name="operation" id="operation_OR" value="OR" onchange="calculate_bitwise_op();"></td><label for="operation_OR" style="padding-right: 20px">OR</label>
      <input type="radio" name="operation" id="operation_XOR" value="XOR" onchange="calculate_bitwise_op();"></td><label for="operation_XOR" style="padding-right: 20px">XOR</label>
    </td>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px;">Display:</td>
    <td>
      <input type="radio" name="display_format" id="display_format_binstring" value="binstring" checked onchange="calculate_bitwise_op();"> <label for="display_format_binstring" style="padding-right: 20px">Binary</label>
      <input type="radio" name="display_format" id="display_format_unsigned" value="unsigned" onchange="calculate_bitwise_op();"> <label for="display_format_unsigned">Unsigned Integer</label>
    </td>
  </tr>
</table>

## Applications of Bitwise Operations

### Operations on bit-based data structures

Many data structures can be represented purely as a string of bits, meaning that they can easily be manipulated by bitwise operations. The the most notable examples of bit-level data structures are [bit fields](https://en.wikipedia.org/wiki/Bit_field) and [bitmaps](https://en.wikipedia.org/wiki/Bitmap), and both representations are easily modifiable and queryable via bitwise operations. To see how bitwise operations can be leveraged to manipulate and get information on bit fields, see [our](../bitfields) article on them.

### Optimizing multiplication with bit shifts

In many cases, bitwise operations can be significantly faster ways to perform certain mathematical operations instead of standard arithmetic at the CPU instruction level. Many compilers take advantage of this idea, and will have compiled binaries execute bit shifts instead of multiplication operations where doing so would optimize program runtime. In specific, we can take advantage of the idea that a left bit shift is the same as multiplying by 2 to speed up our program. Let's consider a small C program running on an x86 instruction set:

```c
int a = 2;
a = a * 16;
```

At first guess, we would expect this program to execute some multiplication instruction (in the case of x86, the instruction would be `mul` or `imul`), but if we decompile the binary of this program with `objdumb -d`, we can see that our program is actually using `shl` (x86's left bit shift instruction) to do the multiplication!

```nasm
0000000000001129 <main>:
    1129:       f3 0f 1e fa             endbr64
    112d:       55                      push   %rbp
    112e:       48 89 e5                mov    %rsp,%rbp
    1131:       c7 45 fc 02 00 00 00    movl   $0x2,-0x4(%rbp) ; int a = 2 occurs here.
    1138:       c1 65 fc 04             shll   $0x4,-0x4(%rbp) ; left shift executed here!
    113c:       b8 00 00 00 00          mov    $0x0,%eax
    1141:       5d                      pop    %rbp
    1142:       c3                      retq
    1143:       66 2e 0f 1f 84 00 00    nopw   %cs:0x0(%rax,%rax,1)
    114a:       00 00 00
    114d:       0f 1f 00                nopl   (%rax)
```

The reason why our program ultimately uses `shll` instead of simply multiplying the two numbers is because x86's bit shift instruction runs significantly faster than a multiplication instruction. The compiler leverages the fact that we can very easily multiply `a` by 16 by instead bit shifting it by 4 instead, and runs the faster instruction.

That said, using bit shifts in high-level source code generally does not provide a unique performance boost. For compiled languages, what instructions the CPU executes is determined by the compiler, and the level and form of optimization can vary wildly depending system architecture and the specific compiler that is used. In practical terms, this means that using bit shifts over multiplication is a readability concern instead of a performance concern, and programmers should not use bit shifts in place of multiplication to achieve performance.
