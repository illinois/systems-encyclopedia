---
title: Pipes

date: 2022-09-16

authors:
- kennel2
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Pipes

**Pipes** are a form of [inter-process communication](../ipc) implemented in many modern operating systems that uses unstructured byte-streams to transmit data between processes. Here, we will discuss how pipes work in Unix-like operating systems, and how to use them in a modern Unix shell and the C language.

## Overview of pipes

Pipes are one of the most simple-to-grasp IPC methods because their naming reflects their behavior well. Here, the bytes of data that are sent via the pipe function much like how water flows through a pipe, and intuitively we can view their structure as being analogous to a physical pipe:

![img](../static/pipes/pipediagram.png)

Just like physical pipes, data pipes are:
- **Order-preserving**: The process that is receiving data will receive it in the order that it is sent. For example, if `"abc"` is written to a pipe, that data will always be read as `"abc"` and not `"cba"`. 
- **Unidirectional**: The process that reads from the pipe cannot write to the pipe and the process that writes to the pipe cannot read it. Other non-Unix operating systems may implement pipes as being bidirectional.
- **Unstructured**: The operating system does enforce a specific format that the data must be transmitted in, other than that the most basic unit of data is a byte. Two processes can choose to agree on a specific data formatting as they choose, however.
- **Volume-limited**: Just like how a physical pipe can only hold a certain amount of water at one time, the [Linux man page](https://man7.org/linux/man-pages/man7/pipe.7.html) for the `pipe()` syscall dictates that there cannot be more than 16 pages (65,536 bytes or ~65 KB) in a pipe at any given time. In the event that a process attempts to overfill a pipe, the operating system will send a blocking call to the writing process (halting the process) until the pipe is flushed or another process reads data from the pipe. 

A couple of other notable properties of pipes are that they are:
- **Inherited**: If a process opens up a pipe and then spawns a child process with `fork()`, that child process will inherit all of the file descriptors established by the parent process.
- **Difficult to find**: If two processes are unrelated (meaning that they are not parent and child), then it is up to both of those processes to find the file descriptors for the process it is attempting to get data to or from. In practical terms, it is a very involved process to use pipes between unrelated processes, and we don't recommend using regular pipes to have unrelated processes communicate.

Every process in Linux establishes a pipe by using the `pipe()` syscall. When making a `pipe()` syscall, a process will send the OS two unique numerical identifiers (commonly known as **file descriptors**), specifying the read and the write end of the pipe. When a child process is spawned, its read end will be the write end of its parent process and vice versa.

![img](../static/pipes/pipefddiagram.png)

Because the piping is a message passing style of IPC, the kernel technically acts as an intermediary and buffers the data for the receiving process, but since that is not particularly important to how we are thinking about pipes currently, we have ommitted that detail from our diagram.

### Named pipes

Unix-like operating systems also implement [named pipes](https://en.wikipedia.org/wiki/Named_pipe) (also known as **FIFO**s), which are distinct from the pipes we have discussed earlier in that a named pipe physically exists within a machine's operating system. Pipes like the ones that we have described before, which do not have a name in an operating file system are called **anonymous pipes**. Named pipes are useful because they can be immediately known by all processes running on a system, making it much easier for two unrelated processes to communicate. For now, we will not cover named pipes in further detail, but you can read more about them in the article linked above.

## Using pipes in C

The [specification](https://man7.org/linux/man-pages/man2/pipe.2.html) for the `glibc` wrapper of `pipe()` is as follows:

```c
int pipe(int pipefd[2]);
```

`pipe()` takes the following arguments:
- `pipefd` a two-entry integer array. When `pipe` is called, it will fill both entries of the array with file descriptors of a new pipe. The first entry of the pipe will be the file descriptor for the read end of the pipe, and the second will be the file descriptor for the write end.

`pipe()` will return an exit code, with a `-1` denoting an error and a `0` denoting success.

### Example

Here, we'll quickly demonstrate how to use pipes in C by piping data between a child and a parent process, with the child process sending the capitalized version of the data from the parent process to `stdout`:

```c
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
  int pipefd[2];
  pipe(pipefd); // establish the pipe

  pid_t cpid = fork(); // create a child process
  if (cpid == 0) { // if we're executing on a child process, cpid is always 0
    close(pipefd[1]); // don't need the write end of our child process in the first place, close it
    char buf;
    char message[64];
    for (size_t i = 0; read(pipefd[0], &buf, 1) > 0; i++) {
      message[i] = buf + 32;
    }
    close(pipefd[0]); // we're done with the read end of our pipe, close it
    printf("\n%s", message);
    _exit(EXIT_SUCCESS);
  }
  else {
    close(pipefd[0]); // don't need the read end of this pipe
    char message[64];
    printf("message please: ");
    fgets(message, 64, stdin);
    write(pipefd[1], message, 64);
    close(pipefd[1]); // we've finished with our pipe, now close it
    wait(NULL); // wait for the child process to finish
  }
}
```
Given the input from `stdin` of `go systems`, this program will produce:

{% output %}
GO SYSTEMS
{% endoutput %}

## Using pipes in a Unix shell

You may already be familar with the `|` or `>` operators used in Unix shell programs. Analogous to pipes in C, a shell pipe will take the output of a particular command and send it as output to the command immediately following it. This is useful for chaining multiple commands together is a great way to create short scripts that accomplish a lot. We won't cover shell piping in detail, but the [Wikipedia article](https://en.wikipedia.org/wiki/Pipeline_(Unix)#Example) on piping provides a good canonical example.

## Further Reading

From the Systems Encyclopedia:

- [Inter-process Communication](../ipc)

Outside readings:
- [pipe(2)](https://man7.org/linux/man-pages/man2/pipe.2.html) - Linux manual pages
