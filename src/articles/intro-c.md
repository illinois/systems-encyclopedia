---
title: The C Programming Language - An Introduction

date: 2022-08-30

authors:
- kennel2
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# The C Programming Language - An Introduction

C is a general purpose low-level programming language developed in 1972 by Dennis Ritchie at Bell Labs. Since its inception, C has had a long history as the *de facto* systems programming language, being a mainstay in operating systems and embedded systems code. To this day, C is a widely used in a variety of modern low-level tech stacks. Outside of its speed and close mapping to machine and assembly code, C is an enticing language for systems programmers because it provides a simple, barebones set of language features that emphaseizes a "do it yourself" style of programming that gives programmers control over all parts of their programs.

C features a bracketed syntax that is similar in character to other general purpose programming languages like Java and Rust. A simple "Hello World" program is provided below as a canonical example:

```c
#include <stdio.h>

int main() {
  printf("Hello World!\n");
  return 0;
}
```

For many programmers, C is a difficult language to learn because of how barebones it is. Therefore, there are a couple of things worth making note of in C for programmers unfamiliar with low-level languages:

- C gives programmers free reign to do whatever they like when it comes to managing program memory. In many ways this is a great strength of the language, but manual memory management can be difficult and cumbersome, and lead to some nasty side effects. For an introduction to memory management, see our "[Memory Management in C](../c-memory-management)" article.
- The C standard library implements a very small set of data structures itself. Data structures like linked lists, stacks, queues, and hashmaps must all be implemented yourself in order to be used.
- C does not define an explicit string type. Instead, every string is represented as an array of characters that is terminated with a null chracter (`\0` or `NUL`). In practical terms, this means that manipulating strings in C can be more involved than in other languages given the lack of  higher-level interface. For more information on this, see our article on [strings in C](../c-strings).
- C does not have native support for object-oriented programming, only providing an interface for C does for user-defined types (`typedef`) and composite data types (`struct`).

## Compiling and running C programs

To get starting programming in C, all you'll need is a compiler. For now, we recommend using the [GNU Compiler Collection](https://gcc.gnu.org/) (`gcc`) for C development, as it is well-maintained, widely used, and open-source. Linux and MacOS users can easily install `gcc` by using their operating system's package manager. GCC does not feature direct support for Windows, so C programmers wanting to develop in native Windows should use either [MinGW](https://osdn.net/projects/mingw/) or [Cygwin](https://sourceware.org/cygwin/). That said, we also recommend using [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about), which allows a GNU/Linux environment to be run directly on top of Windows without the use of dualbooting or a virtual machine. For now, we'll assume you are using `gcc` and some command line interface to compile and run C programs.

Let's start by compiling a basic C program that adds two numbers:

```c
int sum(int a, int b) {
  return a + b;
}

int main() {
  int a = 2;
  int b = 3;
  int c = sum(a, b);
  printf("%d\n", c);
  return 0;
}
```

Assuming that this program is saved to a file named `sum.c`. We can compile this program in one of two ways:

`gcc sum.c`

`gcc sum.c -o sum.exe`

The first method of compiling will compile our `sum.c` file into a file called `a.out`, the default name for a compiled executable. The second method will compile into a file named `sum.exe`. We can run these executables by using `./a.out` or `./sum.exe`. Running either executable will produce the output:
{% output %}
5
{% endoutput %}

## Further Reading

From the Systems Encyclopedia:

- [Strings in C](../c-strings)
- [Memory Management in C](../c-memory-management)

Outside readings:

- Dennis Ritchie - "[The development of the C language](https://dl.acm.org/doi/10.1145/155360.155580)"
- Brian Kernighan and Dennis Ritchie - "[The C Programming Language](https://books.google.com/books?id=161QAAAAMAAJ)"
- [cppreference](https://en.cppreference.com/w/c)
- CS341 @ Illinois - "[C Programming, Part 1: Introduction](https://github.com/angrave/SystemProgramming/wiki/C-Programming%2C-Part-1%3A-Introduction)"
