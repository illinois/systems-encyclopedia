---
title: Buffer Overflow Attacks

authors:
- kennel2
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>

# Buffer Overflow Attacks

**Buffer overflow attacks** are a class of software attack vectors created by the direct exploitation of undefined behavior caused by **buffer overflows**, which occur when a program attempts to write data to a buffer, but goes past the memory allocated for that buffer and accidentally writes to memory beyond it. 

Overflows can occur in any program that is written in a language that does not do boundary checking for operations on buffers at runtime. Therefore, buffer overflow attacks most frequently occur in programs with C and C++ source code, as neither language performs boundary checking to prevent overflows from occurring.

In practical terms, a buffer overflow can cause a number of errors with program memory that can cause a program to fail entirely, but the most notable consequence of buffer overflows is that they create a number of ways that a malicious actor can attack a system. Here, we will examine the history of buffer overflows as a security vulnerability, explain how a buffer overflow attacks work and are executed, and replicate a buffer overflow attack in C.

## History of Buffer Overflow Attacks

Buffer overflows were first documented in 1972 in a USAF study on computer security[^1], but were not notably exploited until 1988, when the [Morris worm](https://en.wikipedia.org/wiki/Morris_worm) used a buffer overflow in a Unix networking program named `finger` as one of its attack vectors. 

Despite heighted awareness among developers on the dangers of buffer overflow attacks since then, buffer overflows have remained a lingering security vulnerability, being found in range of different applications[^2]. Most notably, the [SQL slammer](https://en.wikipedia.org/wiki/SQL_Slammer) worm and the [Code Red](https://en.wikipedia.org/wiki/Code_Red_(computer_worm) worm targeted buffer overflow vulernabilities in Microsoft's SQL server and web server software respectively in 2001.

## How Do Buffer Overflow Attacks Work?

For a simple example of how buffer overflows can lead to unintended behavior, let's examine the following snippet of C code:

```c
char* s1 = malloc(4); // Not enough memory for 'E' or the null byte!
strcpy(s1, "ABCDE");
```

Here, we've allocated a buffer of four bytes and attempted to copy the string `ABCDE` into that buffer. However, because the size of the string literal that is copied is larger than the size of the buffer, the program will write into adjacent memory. After this snippet has executed, our memory model will be as follows:

![img](../static/c-strings/overflowdiagram.png)

Clearly, the lack of bounds checking when writing to memory is exploitable! If we have any program where we can write a variable length sequence of memory into a buffer that is of a fixed size, we can modify any of the memory surrounding it as we choose. Buffer overflow attacks exploit this fact, implementing a variety of methods of attack that differ depending on the operating system and architecture of the host machine, the memory region that the buffer overflow occurs in, and the goals of the attacker.

Specifically, there are two notable ways that the buffer overflow can be exploited:
1. Using the buffer overflow to modify the value of a variable located near the buffer in memory, allowing an attacker to modify the behavior of a program in a way that suits their needs.
2. Using the buffer overflow to modify either a [function pointer](https://en.wikipedia.org/wiki/Function_pointer) or the return address of a [stack frame](https://en.wikipedia.org/wiki/Call_stack) to point to a piece of malicious code that allows an attacker to gain access to a system. 

For now, we will discuss buffer overflow attacks on the stack. We will also assume that the theoretical host machine that is being attacked has an x86 architecture and is using Linux as its operating system.

### Techniques for exploiting buffer overflows

Let's consider the following vulnerable C that contains a buffer overflow in its `aux` function:

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[]) {
  aux(argv[1]);
}

void aux(char* str) {
  char buffer[50];
  strcpy(buffer, str);
  printf("%s", buffer);
  return;
}

void exploit_func_do_not_call() {
  printf("WARNING: Buffer overflow has been exploited!");
}
```

### Defending against Buffer Overflow Attacks

While the greatest defense against buffer overflow attacks is obviously to write source code that cannot have a buffer overflow in the first place, there are also a number of technological advances that have made buffer overflow attacks significantly more difficult to execute:

- Many alternatives to the C `stdlib` include safe implementations that explicitly check for buffer overflows at runtime for any functions that write to buffers.
- Compiler extensions like [Stackshield] and [Stackguard] (which have both been implemented in GNU's C/C++ compiler) implement countermeasures to prevent return addresses being modified before a subroutine exits.
- [Static analyzers](https://en.wikipedia.org/wiki/Static_program_analysis) allow developers to check for unsafe patterns in source code to stop buffer overflows before they happen.
- Advances in operating system design and chip architecture have created security features like [NX bits](https://en.wikipedia.org/wiki/NX_bit), allowing operating systems to explicitly mark portions of program memory as being non-executable, preventing malicious code from being executed at all.

## Further Reading:

[Smashing the Stack for Fun and Profit](http://phrack.org/issues/49/14.html) - Elias Levy
