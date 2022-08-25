---
title: Basic Memory Management in C

authors:
- kennel2
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" /> 

# Basic Memory Management in C

C provides a simple and direct interface for managing program memory during runtime. Here we'll provide a brief overview of C's memory model, the standard library's memory management functions, and common pitfalls new C programmers can run into when using these functions.

The C runtime memory model can be broken down into 3 separate pieces:
1. **Automatically allocated memory:** This section of memory consists of locally initialized variables (e.g. declaring `int i = 0` inside of any function) and function parameters. All of the memory allocated to these variables is automatically managed by C, meaning that you do not need to (and should not!) use any of the C `stdlib`'s memory management functions on them. In most cases, your source code will consist of automatically managed variables. 
2. **Dynamically allocated memory:** This consists of any memory that your program explicitly tells the operating system to allocate for it. In other words, if you use any of C's memory allocation functions, you will be dynamically allocating memory.
3. **Static/global memory:** Any variable declared with the `static` keyword or declared globally will exist in a separate space of memory. When this space is allocated, it is never freed during the execution of the program. 

In reality, the way that C executables allocate memory is significantly more elaborate than this, but this is still a simple and accurate mental model that we can use to reason about how memory is managed.

## Important `stdlib` functions for memory management

C implements a number of functions in `stdlib.h` and `string.h` that are used to manipulate memory. With the exception of `memcpy`, `memmove` and `memset` (which are all located in `string.h`), all the functions mentioned here are located in the `stdlib.h` library.

<hr class="solid">

### Memory allocation and data size - `malloc`, `calloc`, `realloc`, and `sizeof`

```
void *malloc(size_t size);
```

Given some unsigned integer `size`, `malloc` will allocate a contiguous block of `size` bytes and return a pointer to that allocated block. The block that was allocated will exist in memory until it is explicitly deallocated with `free`.

```c
char* s = malloc(8);
strcpy(s, "Systems");
printf("%s", s);
```
{% output %}
Systems
{% endoutput %}

```
void *calloc(size_t nmemb, size_t size);
```

`calloc` is a "fancier" version of malloc. Given `nmemb` and `size`, `calloc` will allocate a block of `nmemb` pieces consisting of `size` bytes each. In other words, `calloc` allocates `size * nmemb` bytes of memory. Unlike `malloc`, `calloc` sets each byte of the allocated memory to 0, meaning that the allocated memory technically can be used immediately without having to be initialized.

```c
int* i = calloc(1, 4);
printf("%d", *i); // If i were allocated with malloc, this would have undefined behavior!
```
{% output %}
0
{% endoutput %}

```
void *realloc(void *ptr, size_t size);
```

Given a `ptr` to some piece of allocated memory and an unsigned integer `size`, `realloc` will `free` the memory that `ptr` points to and reallocate a new block of `size` bytes. It is important to note that `realloc` will attempt to preserve the data inside the block that `ptr` points to during reallocation. If `size` is greater than the original size of the block, then `realloc` will simply copy that data and leave the rest of the memory unset. If `size` is smaller than the original size, `realloc` will copy as much as it can, and truncate the rest of the input that cannot be fit in the new memory block. In the event that `realloc` fails, it will return `NULL`, and the pointer to the original data will be lost, however.

```c
char* s = malloc(8);
strcpy(s, "Systems"); // Hmm, let's allocate some more memory...
s = realloc(s, 24);
strcat(s, " is the best!");
printf("%s", s);
```
{% output %}
Systems is the best!
{% endoutput %}

`sizeof` is a basic operator that will return the size (in bytes) of a particular type signature. This is useful if you haven't memorized the size of every data type in C, or if you need to allocate space for a `struct` (since different `structs` can have different sizes in memory). Additionally, `sizeof` is a nice idiom for specifying the intent of a particular variable, and is thus good to use for writing clean and maintainable code.

```c
int* i_arr_bad = malloc(20); // This doesn't tell us anything about what this variable actually is!
int* i_arr = malloc(5 * sizeof(int)); // This tells us that i_arr is a buffer holding 5 ints!
```

<hr class="solid">

### Deallocating memory with `free`

```
void free(void *ptr);
```

