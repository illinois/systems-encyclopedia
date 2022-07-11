<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Assembly Language

Assembly languages are a family of low-level programming languages that are designed to be a human-readable relative of [machine code](https://en.wikipedia.org/wiki/Machine_code), a structued binary format that is able to directly execute CPU instructions. Like machine code, assembly code is specific to every machine's [instruction set architecture](../isa), and the capabilities and functionalities of every assembly language is determined by that architecture, but unlike machine code it cannot be directly executed. While assembly is rarely used to directly write source code today, assembly is important in functioning as an intermediate language between high-level programming languages and machine code.

## Overview

Because assembly languages encompass such a broad set of programming languages that differ depending on architecture, it is difficult to specify commonalities for all assembly languages. However, there are a few key charateristics that most assembly languages share:

- Assembly code is split into discrete, single-line statements that use one execute one instruction or psuedo-instruction (see below) each.
- All assembly code is translated to machine code via an [assembler](https://en.wikipedia.org/wiki/Assembly_language#Assembler), analogous to a compiler.
- Assembly features symbolic (in other words, non-numeric) identifiers for instructions program memory locations and CPU registers, distinct from machine code which uses purely numeric representations.

It is also important to note that the correspondence of assembly to machine code is not always 1-to-1. Many assemblers implement **pseudo-instructions**, or routines that cannot be translated to a single machine instruction in machine code. 

### Compilers and Assembly

Because assembly is the lowest-level widely-used programming language, it is frequently used as an intermediate language that many high-level programming languages are compiled to. C/C++ both compile to assembly, while other high-level languages like Java and C# compile high-level code into a different intermediate language which is either than directly interpreted or compiled to machine code.

## Examples

To see how source code translates to assembly, let's consider the following C program:

```c
int main() {
  int a = 1;
  a = a * 5;
  a = a * 479;
}
```

The assembly code of this program in x86 would be as follows:

```nasm
0000000000001129 <main>:
    1129:       f3 0f 1e fa             endbr64
    112d:       55                      push   %rbp ; push the frame pointer of the function onto the stack
    112e:       48 89 e5                mov    %rsp,%rbp
    1131:       c7 45 fc 01 00 00 00    movl   $0x1,-0x4(%rbp)
    1138:       8b 55 fc                mov    -0x4(%rbp),%edx
    113b:       89 d0                   mov    %edx,%eax
    113d:       c1 e0 02                shl    $0x2,%eax
    1140:       01 d0                   add    %edx,%eax
    1142:       89 45 fc                mov    %eax,-0x4(%rbp)
    1145:       8b 45 fc                mov    -0x4(%rbp),%eax
    1148:       69 c0 df 01 00 00       imul   $0x1df,%eax,%eax
    114e:       89 45 fc                mov    %eax,-0x4(%rbp)
    1151:       b8 00 00 00 00          mov    $0x0,%eax
    1156:       5d                      pop    %rbp
    1157:       c3                      retq
    1158:       0f 1f 84 00 00 00 00    nopl   0x0(%rax,%rax,1)
    115f:       00
```
