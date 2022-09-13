---
title: File I/O in C

date: 2022-09-13

authors:
- kennel2
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# File I/O in C

Like many other languages, C has a number of in-built functions supporting reading and writing to files. In C, files are evaluated as **byte streams**, or a sequence of bytes/characters that can be appended to from either side. Every file stream is handled by a `FILE*` type, and we can think of a stream much like a machine that reads a piece of tape and the `FILE*` is a read head:

![img](../static/c-fileio/fileiodiagram.png)

## `stdlib` Functions for File I/O

The I/O functions that C implements are located in the `stdio.h` library. For all of the code examples below, assume we are working with a basic text file named `lorem.txt` with the following contents:

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

### Opening and Closing - `fopen` and `fclose`

```
FILE *fopen(const char *restrict pathname, const char *restrict mode);
```

`fopen` takes a string representing the path to the file being opened and a `mode` parameter, which specifies whether or not the returned file stream is readable and writeable, opening a file descriptor in the OS for that file and returning a `FILE*` that points to the file stream. 

The [man page](https://man7.org/linux/man-pages/man3/fopen.3.html) for `fopen` defines the following possible modes:

```txt
r      Open text file for reading. The stream is positioned at
       the beginning of the file. 
r+     Open for reading and writing. The stream is positioned at
       the beginning of the file.
w      Truncate file to zero length or create text file for
       writing. The stream is positioned at the beginning of the
       file.
w+     Open for reading and writing. The file is created if it
       does not exist, otherwise it is truncated. The stream is
       positioned at the beginning of the file.
a      Open for appending (writing at end of file). The file is
       created if it does not exist. The stream is positioned at
       the end of the file.
a+     Open for reading and appending (writing at end of file).
       The file is created if it does not exist. Output is
       always appended to the end of the file. 
```

```
int fclose( FILE *stream );
```

`fclose` is simple, taking a file pointer, and closing the stream and the file descriptor associated with that file. All files that are opened with `fopen` should be closed after use to preserve the operating system's resources.

### Reading from files - `fread` and `fgets`

```
size_t fread(void *restrict ptr, size_t size, size_t nmemb, FILE *restrict stream);
```

Given a pointer to some buffer/array `ptr`, unsigned integers `size` and `nmemb` and a pointer to a file stream `stream`, `fread` will read `nmemb` chunks each of `size` bytes into the buffer and advance the stream. In other words, `fread` will read `size * nmemb` bytes from the file stream.

```c
FILE* f = fopen("lorem.txt", "r");
char* s = malloc(6);
fread(s, 1, 5, f);
fclose(f);
s[5] = '\0'; // fread doesn't set the null byte for us, so we need to do it ourselves!
printf("%s", s);
```
{% output %}
Lorem
{% endoutput %}

```
char *fgets(char *restrict s, int n, FILE *restrict stream);
```

`fgets` is a string-specific version of `fread`. Given a `char` buffer `s`, and integer `n` and a pointer to a file stream, `fgets` will read either up to `n - 1` characters or read characters until it reaches a newline character (`\n`) of the end of the file, whichever comes first. Additionally, `fgets` will insert a terminating null-byte into `s` after having read from the buffer, meaning that it does not need to be done manually.

```c
FILE* f = fopen("lorem.txt", "r");
char* s = malloc(6);
fgets(s, 6, f);
fclose(f);
printf("%s", s);
```
{% output %}
Lorem 
{% endoutput %}

### Writing to Files - `fwrite` and `fputs`

```
size_t fwrite(const void *restrict ptr, size_t size, size_t nmemb, FILE *restrict stream);
```

`fwrite`'s specification is almost the exact same as `fread`. Specifically, `fwrite` will write `size * nmemb` bytes from `ptr` to the file stream specified by `stream`.

```
int fputs(const char *restrict s, FILE *restrict stream);
```

`fputs` is a simple and idiomatic way to write a string literal into a text-based file. Given some string `s` and `stream`, `fputs` will write the entirety of `s` into `stream` with the exception of the string's null byte.

```c
FILE* f = fopen("lorem.txt", "w");
char* s = " Sadly, the future is no longer what it was.";
fputs(s, f);
fwrite(s, 1, 5, f);
fclose(f);
```
After running this snippet, the contents of `lorem.txt` will be:
{% output %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sadly, the future is no longer what it was. Sadly
{% endoutput %}

### Manipulating File Pointers - `ftell`, `fseek`, and `rewind`

Each file stream maintains an internal file position indicator to express how far along in a stream a `FILE*` type is. On top of that, C implements a number of functions for manipulating the file position indicator. 

```
long ftell(FILE *stream);
```

Given some pointer a file stream, `ftell` returns the byte position of that pointer in the stream.

```c
FILE* f = fopen("lorem.txt", "r");
char* dummy = malloc(5);
fread(dummy, 1, 5, f);
printf("%ld", ftell(f));
```
{% output %}
5
{% endoutput %}

```
int fseek(FILE *stream, long offset, int whence);
```

`fseek` will modify the position indicator of `stream`, calculating the new position by adding `offset` bytes to the position specified by `whence`. C defines three constants, `SEEK_SET`, `SEEK_CUR`, and `SEEK_END` denoting the first, current, and final positions in the file stream that can all be used to move the position indicator. 

We can leverage both `fseek` and `ftell` to read an entire file into a single buffer without needing to know the length of the file beforehand! Let's see the following example:

```c
FILE* f = fopen("lorem.txt", "r");
fseek(f, 0, SEEK_END); // Move to the last position in the file stream
long file_length = ftell(f); // The last position of the file stream = number of bytes in that file
fseek(f, 0, SEEK_SET); // Reset to the first position so we can read in the file

char* s = malloc(file_length + 1); // Include room for the null byte!
fread(s, 1, file_length, f);
s[file_length] = '\0';
printf("%s", s);
```
{% output %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
{% endoutput %}

## Further Reading:
- [stdio(3)](https://man7.org/linux/man-pages/man3/stdio.3.html) - Linux manual page

