---
title: System Virtual Machines

date: 2022-11-29
eleventyExcludeFromCollections: true

authors:
- shaffar3
---

# System Virtual Machines

**System virtual machines** allow us to run multiple isolated operating systems at the same time on a single host computer. A program called a hypervisor provides the functionality that controls the VM’s, and gives them the resources of the host computer like CPU, memory, and storage. 


## Why should I use VMs

There are many potential reasons to use VM’s:

- You can run multiple systems at the same time on the same server. On a simple server, it is only possible to run one system at a time. However with virtual machines, we can run several operating systems without needing additional hardware. This way, we are not required to buy a new server every time someone accepts a job offer. It also helps us to maximize the hardware we have, as if one system is not utilizing the entire resources available on a server, another system can use some of those idle resources.

- Some modern VM software can support almost any popular operating system in use. We can have a server running Windows, Mac, different Linux distros, and FreeBSD. Thus this may be a useful feature if we need to see how different tasks behave on different operating systems, without needing new hardware.

- They may be useful because different operating systems may support different software or have different advantages for different things. This way you can run the operating system needed for the certain task as a VM inside of the host operating system you prefer, and avoid the annoyances of dual booting.

-  If there is a disaster (power outage, hack, etc.) it is easier to recreate the system. Modern VM software typically allows you to clone the system <sup>1</sup>. They are also less dependent on the hardware, and thus are more mobile. We can move an operating system from the downed server to a working server, and that system should work fine. This is much harder to do with a non-virtualized instance of an OS.


### Great, What’s the Catch?
As with most layers of abstraction added to software, as we add more barriers and abstractions from hardware, computers become less time efficient with lower performance. If we need or value tasks that are CPU intensive, or require fast performance, VM’s may not be the optimal option<sup>2</sup>. 
Another potential problem is that the resource allocation is unpredictable. If two operating systems are running on the same hardware, [the amount of resources each user requests from the host hardware will vary throughout time](https://en.wikipedia.org/wiki/Temporal_isolation_among_virtual_machines).

## Hypervisor

System Virtual Machines are enabled by advances in hypervisor’s, which manage how the virutal machines interact with the hardware and get resources. 

There are two different types of hypervisors, defined by how far away they are from hardware. 

### Type 1
This is the bare-metal approach. The hypervisor here is the first layer directly above the hardware. In other words, this hypervisor is not running on an operating system.

<img src="../static/virtual-machines/type1.png"></img>


### Type 2
This is the hosted approach. They hypervisor here is the above an instance of the operating system. 

<img src="../static/virtual-machines/type2.png"></img>


### Why use Type 1?
- Performance and efficiency: Every layer of abstraction takes time. Thus by being no layers of abstraction away from the hardware, the hypervisor is able to allocate the resources quicker, without as much lag. Thus for this, we prefer type 1 (which is why type 1 is often used in enterprise). 
- Security: Type 2 introduces an operating system in the middle, which is a potential security risk. Type 1 hypervisors do not have this potential vulnerability.

### Why use Type 2?
- Its simpler to use and test.
- Many also have more features, as it is built on top of a fully featured operating system.

## How are Virtual Machines Different From Other Forms of Virtualizations. 

This guide discuessed system virtual machines, but other virtualizations exist. 

- Process virtual machines run a single process in its own programming environment. A prominent example of this is the Java virtual machine (JVM). Java programs run as a process on a software inside the OS (not the OS itself), and thus does not interface directly with the hardware, similar to a system virtual machine. This provides java with portability, as it will run on any system that supports running the JVM. The cost to this approach is similar to the cost of system vitual machines: we are further from the hardware! (and in this case also host operating system). Thus natively compiled C code, while less portable is often faster than equivelent java code. 

<img src="../static/virtual-machines/jvm.png"></img>

- Containers differ from VM’s in that each instance shares the same kernel as the host computer. Containers tend to have less overhead that virtual machines because they do not need their own kernel. However, some issues containerization has that system virtual machines don’t is that they are less versitile in which OS’s they can run, and the shared kernel creates a vulnerability. 

<img src="../static/virtual-machines/docker.png"></img>

Sources
1: https://www.parallels.com/blogs/ras/benefits-virtual-machines/]
2: https://cynexlink.com/latest-articles/virtual-machines-pros-cons/