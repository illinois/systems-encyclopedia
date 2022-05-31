<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# How to Use `strtok` and `strtok_r` in C

```
char *strtok(char *restrict str, const char *restrict delim);
char *strtok_r(char *restrict str, const char *restrict delim, char **restrict saveptr);
```

`strtok` and `strtok_r` are string tokenization functions in C's `<string.h>` library. Given a pointer to some string `str` and some delimiter `delim`, `strtok` will attempt to divide the string that `str` points to into a sequence of tokens delimited by `delim`. On each call, `strtok` will find the next delimiter in `str`, and return a null-terminated token preceding that delimiter. In the event that the string cannot be further tokenized, `strtok` will return `NULL`.

As a demonstrative example, let's consider a simple program that uses `strtok` to tokenize a comma-separated string:

```c
#include <string.h>
#include <stdio.h>

int main() {
  char s[16] = "A,B,C,D";
  char* tok = strtok(s, ",");
  while (tok != NULL) {
    printf("%s\n", tok);
    tok = strtok(NULL, ",");
  }
  return 0;
}
```
{% output %}
A
B
C
D
{% endoutput %}

For those who immediately want to get started using `strtok` and `strtok_r`, you should keep these things in mind:
- To fully tokenize a string, `str` should be the string you want to tokenize on your first call to `strtok`, and should be `NULL` on all subsequent calls.
- Tokens extracted using `strtok` cannot be tokenized themselves. For hierarchies of multiple tokens, use `strtok_r`. `strtok_r` should also be used in favor of `strtok` for multithreaded code.

## So how does `strtok` actually work?

`strtok` holds a static pointer in between calls that points to the first character of the un-tokenized portion of its original input. The actual behavior of the function depends on whether or not its first parameter is a pointer to an actual string or a `NULL` pointer:
- If `str` is actually a string, `strtok` sets its internal pointer to point to what `str` points to. Then, this internal pointer will move until it finds an instance of `delim`, replacing it with a null byte and returning a pointer to its original position before the function was called.
- If `str` is `NULL`, `strtok` will use the internal pointer it already has. It will look for the first instance of `delim` past that pointer, replacing it with a null byte and returning a pointer to its original position from before the function call.

As an example, the behavior of `strtok` on our previous example would be as follows:

![im](../static/c-strtok/strtok_example.png)

The maintainence of this internal pointer has several important implications for the actual behavior of the function:
1. `strtok` is not thread-safe. The pointer that is used is static, which creates a section of code that can be modified at the same time by multiple threads, causing undefined behavior in multithreaded code.
2. Tokens extracted by `strtok` are adjacent in memory.
3. Tokens extracted by `strtok` cannot be tokenized themselves until whole original string has been tokenized. `strtok_r` avoids this, and we will see why later.

## What's the difference between `strtok` and `strtok_r`?

`strtok_r` is defined as the **reentrant** version of `strtok`, meaning that the function can be safely interrupted and then called again before the interrupted process can finish (for more details on this see [here](https://www.ibm.com/docs/en/aix/7.2?topic=programming-writing-reentrant-threadsafe-code)). The fact that `strtok_r` is explicitly reentrant is not of particular importance to us here, so we won't dive any further.

The main difference between `strtok` and `strtok_r` is that `strtok_r` contains an additional parameter called `saveptr` that behaves exactly the same as the internal static pointer of `strtok`. Like the static pointer in `strtok`, `saveptr` allows the function to preserve the context of what has and hasn't been tokenize, but parameterizing this part of the function allows for multiple contexts at the same time. Practically speaking, this is useful when we have data where we want to break tokens into their own sub-tokens.

### Example: Tokenizing IPV4 Addresses

Let's say we want to build a simple (and somewhat silly) program in C where divide a list of IPV4 addresses into a list of numbers that make up those addresses. We use `strtok_r` to make the following program:

```c
#include <string.h>
#include <stdio.h>

int main() {
  char ips[] = "127.0.0.1, 192.0.2.1, 172.16.254.1";
  char* saveptr1; // Initialize our save pointers to save the context of tokens
  char* saveptr2; 

  char* tok = strtok_r(ips, ", ", &saveptr1);
  while (tok != NULL) {
    printf("Token: %s\n", tok);
    char* subtok = strtok_r(tok, ".", &saveptr2);
    while (subtok != NULL) { // Once we have an IP address, break it down into each dotted number
      printf("Subtoken: %s\n", subtok);
      subtok = strtok_r(NULL, ".", &saveptr2);
    }
    tok = strtok_r(NULL, ", ", &saveptr1);
  }
  return 0;
}
```
{% output %}
Token: 127.0.0.1
Subtoken: 127
Subtoken: 0
Subtoken: 0
Subtoken: 1
Token: 192.0.2.1
Subtoken: 192
Subtoken: 0
Subtoken: 2
Subtoken: 1
Token: 172.16.254.1
Subtoken: 172
Subtoken: 16
Subtoken: 254
Subtoken: 1
{% endoutput %}

Here, we're leveraging the fact that `strtok_r` allows multiple context by creating a pointer that handles each IPV4 address in the list and one that handles each number per IPV4 address. If we used just `strtok`, our pointer to our original list would reset after every call to `strtok` on `ips`! 

## Common Pitfalls

### Using `strtok` vs. using `strtok_r`

Because `strtok` can only hold one internal pointer at a time, it is impossible to use `strtok` to tokenize two strings in parallel. To prove this, let's try to replicate the example that we used earlier, only using `strtok` instead of `strtok_r`:

```c

#include <string.h>
#include <stdio.h>

int main() {
  char ips[] = "127.0.0.1, 192.0.2.1, 172.16.254.1";

  char* tok = strtok_r(ips, ", ");
  while (tok != NULL) {
    printf("Token: %s\n", tok);
    char* subtok = strtok(tok, ".");
    while (subtok != NULL) { // Once we have an IP address, break it down into each dotted number
      printf("Subtoken: %s\n", subtok);
      subtok = strtok(NULL, ".");
    }
    tok = strtok(NULL, ", ");
  }
  return 0;
```
{% output %}
Token: 127.0.0.1
Subtoken: 127
Subtoken: 0
Subtoken: 0
Subtoken: 1
{% endoutput %}

Our implementation using `strtok` halts early! The first call to `strtok` on `ips` produces the token `127.0.0.1` and places a null byte at the comma delimiter. We then break that token into subtokens as normal. However, when we call `strtok` after processing our subtokens, it will return `NULL` because its internal reference is to the first token we extracted, which has already been processed, causing our program to finish earlier than it should. So, for situations where a string is composed of a hierarchy of tokens, we should use `strtok_r` instead of `strtok`.

### Using `strtok` on constant or read-only strings

Recall that `strtok` will change anything matching `delim` to a null byte. So, if we try to use `strtok` on a string that exists in read-only memory, our program will likely segfault! Here's a brief example:

```c
char* s = "This is in read-only memory!";
char* tok = strtok(s, " ");
```
{% output %}
Segmentation fault
{% endoutput %}

The moment that `strtok` reaches the first space in `s`, it will immediately cause a segfault because it will attempt to write a null byte in the fourth (zero-indexed) position instead.

## Further Reading

- [strtok(3)](https://man7.org/linux/man-pages/man3/strtok.3.html) - Linux manual page 
