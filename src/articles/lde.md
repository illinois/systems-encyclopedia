# Limited Direct Execution

**Limited direct execution** (LDE) is set of techniques implemented by modern operating systems and computer processors that restricts the privileges of running processes to maintain system security and ensure fault tolerance. Here, we will discuss why operating systems use limited direct execution, how it is implemented, and the consequences of having a system of LDE.

## Overview

We know that operating systems ultimately need to give control of the CPU to a running process in order to let the process execute the instructions it needs to run properly. But how does the operating system actually "hand over" control of the CPU to a process running on the machine so that that process can execute? 

The easiest way thinking about the problem is to develop a system of **direct execution**, where when a process needs to run, the operating system gives full control of the CPU to that process, and the process executes and eventually gives control of the CPU back to the operating system. Under this scheme, the execution of a program on an operating system using a direct execution model would look like this:

*svg goes here*

However, you might notice that the direct execution model creates some significant issues:

1. Under a direct execution model, any process that runs on our machine is never forced to give CPU control back to the operating system at any point. This means that a program that runs forever effectively takes control of a machine, since the operating system has no way to get control of the CPU back. 
2. We do not necessarily want to give full CPU control to every process that runs on the machine. For example, if any process could disable interrupts whenever it wanted. 

Given the fact that any indivivudal process can essentially seize control of the entire system as it pleases under a direct execution model, it is clear that there is a good motivation for OS developers to rein them in. 

### How direct execution is "limited"

We have already found a motivation for why we need to limit direct execution of processes, but "limiting" direct execution is a very broad problem. Sure, we can limit how a program executes, but *how* do we actually do that? Operating systems developers have developed two broad techniques:

1. Limiting what kinds of CPU instructions specific processes can execute by running processes in specific execution modes, limiting processes to a strict subset of instructions and forcing processes to request that the operating system run disallowed instructions for them by making a **syscall**.
2. Preventing processes from running for too long by developing a system of **premption** enforced by time-based CPU interrupts.

From here, we will discuss why each of these techniques is important to limited direct execution, and explain how each technique works.

## Exexcution modes

Properly restricting processes from running select instructions requires enforcement from hardware. To this end, modern processor architectures implement a set of discrete CPU execution modes, each with varying levels of access to critical instructions. In the event that a process attempts CPU will refuse to execute instrutions given to it by processes that are not running in the required mode.

The structure of any particular set of CPU modes is an architecture-specific implementation detail. To provide a canonical example, we'll take a look at x86's implementation, which involves the use of protection rings.

### Protection rings in x86 

The x86 family of architectures defines a set of **protection rings**, which are effectively a hierarchical set of CPU modes that provide incremental levels of access to more privileged CPU instructions. These protection rings are:
- Ring 0: The highest level of privilege given to a program, allowing it to execute every instruction offered by the CPU. Many OS functionalities will run in ring 0.
- Ring 1: Intended to be used for device driver functionalities.
- Ring 2: Similar to Ring 1, with less CPU access.
- Ring 3: The lowest level of CPU access. Most processes running on a machine that are not from the operating system will be run on ring 3.

<p><a href="https://commons.wikimedia.org/wiki/File:Priv_rings.svg#/media/File:Priv_rings.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Priv_rings.svg/1200px-Priv_rings.svg.png" class="center-img" width="50%" alt="Priv rings.svg"></a><br>By <a href="https://en.wikipedia.org/wiki/User:Hertzsprung" class="extiw" title="wikipedia:User:Hertzsprung">Hertzsprung</a> at <a href="https://en.wikipedia.org/wiki/" class="extiw" title="wikipedia:">English Wikipedia</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=8950144">Link</a></p>

An important thing to note is that OS not required to use every single ring as defined by the architecture. In the case of x86, most operating systems do not use rings 1 and 2 and strictly separate permissions into two discrete modes called **kernel mode** and **user mode**, where kernel mode is analogous to ring 0, and user mode is analogous to ring 3.

## Switching CPU modes with syscalls

The goal of CPU modes is not to totally restrict every non-OS process from doing any critical functionality at all, but rather to force that responsibility to be delegated to the operating system. After all, if most programs lacked the ability to read and write to disk memory, for example, most programs would be incredibly boring. 

So, whenever a program needs to use a functionality outside of the ones it can directly access, it will make a **syscall**, requesting that the operating system perform some function for it. C programmers may already be familiar syscalls like `read()`, `write()`, `open()`, and `close()`.When a syscall is made, the program gives control of the CPU to the OS and the CPU switches to kernel mode. The OS will then execute the requested instruction, return to user mode, and switch back to the process:

![img](../static/lde/lde-controlflow-diagram.svg)

In Linux, syscalls are handled via **traps**, or special interrupts that tell the operating system to halt the current process and execute a piece of code called an **interrupt handler**, which will switch CPU modes and honor the syscall. However, because the running process shouldn't be able to run the interrupt handler directly (otherwise that would undermine limited execution entirely), the operating system maintains an internal **trap table** that the calling process does not have access to, which tells the hardware where exception handlers are located so that it can run the applicable handler when a syscall is made.

## Preemption

In order to make sure that any particular process is not using a disproportionate amount of CPU time and preventing other processes from running, the hardware and OS need to cooperate to keep track of how long every process has run and provide a mechanism for returning CPU control back to the OS when a process has run too long. 

The process of an OS choosing to take a process out of its running state is commonly referred to as **preemption**. To enforce preemption, modern CPUs implement a configurable timer that triggers a hardware **interrupt** at regular intervals. This interrupt traps control of the CPU back to the operating system, allowing the operating system to choose whether or not it wants to continue running that process or not:

*gif goes here*

What the OS chooses to do when it is given a timer interrupt is ultimately up to the system [scheduler](../scheduling), the utility generally responsible for deciding what order in which multiple processes are scheduled.

## Further Reading

From the Systems Encyclopedia:
- [Scheduling](../scheduling)
- [Interrupts](../interrupts)
- [Processes](../processes)

Outside readings:
- Remzi Arpaci-Dusseau and Andrea Arpaci-Dusseau - ["Operating Systems: Three Easy Pieces" Ch 6 -- Mechanism: Limited Direct Execution](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf)
