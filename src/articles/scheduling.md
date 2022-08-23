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

# Process Scheduling

**Process scheduling** is the act of dividing CPU time between multiple concurrent [processes](../processes). Scheduling is an important tool that allows modern computer systems to handle multiple running processes efficiently and gracefully. Here, we will examine what schedulers are, what design decisions go in to making schedulers, and give a brief overview of Linux's "Completely Fair Scheduler".

## Overview

Since there is a limit to how the number of processes that can run in parallel on a CPU, a computer system designed to handle many concurrent process needs to develop a principled way of defining which processes should run once CPU time is available. To efficiently distribute CPU time, every modern computer system is equipped with a **scheduler**, a piece of software managed by the operating system that is responsible for deciding the order in which multiple processes in the ready state should run, and how long they should run for.

Process schedulers are broadly divided into two categories; **Preemptive** schedulers allow processes that are in a running state to be interrupted mid-execution and moved back to a ready state so that another process can execute, whereas **cooperative** schedulers do not allow this. Preemptive schedulers are overwhelmingly more popular in modern operating systems since they are much better at handling multiple processes that require user interaction, although cooperative schedulers do have uses case in embedded systems design.

### Designing schedulers

Operating systems designers have to evaluate a number of different questions in order to design efficient schedulers:

- How do we minimize the average time to completion for a job and maximize the number of jobs completed per unit of time? Should we even attempt to optimize these measures?
- How do we minimize the amount of computational overhead our scheduling algorithm has by reducing context switching and the computation of the schedule itself?
- Should certain processes have priority over others? How do we measure priority?
- How do we make sure that our scheduling algorithm is fair? In other words, how do we have a reasonable assurance that every process will have an opportunity to run and avoid **starvation**?

The answers to these questions depends on the type of computer system the scheduler runs on, and there is no one-size-fits-all solution to scheduling. For now, we will attempt to give the broadest possible overview of different scheduling policies and evaluate them regardless of their use cases.

## Basic scheduling policies

To get an idea of how we design a scheuler, we will examine approaches to the questions we posed earlier by looking at some basic paradigms for process scheduling that focus on one particular element of design (priority, job completion rate, etc). Here, we'll explain how each scheduling method works and the advantages and disadvantages of each method.

### First come, first serve scheduling

**First come, first serve** (FCFS) scheduling (also known as FIFO scheduling) is the easiest and simplest solution to process scheduling. As each process transitions into a ready state, the operating system will place that process on a queue, where the first process on the queue gets executed first:

![img](../static/scheduling/fifoscheduling.gif)

| Advantages | Disadvantages |
| --- | --- | 
| FCFS scheduling is intuitive to understand and easy to implement -- it has no additional algorithmic or structural complexity outside of implementing a queue.| Because no processes are given priority based on compute time, longer-running processes can cause shorter processes to take much more time to complete than they should, lowering process throughput. |
| FCFS scheduling is inherently fair since every process is guaranteed to run eventually, making starvation impossible. | Because FCFS scheduling does not have a priority system, interactive processes that require user input will run much slower, making FCFS scheduling not fit for a modern OS. |

### Round-robin scheduling

**Round-robin** scheduling is a FIFO-like, preemptive scheduling algorithm that provides each process with a specific amount of runtime (also referred to as a time-slice). Like FIFO scheduling, processes are scheduled in a first-come, first-serve order, but in the event that the process at the front of the queue exceeds the time that it is given, it will be interrupted by the OS and moved to the back of the queue:

![img](../static/scheduling/sjfscheduling.gif)

| Advantages | Disadvantages |
| --- | --- |
| Like FCFS scheduling, round-robin scheduling is inherently fair and prevents starvation. Even if a prorcess does not run to completion, it is nevertheless guaranteed to run | Because longer processes are more liable to be halted, round-robin scheduling can artificially extend their time to complete by booting them to the back of the queue |

### Shortest job first and shortest remaining time scheduling

**Shortest job first** (SJF) is a simple, is a non-preemptive algorithm which maintains a priority queue based on shortest execution time, executing the process with the shortest execution time. Ultimately how the execution time of a process is computed varies depending on implementation:

![img](../static/scheduling/sjfscheduling.gif)

| Advantages | Disadvantages |
| --- | --- |
| At a high level, SJF is a simple and intuitively easy scheduling algorithm -- shortest processes go first, longest processes go last. | In practice, computing good estimates of process runtimes is difficult and in many cases it may be impossible to compute a sufficiently adequate estimate of a process runtime. |
| SJF maximizes process throughput -- shorter processes no longer have to wait for longer processes to finish executing, and so more processes are completed per unit of time. | While SJF is non-preemptive, it still allows starvation since newly added processes with short execution times can leapfrog longer processes and prevent them from executing. | 

**Shortest remaining time** (SRF) is a preemptive version of SJF, where processes are weighted not in terms of total execution time, but remaining time needed to complete the job (i.e. change the process to a finished state). In the event that a process with a shorter completion time than the currently running process is placed onto the ready queue, the running process will be interrupted and the shorter process will be run.

### Fixed priority scheduling

**Fixed priority** scheduling algorithms are similar to SJF and SRF, but instead of prioritizing processes via their total or remaining execution time, each process is assigned a fixed constant designating what level of priority it has in scheduling, with the process with the highest priority being executed first. This scheduling paradigm can be either preemptive or cooperative, and the priority level that each process is assigned depends on implementation:

![img](../static/scheduling/fps-diagram.svg)

| Advantages | Disadvantages | 
| --- | --- |
| Fixed priority scheduling defines a simple and idiomatic system for scheduling processes that is generic enough to where it can cover multiple ways of prioritizing processes. | Starvation is possible, since higher priority processes can leapfrog low priority processes, preventing them from running entirely. |
| | Finding a good way to assign each process the proper priority is a complex task, meaning that not every fixed priority system is equal. | 

## Linux's "Completely Fair Scheduler"

In reality, modern process schedulers do not have simplistic designs like those that we covered earlier, and they synthesize a number of design ideas in order to achieve adequate performance. As an example, let's consider Linux's process scheduler, commonly referred to as the "Completely Fair Scheduler" (CFS). The current implementation of the CFS is a round-robin style that borrows ideas from SRF scheduling and FIFO scheduling. CFS works as follows:

1. The Linux kernel maintains an internal [red-black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree) that holds a set of jobs that can be run. This tree is ordered lowest to highest by an internal measure called **`vruntime`**, which measures how much time the CPU has spent running that process total. 
2. When a new job can be run, the kernel will select the job with the lowest `vruntime` in the red-black tree (always the leftmost node) and execute that job. This job runs on a time-slice, with the length of that time-slice depending on how many processes are running.
3. If the job has not finished executing within the time-slice, the job is removed from the red-black tree and reinserted in the tree according to its new `vruntime`. If the job has finished completely, it is removed from the red-black tree.

CFS implements a number of important ideas that we have covered here. Firstly, CFS is preemptive, since each job is assigned a time slice and is interrupted when that time-slice is finished. CFS also implements a system of priority -- processes which have the lowest `vruntime` have the highest priority. Finally, CFS (by its own name) attempts to be a fair scheduler -- each process is virtually guaranteed to have some time to run, since processes that have not been run at all have the highest priority.

## Further Reading

From the Systems Encyclopedia:
- [Processes](../processes)

Outside readings:
- [Process Scheduling](https://people.cs.rutgers.edu/~pxk/416/notes/07-scheduling.html) - Paul Krzyzanowski
