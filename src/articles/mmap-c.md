<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# How to Use `mmap` in C

`mmap` is a POSIX syscall implemented in the C standard library that creates a mapping in a process's virtual address space. Here, we will cover how `mmap` works, cover some important use cases for `mmap`, and provide some hands-on examples of `mmap` in the C language.

## Overview of `mmap`

### So how does `mmap` actually work?

When a program makes a syscall to `mmap`, the kernel will designate a section of that program's memory to map to the memory of some underlying resource. Put simply, we can think of this as each memory address in the program being set to point to another address in that underlying resource:

![img](../mmap-diagram.png)

In the case of `mmap`, the operating system establishes 

### Why can `mmap` allocate such a large amount memory?

### Why 

## The `mmap` specification

The `glibc` specification for the `mmap` function is as follows:

```c
 void *mmap(void *addr, size_t length, int prot, int flags,
                  int fd, off_t offset);
```

The `mmap` function takes the following parameters:
- `addr`: The starting address for the new mapping. If this argument is `NULL`, then the kernel will select an address at which to start the mapping for the process that called `mmap`. In most cases, `addr` should be left as `NULL`.
- `length`: The length (in bytes) of the mapping.
- `prot`: Describes the level of memory protection on the mapped pages. Typically, `prot` is written as a set of flags connected by the bitwise OR (`|`) operator that describe memory permissions. These flags are:
  - `PROT_EXEC`: Provides execute permissions.
  - `PROT_READ`: Provides read permissions.
  - `PROT_WRITE`: Provides write permissions.
  - `PROT_NONE`: Provides no permissions at all.
- `flags`: A parameter that specifies a number of qualities of the mapping related to shared memory. The parameter consists of flags connected by a bitwise OR (like `prot`). These flags are too numerous to describe here, and a list of all well-defined flags can be found on the [man page](https://man7.org/linux/man-pages/man2/mmap.2.html) for `mmap`. Note that in order to execute, one of `MAP_PRIVATE` or `MAP_SHARED` should be specified.
- `fd`: A file descriptor for the underlying file that is to be mapped. If the user does not wish to use `mmap` to create a mapping for a file, they should pass in `-1` for this argument and use the `MAP_ANONYMOUS` flag in the `flags` parameter.

## When should I use `mmap`?

The `mmap` interface is explicit in defining parameters for both file I/O and shared memory inter-process communication, making these the most obvious applications of `mmap`. However, `mmap` might be confusing in that it might not be entirely obvious why it should be used over alternatives like the `open()`, `read()` and `close()` syscalls. Here, we will look at both of `mmap`'s primary use cases and explain why it can be more useful than other alternatives.

### Using `mmap` to read files

Many programmers are already familiar with the `open`-`read`-`write`-`close` mnemonic, where a program will open a file descriptor for some file, read the contents of the file via a buffer, perform some operations on that buffer, write the buffer to the file system, then close the underlying file descriptor.

- `mmap` can very easily load large files compared to standard file I/O
- Modern implementations of `mmap` typically use **copy-on-write** loading (also known as lazy loading) for maps with the `MAP_PRIVATE` flag. In a copy-on-write system, multiple processes accessing the same resource will instead receive a pointer to a single resource until they decide to make a change to that resource, at which point the mapping is copied to the program's memory. In practice, this means `mmap` saves significant amounts of memory for applications where multiple processes are attempting to read the same file at one time.
- Since `mmap` involves making a single syscall, it has slightly less overhead than the `read`-`write`-`close` mnemonic. In most use cases this should not make a noticeable performance difference, but it is worth noting in cases where the `open`-`read`-`write`-`close` mnemonic is used many times in a single program.

That said, `mmap` is not a one-size-fits-all solution to file I/O and there are plenty of sound reasons to prefer the `read`/`write` mnemonic:
- `mmap` allocates memory in pages rather than in bytes, so
- 

## Some examples

### Using `mmap` to read a file in C

```c
int main(void) {
    struct stat stat;
    int fd;
    size_t size;
    char *buf;

    fd = open("testfile.txt", O_RDONLY);
    fstat(fd, &stat);
    size = stat.st_size;

    buf = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, 0); // allocate an unshared map tied to fd
    for (size_t i = 0; i < size; i++) {
        printf("%c", buf[i]);
    }
    munmap(buf, size);
    close(fd);
    return 0;
}
```

### Using `mmap` for creating shared memory

Here is a short example of how we can utilize `mmap` to create a region of shared memory between a parent and a child process. Here we will create two integer variables, one created through standard variable declaration and one created through `mmap`, and show how the `mmap`'ed variable shares the same value for both the parent and child process, whereas the other does not.

```c
int main(void) {
    int unshared = 15;
    u_int8_t *shared = mmap // create shared variable
                      (
                            NULL, 
                            4096,
                            PROT_READ | PROT_WRITE, // let both processes read and write to the map
                            MAP_SHARED | MAP_ANONYMOUS, // create a shared map that is not tied to a file descriptor
                            -1, // no file descriptor here
                            0 // no offset necessary
                      );
    *shared = 1;
    if (fork() == 0) { // fork our process, and check if we're running on the child process
        printf("Child process running...\n");
        printf("Value of `unshared` is %i, value of `shared` is %i\n", unshared, *shared);
        printf("Child process changing `shared` and `unshared`...\n");
        unshared = 64;
        *shared = 128;
        printf("On child process, `unshared` is %i, `shared` is %i\n", unshared, *shared);
        _exit(0);
    } else {
        wait(NULL); // wait for the child process to finish
    }
    printf("Parent process checking `shared` and `unshared`...\n");
    printf("On parent process, `unshared` is %i, `shared` is %i\n", unshared, *shared);
}
```

If this program is run, it will produce the following output:

{% output %}
Child process running...
Value of `unshared` is 15, value of `shared` is 1
Child process changing `shared` and `unshared`...
On child process, `unshared` is 64, `shared` is 128
Parent process checking `shared` and `unshared`...
On parent process, `unshared` is 15, `shared` is 128
{% endoutput %}

## Further Reading

From the Systems Encyclopedia:

- [Inter-process communication](../ipc)

Outside readings:

- [mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html) - Linux manual pages
