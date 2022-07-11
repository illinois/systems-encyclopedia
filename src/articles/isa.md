<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<head>
<style>
table {
  border: 1px solid;
}
th, td {
  border: 1px solid;
  vertical-align: top;
}
</style>
</head>

# Instruction Set Architectures (ISAs)

The **instruction set architecture** (ISA) of any computer processor is a specification for the capabilities and functionalities of that processor. Broadly, an ISA is the lowest-level interface defining how the hardware and the software will interact for any computer. ISAs specify a number of important properties of computers:

- Define what instructions a processor accepts, and specify how a processor executes those instructions.
- Define what registers a processor has and what the purpose of each register is.
- Specify the size, location, and type of any inputs to a particular instruction.

The most popular ISAs currently are [x86](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/x86-architecture) and [ARM](https://en.wikipedia.org/wiki/ARM_architecture_family), although open-source ISA specifications like [RISC-V](https://en.wikipedia.org/wiki/RISC-V) are increasingly gaining wider adoption.

## Instructions and instruction sets

The core of any ISA is its **instruction set**, or the set of commands that any machine implementing the ISA can accept.Every instruction typically features an **opcode**, a unique numerical identifier that allows a processer to determine which instruction is used when it reads machine code, and a **mnemonic**, or a short abbreviation of the instruction (e.g. `ADD`, `SUB`, `MOV`) that is used to specify instructions in [assembly code](../assembly). Instructions will vary in structure and size depending on the ISA and the type of instruction, and the syntax of every instruction (in both machine and assembly code) is specified by the ISA. For a canonical example of a how instructions work, let's consider a simple x86 assembly program that adds two numbers:

```nasm
mov     eax, 14 ; put the value `14` into register eax
mov     ebx, 10 ; put the value `10` into register ebx
add     eax, ebx ; add the values that exist inside eax and ebx
```

Instructions also have structure when they are written in machine code. Consider MIPS32's `addi` instruction written in machine code[^1]:

![img](../static/isa/mips32instruction.png)

## Approaches to ISAs -- RISC and CISC

**Reduced instruction set computers** (RISC) and **complex instruction set computers** are the two main paradigms for developing ISAs. RISC architectures prioritize implementing a small, simple, and low-cost set of instructions that can be frequently used and re-used for a variety of different tasks. CISC architectures, by contrast, implement a larger set of instructions that vary in size and complexity, with many instructions that have unique use cases.

<table style="text-align:center">
  <tr><th>RISC</th><th>CISC</th></tr>
  <tr><td>Instructions are always 32 bits long, making [instruction pipelining](https://cs.stanford.edu/people/eroberts/courses/soco/projects/risc/pipelining/index.html) possible</td><td>Instructions are variable length</td></tr>
  <tr><td>Much longer and less readable assembly -- less instructions increases code size</td><td>Large set of instructions leads to smaller and less complicated assembly code</td></tr>
  <tr><td>Higher upper bound on number of general purpose registers since less hardware space is dedicated to complex instructions</td><td>Lower upper bound on general-purpose registers</td></tr>
</table>

<br>

For modern ISAs, the distinction between the RISC and CISC is often blurred, as many architectures feature design decisions from both paradigms. For example, modern Intel processors (which use a CISC x86 instruction set) use a RISC hardware core with an internal decoder that converts x86 instructions into an underlying RISC microcode.

## Further reading

- [The RISC-V Instruction Set Manual](https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf)

<hr format="solid">

[^1]: Image courtesy of Chris-martin via Wikimedia Commons - http://en.wikipedia.org/wiki/Image:Mips32_addi.svg, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1362890
