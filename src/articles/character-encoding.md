---
title: Character Encoding

authors:
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Character Encoding

A **character encoding** is the translation between a numeric value (eg: the binary data in memory) and a character.  The numeric value for each character is known as the character's **code point**; the full collection of all code points for a character encoding is known as that encoding's **code space** or **code page**.

For example, the code point defined by the ASCII character encoding of `A` is `65`.  This allows us to print an `A` by specifying only the code point (note that the letter `A` never appears in the code itself, but does in the output, since `65` is the data in memory needed to encode an `A`):

```c
// Printing a character directly from a code point:
printf("%c\n", 65);

// Printing a character via an integer storing the code point:
int codePoint = 65;
printf("%c\n", codePoint);

// Printing an entire word using only code points:
printf("%c%c%c%c%c%c%c%c\n", 73, 108, 108, 105, 110, 11, 105, 115);
```
{% output %}
A
A
Illinois
{% endoutput %}

<div style="background-color: hsla(13, 97%, 97%, 1); border: dashed 1px #DD3403; border-left: solid 6px #DD3403; padding-left: 10px;">

## Explore Character Encoding Yourself

<script>
let input_code_point_change = () => {
  let str = document.getElementById("input_code_point").value;
  let displayFormat = document.querySelector('input[name="input_code_point_display"]:checked').value;

  let result = "";
  for (let i = 0; i < str.length; i++) {
    let cp = str.codePointAt(i);
    if (cp >= 2048) { i++; }

    let c = String.fromCodePoint(cp);

    if (cp == 32) { c = "(SPACE)"; }
    if (cp > 128) { c += ` (UTF-8 code point U+${cp.toString(16).toUpperCase()})`; }

    if (displayFormat == "hex") {
      if (cp > 128) {
        cp = "U+" + cp.toString(16).toUpperCase();
      } else {
        cp = "0x" + cp.toString(16).toUpperCase();
      }
    }
    
    result += `<abbr title="${c}">${cp}</abbr> `;
  }

  document.getElementById("input_code_point_result").innerHTML = result;
  //document.getElementById("input_code_point_result_hex").innerHTML = result_hex;
};
</script>

Write anything (including emojis!) into this text box and we'll display the ASCII and Unicode/UTF-8 code points for your text:

<table>
  <tr>
    <td style="text-align: right; padding-right: 10px;"><label for="input_code_point">Your Text:</label></td>
    <td><input type="text" value="A" id="input_code_point" oninput="input_code_point_change();"></td>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px;">Code Points:</td>
    <td><span id="input_code_point_result"><abbr title="A">65</abbr> </span></td>
  </tr>
  <tr>
    <td style="text-align: right; padding-right: 10px;">Display:</td>
    <td>
      <input type="radio" name="input_code_point_display" id="input_code_point_dec" value="dec" checked onchange="input_code_point_change();"> <label for="input_code_point_dec" style="padding-right: 20px">Decimal Values</label>
      <input type="radio" name="input_code_point_display" id="input_code_point_hex" value="hex" onchange="input_code_point_change();"> <label for="input_code_point_hex">Hexadecimal Values</label>
    </td>
  </tr>
</table>

 </div>

 





## ASCII Encoding

The <abbr title="American Standard Code for Information Interchange">ASCII</abbr> character encoding was one of the earliest widely adopted character encodings (first published in 1963, and updated as recently as 2017).  The ASCII code page includes all of the keys found on a standard US keyboard along side 33 control characters to denote items like a new line (ASCII code point `10`), backspace (ASCII code point `8`), and NULL (ASCII code point `0`).

As the first widely adopted character encoding, the ASCII encoding has become the standard code page for all code points with the value 0 through 127 and allows for future encodings to retain backwards compatibility with ASCII.  For example, the Unicode UTF-8 encoding treats all characters from 0 through 127 as ASCII and encodes code points above 127 in a way that the most significant bit is always `1`, resulting in every non-ASCII byte having a single byte value of at least 128 (`1000 0000`).

The full code page for ASCII is reproduced below:

<style>
.se-ascii-table td div {
  margin-top: -5px; font-size: 11px;
}
</style>

<table class="table table-striped se-ascii-table" style="text-align: center; background-color: white; border: solid 1px #bbb;">
  <tr>
    <th></th>
    <th><code>0b_000</code></th>
    <th><code>0b_001</code></th>
    <th><code>0b_010</code></th>
    <th><code>0b_011</code></th>
    <th><code>0b_100</code></th>
    <th><code>0b_101</code></th>
    <th><code>0x_110</code></th>
    <th><code>0x_111</code></th>
  </tr>
  <tr>
    <td colspan="9">
      The first 32 code points (<code>0x00 - 0x1f</code>) are referred to as &quot;Control Characters&quot;.  They have no printable representation.  Instead, these characters used for text, program, and device control.
    </td>
  </tr>
  <tr>
    <th><code>0b0000_</code></th>
    <td><abbr title="0x00, NULL byte, \0">NUL</abbr><div>NULL character, <code>\0</code></div></td>
    <td><abbr title="0x01, Start of Heading">SOH</abbr></td>
    <td><abbr title="0x02, Start of Text">STX</abbr></td>
    <td><abbr title="0x03, End of Text">ETX</abbr></td>
    <td><abbr title="0x04, End of Transmission">EOT</abbr></td>
    <td><abbr title="0x05, Enquiry">ENQ</abbr></td>
    <td><abbr title="0x06, Acknowledgment">ACK</abbr></td>
    <td><abbr title="0x07, Bell, \b">BEL</abbr><div>Bell, <code>\a</code></div></td>
  </tr>
  <tr>
    <th><code>0b0001_</code></th>
    <td><abbr title="0x08, Back Space, \b">BS</abbr><div>Backspace, <code>\b</code></div></td>
    <td><abbr title="0x09, Horizontal Tab, \t">HT</abbr><div>Tab, <code>\t</code></div></td>
    <td><abbr title="0x0a, Line Feed, \n">LF</abbr><div>Line Feed, <code>\n</code></div></td>
    <td><abbr title="0x0b, Vertical Tab, \v">VT</abbr><div>Vertical Tab, <code>\v</code></td>
    <td><abbr title="0x0c, Form Feed, \f">FF</abbr><div>Form Feed, <code>\f</code></td>
    <td><abbr title="0x0d, Carriage Return, \r">CR</abbr><div>Carriage Return, <code>\r</code></td>
    <td><abbr title="0x0e, Shift Out">SO</abbr></td>
    <td><abbr title="0x0f, Shift In">SI</abbr></td>
  </tr>
</table>