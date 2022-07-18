<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# How to Use `mmap` in C

`mmap` is a POSIX syscall implemented in the C standard library that creates a mapping in a process's virtual address space. Here, we will cover how `mmap` works, cover some important use cases for `mmap`, and provide some hands-on examples of `mmap` in the C language.

## Overview of `mmap`

### So how does `mmap` actually work?

`mmap` leverages hardware virtualization and memory paging in order to load large files or create regions of shared memory. For those unfamilar with either of those concepts, see our [virtualization](../virtualization) and [paging](../paging) articles.

When a program makes a syscall to `mmap`, the kernel will designate a section of that program's memory to correspond to another range of memory (either on disk). At a high level, we can think of this as each memory address in the program pointing to another address in the underlying resource that is being mapped:

![img](../mmap-diagram.png)

### `mmap` specification

The `glibc` specification for the `mmap` function is as follows:

```c
 void *mmap(void *addr, size_t length, int prot, int flags,
                  int fd, off_t offset);
```

The `mmap` function takes the following parameters:
- `addr`: The starting address for the new mapping. If this argument is `NULL`, then the kernel will select an address at which to start the mapping for the process that called `mmap`.
- `length`: The length (in bytes) of the mapping.
- `prot`: Describes the level of memory protection on the mapped pages. Typically, `prot` is written as a set of flags connected by the bitwise OR (`|`) operator that describe memory permissions. These flags are:
  - `PROT_EXEC`: Provides execute permissions.
  - `PROT_READ`: Provides read permissions.
  - `PROT_WRITE`: Provides write permissions.
  - `PROT_NONE`: Provides no permissions at all.
- `flags`: A parameter that specifies a number of qualities of the mapping related to shared memory. The parameter consists of flags connected by a bitwise OR (like `prot`). These flags are too numerous to describe here, and a list of all well-defined flags can be found on the [man page](https://man7.org/linux/man-pages/man2/mmap.2.html) for `mmap`. Note that in order to execute, one of `MAP_PRIVATE` or `MAP_SHARED` should be specified.
- `fd`: A file descriptor for the underlying file that is to be mapped. If the user does not wish to use `mmap` to create a mapping for a file, they should pass in `-1` for this argument and use the `MAP_ANONYMOUS` flag in the `flags` parameter.

## When should I use `mmap`?

### Using `mmap` to read files

The `mmap` interface is explicit in defining parameters for both file I/O and shared memory inter-process communication. Most applications of `mmap` typically involve the manipulation of some shared resource by multiple processes. 

However, it is not immediately clear that there are reasons to use `mmap` over other alternatives. Specifically, one may be more inclined to use the standard `read()` and `write()` syscalls
- `mmap` uses **copy-on-write** loading (also known as lazy loading or demand paging) when it initially creates a mapping in a program's virtual address space. This means that the address space that is mapped to the function is not actually allocated by the OS until a process attempts to access it, which can save significant amounts of memory for processes that do not always need to access a resource. This is particularly important for applications where there are many processes operating on a shared file or resource, as new processes that ultimately do not operate on a shared resource will not consume memory.
- `mmap` is unique in that it involves only creating a mapping to a process's virtual address space *once*, and only invovles *one* syscall. In practice, this can be a faster and less elaborate strategy than using the standard `read()` and `write()` mnemonic.

## Some examples

### Using `mmap` to read a file in C

```c
int main(void) {
    struct stat stat;
    int fd, size;
    char *buf;

    fd = open("testfile.txt", O_RDONLY);
    if (fd < 0 || fstat(fd, &stat) < 0) {
        fprintf(stderr, "open() or fstat() failed.\n");
        return 1;
    }
    size = stat.st_size;

    buf = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, 0);
    if (buf == MAP_FAILED) {
        fprintf(stderr, "mmap() failed.\n");
        return 1;
    }
    for (int i = 0; i < size; i++) {
        printf("%c", buf[i]);
    }
    munmap(buf, size);
    close(fd);
    return 0;
}
```

### Using `mmap` for creating shared memory

```c
int main(void) {
    struct stat statbuf;
    int fp = open("/some/shared/resource/file", "r");
    fstat(fp, &statbuf);

    int *shared = mmap(
        NULL,
        statbuf.st_size - 1,
        PROT_READ | PROT_WRITE,
        MAP_SHARED,
        fp,
        0
    );

    pid_t child;
    if ((child = fork()) == 0) {
        // process forked. The child can access the 'shared'
        // object and perform read and write operations on it.
    }
}
```

## Further Reading

From the Systems Encyclopedia:

- [Inter-process communication](../ipc)

Outside readings:

- [mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html) - Linux manual pages