`free` is our simplest function here. Given a pointer to a piece of allocated memory, `free` deallocates that memory.

```c
char* s = malloc(8);
strcpy(s, "Systems");
// Do some work with s...
free(s); // Hooray for no memory leaks!
```

<hr class="solid">

### Copying and modifying memory - `memcpy`, `memmove`, and `memset`

```
void *memcpy(void *restrict dest, const void *restrict src, size_t n);
void *memmove(void *dest, const void *src, size_t n);
```

Given two pointers `dest` and `src`, `memcpy` will copy `n` bytes from `src` into `dest` and return a pointer to `dest`. `memmove` performs the same function, but has well-defined behavior for when the memory regions that `src` and `dest` point to overlap (where `memcpy` does not).

```c
char* s = "Systems";
char* s2 = malloc(8);
memcpy(s, s2, 8);
printf("%s", s2);
```
{% output %}
Systems
{% endoutput %}

```
void *memset(void *s, int c, size_t n);
```

`memset` is similar, but defines a singular value to copy into a block of memory rather than an entire buffer. Given some pointer `s` and a byte value `c`, `memset` will set `n` bytes of memory in the block pointed to by `s` to take the value `c`.

```c
int* i = malloc(4);
memset(i, 1, 4); // This will set every byte in i to be of the form 00000001.
printf("%d", *i); // Represented in bits, i will actually be `00000001 00000001 00000001 00000001`
```
{% output %}
16843009
{% endoutput %}

<hr class="solid"> 

## Common Pitfalls

<hr class="solid"> 

### Overusing `malloc`

Programmers just getting started in C may get a bit overzealous with the use of dynamic memory management. However, as good lazy programmers, we want to our runtime environment to manage everything for us! Even smaller programs that force dynamic memory allocation can be twice the length of their automatically managed counterparts. Consider the following (somewhat silly) example:

```c
// We could to this...
int* i = calloc(1, sizeof(int));
int* j = calloc(1, sizeof(int));
j* = 1;
printf("%d\n", (*i) + (*j));
free(i);
free(j);

// ...but this is much better
int b = 0;
int a = 1;
printf("%d\n", a + b);
```
{% output %}
1
1
{% endoutput %}

Clearly, we have a lot of extra work we have to do if we force dynamic allocation for all of our variables. Where possible, we should avoid any dynamic allocation, as it leads to cleaner and more maintainable code. As a rule of thumb, dynamic allocation should mostly be used for pieces of data where the byte size of that data is unknown (e.g. dynamically sized arrays or variable-length strings) or for data whose lifespan needs to be preserved outside of the scope of the function it is contained inside.

<hr class="solid"> 

### Memory leaks

A simple yet common pitfall is allocating memory that is not or cannot be freed. This will cause our programs to [leak](https://en.wikipedia.org/wiki/Memory_leak) memory. 

```c
char* s = malloc(8);
strcpy(s, "memleak");
s = "We caused a memory leak!"; // s now points to a different string entirely, and the pointer to "memleak" can't be recovered to free it
```

It goes without saying that every piece of data that we allocate with `malloc` needs to be freed when no longer used. New C programmers should be extra careful to keep track of every piece of data they've dynamically allocated.

<hr class="solid">

### Double frees and dangling pointers 

A double free occurs when a piece of memory that is already deallocated is deallocated again with `free`. Technically, double frees are undefined behavior, but practically speaking the most likely outcome is a segmentation fault.

```c
char* c = malloc(1);
free(c);
free(c); // Segfault!
```

Additionally, whenever a piece of data is freed, all of the pointers and references that point to that data break entirely! To avoid the problem of [dangling pointers](https://en.wikipedia.org/wiki/Dangling_pointer), all pointers to a piece of freed data should be set to `NULL` to avoid the undefined behavior of said dangling pointers. Practically speaking, dangling pointers may not break all code, but it is nevertheless good practice to avoid them.

```c
char* c = malloc(1);
free(c);
c = NULL; // Defensive programming!
```

<hr class="solid">

## Further reading

Outside readings:
- The GNU C Library - [Memory Allocation and C](https://www.gnu.org/software/libc/manual/html_node/Memory-Allocation-and-C.html)
