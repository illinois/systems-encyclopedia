<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Endianness

**Endianness** is a property specified the [instruction set architecture](../isa) (ISA) of a device that defines how that device orders bytes in multi-byte data types. The two types of endianness are big-endian order and little-endian order. Endianness is an important property to consider to ensure that programs are portable across different devices and is important for computer networking. We will discuss how the types of endianness work and we will discuss why endianness is important for networking. 

## Big-endianness

In **big-endian** order, the most significant byte of a multi-byte piece of data is stored in the lowest allocated memory address, with the rest of the bytes stored in higher memory addresses by reverse order of significance. Let's consider the example of a four byte integer with a byte sequence of `0A,0B,0C,0D`; under a big-endian scheme, the integer would be stored in memory as follows<sup>1</sup>:

![img](../static/endianness/bigendian.png)

While many ISAs feature support for reading and addressing data in big-endian format (see bi-endianness below), the vast majority of modern ISAs are not exclusively big-endian or big-endian by default<sup>2</sup>.

## Little-endianness

**Little-endian** order stores bytes in the reverse order from big-endian order, storing the least significant byte in the lowest possible memory address, with the remaining bytes stored in higher memory addresses by order of significance. Let's consider the same example of `0A,0B,0C,0D`, which would be stored in memory as follows<sup>1</sup>:

![img](../static/endianness/littleendian.png)

Little-endian order is significantly more common in modern ISAs than big-endian, being used in the largest ISA families. Specifically, little-endian is used in x86 and is typically the default setting for ARM machines<sup>3</sup>.

## Bi-endianness

Many modern ISAs feature bi-endianness, which allows processors to address data in both big-endian and little-endian format. The default order that the ISAs reads and writes in varies depending the ISA, and each ISA will specify its own way to configure byte ordering.

## Endianness in C

We can demonstrate how endianness can affect program behavior by writing a small C program that looks at each byte of a multi-byte data type. Specifically, we will read each byte in a 4-byte integer and compare their order across a big-endian and little-endian system:

```c
#include <stdio.h>

int main() {
  // create an integer with byte sequence 1,2,3,4
  int x = 4 + (3 << 8) + (2 << 16) + (1 << 24);
  char* byte = (char *)&x; // Create a pointer to point to the lowest addressed byte of `x`
  printf("%d\n", *byte);
  printf("%d\n", *(byte + 1));
  printf("%d\n", *(byte + 2));
  printf("%d", *(byte + 3));
  return 0;
}
```

On a big-endian system, this program would print:
{% output %}
1
2
3
4
{% endoutput %}

On a little-endian syste, this program would print:
{% output %}
4
3
2
1
{% endoutput %}

## Endianness in networking

Because not all networking devices feature the same byte order, many networking standards define a **network byte order**, a uniform byte order that network addresses are transferred in across a network, and **host byte order**, which describes the endianness of local devices in a network. Network byte order does not explicitly have to be big-endian, but since the TCP/IP protocol specifies network byte order as being big-endian, network byte order is overwhelmingly implemented as being big-endian. Host byte order obviously is uniform across all protocols as since it is device-specific.

C defines the `htonl` and `ntonl` functions for converting 32-bit data types from host to network byte order and vice versa. For big-endian machines, these functions will have no effect, as in C network byte order is implemented as being big-endian, but for little-endian systems the byte order of the input will be reversed.

<hr class="solid">
1: Image courtesy of R. S. Shaw via Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=2974661

2: See [here](https://en.wikipedia.org/wiki/Comparison_of_instruction_set_architectures) for a comparison of endianness in different ISAs.
3: https://developer.arm.com/documentation/den0013/d/Porting/Endianness
