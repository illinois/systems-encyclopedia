---
title: Character Encoding
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

Write anything (including emojis!) into this text box and we'll display the code points for your text:

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

 

 





## ASCII Encoding

The <abbr title="American Standard Code for Information Interchange">ASCII</abbr> character encoding was one of the earliest widely adopted character encodings (first published in 1963, and updated as recently as 2017).  The ASCII code page includes all of the keys found on a standard US keyboard along side 33 control characters to denote items like a new line (ASCII code point `10`), backspace (ASCII code point `8`), and NULL (ASCII code point `0`).

As the first widely adopted character encoding, the ASCII encoding has become the standard code page for all code points with the value 0 through 127 and allows for future encodings to retain backwards compatibility with ASCII.  For example, the Unicode UTF-8 encoding treats all characters from 0 through 127 as ASCII and encodes code points above 127 in a way that the most significant bit is always `1`, resulting in every non-ASCII byte having a single byte value of at least 128 (`1000 0000`).

The full code page for ASCII is reproduced below:

<table class="table table-striped" style="background-color: white; border: solid 1px #bbb;">
  <tr>
    <th></th>
    <th>
      0x0_<br>
      0000 ____
    </th>
    <th>0x1_</th>
    <th>0x2_</th>
    <th>0x3_</th>
    <th>0x4_</th>
    <th>0x5_</th>
    <th>0x6_</th>
    <th>0x7_</th>
  </tr>
  <tr>
    <th>0x_0</th>
    <td>NUL</td>
    <td>DLE</td>
    <td>SP</td>
    <td>0</td>
    <td>@</td>
    <td>P</td>
    <td>`</td>
    <td>p</td>
  </tr>
  <tr>
    <th>0x_1</th>
    <td>SOH</td>
    <td>DC1</td>
    <td>!</td>
    <td>1</td>
    <td>A</td>
    <td>Q</td>
    <td>a</td>
    <td>q</td>
  </tr>
</table>