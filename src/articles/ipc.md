---
title: Inter-process Communication

date: 2022-09-16

authors:
- kennel2
---

<head>
<style>
.center-img {
  display: block;
  width: 75%;
  margin: auto;
}
</style>
</head>

# Inter-process Communication

In order to maintain performance, modularity, and security, operating systems separate computer programs into individual units called [processes](../processes), or collections of one or more threads that execute a program that has been loaded into memory. 

<img src="../static/ipc/processtable.png" alt="processtable" class="center-img"/>
<p align="center">A process list displayed by the `htop` command</p>

In modern operating systems, processes cannot communicate with each other unless they use methods of communication that are specifically sanctioned by that operating system; **inter-process communication** (IPC) is the act of two or more processes communicating via those methods. IPC is an incredibly important feature of operating systems that creates the foundation for a number of important parts of system programming. Here, we will cover the types of IPC and how they work. 

## Types of Inter-process Communication

The two main models of IPC are the **message passing** model and the **shared memory** model. Both models of IPC are implemented in a variety of ways by the most operating systems, and IPC does not require that any two communicating processes have to be on the same machine. Most forms of IPC are widespread across most modern operating systems regardless of their [POSIX](https://en.wikipedia.org/wiki/POSIX) compliance, although they may they may be implemented differently.

### Message passing

In the message passing model, the kernel of the operating system acts as an intermediary, where any process that is sending data will specifically make a request to transfer data via a syscall, with the kernel temporarily storing that information in a buffer until the receiving process attempts to access that data. The main types of message passing IPC are:

- [Pipes](../pipes): An method that involves using unidirectional byte-streams in order to communicate data. You may have already seen piping in the form of the `|` operator in Unix shells.
- [Sockets](../sockets): Another stream-based IPC method that allows processes on different host machines to communicate with each other. Sockets are distinct from pipes in that data is typically transferred in **packets**, the most basic unit of communication in network protocols. Socket programming is incredibly vital, as it forms the basis of all communication across computer networks.
- [Message queues](https://man7.org/linux/man-pages/man7/mq_overview.7.html): A POSIX-defined [queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type))-based form of communication. Any new input to a message queue is put directly on top of the queue, and neither the sending nor the receiving process is required to interact with new data that is placed on the message queue.

<img src="../static/ipc/messagepassing.png" alt="messagepassing" class="center-img"/>

### Shared memory

In the shared memory model, a set of processes will allocate a piece of memory make a syscall to the OS designating that piece of memory as being shared. The shared memory model is unique in that because multiple processes can access the same memory space at the same time (think critical region!), shared memory requires [synchronization](../synchronization) in order to prevent race conditions. How shared memory is implemented is ultimately determined by whatever syscall the OS implements for shared memory, but a combination of `mmap` and `shm_open` are typically used for shared memory.

![img](../static/ipc/sharedmemory.png)

## Further Reading:

From the Systems Encyclopedia:
- [Sockets](../sockets)
- [Pipes](../pipes)
- [Using `mmap` in C](../mmap-c)

From outside the Systems Encyclopedia:
- [pipe(2)](https://man7.org/linux/man-pages/man2/pipe.2.html) - Linux manual pages
- [socket(2)](https://man7.org/linux/man-pages/man2/socket.2.html) - Linux manual pages
