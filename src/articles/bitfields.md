---
title: Bit Fields
---


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Bit Fields
<hr>

In C and C++, the smallest primitive types consist of a single byte that can store 256 (2^8) unique values. However, you may encounter situations where even 256 far exceeds the number of values you need to represent with a variable. One of the most common of these situations arises when you have a `struct` or `class` that contains several boolean variables, which only have 2 meaningful values (`true` or `false`).

Suppose we an `animal` struct wherein each animal has a name and possesses some combination of attributes.
One way we might represent such an animal is as follows:

```cpp
  typedef struct _animal {
    const char* name;  //our name
    bool quadruped = false; //whether we have four lege
    bool tail      = false; //whether we have a tail
    bool shell     = false; //whether we have a shell
    bool herbivore = false; //whether we are herbivorous
    bool green     = false; //whether we are green
    bool fast      = false; //whether we are fast
    bool aquatic   = false; //whether we live in the water
    bool audible   = false; //whether we make audible sounds
  } animal;

```

Now suppose we wish to create a new `animal` using some combination of the above attributes. We might set these attributes directly when creating the animal, one-by-one after creating the animal, or through a helper function:

```cpp
  // direct
  animal a = {"cat",true,false,false,false,false,true,false,true};

  // one-by-one
  animal a;
  a.name      = "cat";
  a.quadruped = true;
  a.tail      = true;
  a.fast      = true;
  a.audible   = true;

  // helper function
  animal makeAnimal(const char* name, bool quadruped, bool tail,
   bool shell, bool herbivore, bool green, bool fast,
   bool aquatic, bool audible) {
    animal a;
    a.name      = name;
    a.quadruped = quadruped;
    a.tail      = tail;
    a.shell     = shell;
    a.herbivore = herbivore;
    a.green     = green;
    a.fast      = fast;
    a.aquatic   = aquatic;
    a.audible   = audible;
    return a;
  }
```

The direct method and helper functions are straightforward, but respectively requires us to remember the position of each attribute in the struct or the order of the parameters to the function, which are highly error prone.
The one-by-one method is cleaner and more explicit than the other methods, but still require us to individually set each `true` value, which may be cumbersome if we need to manually construct several `animals`.

Finally, suppose we want to determine whether a given `animal` shares the same attributes as a refernce `animal`. We could accomplish this with a series of `if` statements, as follows:

```cpp
  //8 if statements and up to 8 comparisons
  bool isACat(animal &a) {
    if (a.quadruped) {
      if (a.tail) {
        if (!a.shell) {
          if (!a.herbivore) {
            if (!a.green) {
              if (a.fast) {
                if (!a.aquatic) {
                  if (a.audible) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
```

The above code is very cumbersome. The code could be made much more readable using boolean logical operators, but ultimately we may still end up performing up to 8 comparisons in the worst case:

```cpp
  //looks much cleaner, but still performing up to 8 comparisons
  bool isACat(animal &a) {
    return a.quadruped
      && a.tail
      && (!a.shell)
      && (!a.herbivore)
      && (!a.green)
      && a.fast
      && (!a.aquatic)
      && a.audible;
  }
```

Additionally, while our `animal` struct has only 8 boolean variables, many `structs` and `classes` created in practice may have dozens of boolean variables, with increasingly complex constructors and mechanisms for comparing these variables as a result.

## Using bit fields

A **bit field** is a data structure used to address and manipulate individual bits of data in memory. While bit fields do not exist as a separate primitive type in C or C++, these languages do provide us with bitwise operators that allow us to address and manipulate the individual bits of other primitive types (generally, unsigned integer types between 8-64 bits in length). (N.b.: the C and C++ standards do provide built-in implementations of [bit fields](https://en.cppreference.com/w/cpp/language/bit_field), but they are not necessarily portable \[see Further Reading section at end\].)

By using bit fields, we are able to solve several of the issues identified in the above section. To begin, we must first define one or more **bit masks**, which are variables in which a single bit is set and the rest are unset. We will need a separate bitmask for each boolean variable we wish to represent in our bit field. For our `animal` `struct`, our bit masks might look something like this:

```cpp
  const char quadruped = 0b10000000; //whether we have four lege
  const char tail      = 0b01000000; //whether we have a tail
  const char shell     = 0b00100000; //whether we have a shell
  const char herbivore = 0b00010000; //whether we are herbivorous
  const char green     = 0b00001000; //whether we are green
  const char fast      = 0b00000100; //whether we are fast
  const char aquatic   = 0b00000010; //whether we live in the water
  const char audible   = 0b00000001; //whether we make audible sounds

```

While we use `chars` above to describe each bit mask, larger bitfields might use 16-bit, 32-bit, or 64-bit data types when working with larger bitfields.
Using the above bitmasks, we can greatly simplify the fields in our `animal` `struct`:

```cpp
  typedef struct _animal {
    const char* name;      //our name
    char        stats = 0; //our attributes
  } animal;

```

Note that the previous `bool` variables have been replaced by a single `char` we have named `stats`. We will be accessing the 8 individual bits of this variable to accomplish what we previously accomplished using 8 separate boolean values. Continuing our rewrite of our code in the first section, we are able to reimplment our three techniques for creating an `animal` as follows:

```cpp
  // direct
  animal a = {"cat",tail|fast|quadruped|audible};

  // one-by-one
  animal a;
  a.name      = "cat";
  // EITHER
  a.stats     = audible|fast|tail|quadruped;
  // OR
  a.stats     = quadruped;
  a.stats    |= tail;
  a.stats    |= fast;
  a.stats    |= audible;

  // helper function
  animal makeAnimal(const char* name, char stats) {
    return {name,stats};
  }
```

Much shorter!
We can see that in the direct and helper function methods, we no longer have to remember the order of all of our boolean attributes, and can instead use the bitwise OR operator to set all of the necessary bitmasks in any order, while the remaining bit masks are unset by default.
Moreover, the one-by-one method now looks very similar to the direct method, but should we so desire, we can retain similar syntax to what we had before simply using the `|=` operator.

Perhaps the most noticeable improvement comes from our `isACat()` function. While we previously required up to 8 separate comparisons to determine whether an `animal` matched a reference `animal`, we can now rewrite our function using a single comparison!

```cpp
  bool isACat(animal &a) {
    const char CATSTATS = quadruped|tail|fast|audible;
    return a.stats == CATSTATS;
  }
```

Voila! Through the magic of bit fields, we have rewrriten our `isACat()` function to be shorter and cleaner while using fewer comparisons and bytes of memory!

## Summary of reasons to use bit fields over other primitive types:

  - Lower memory usage (can store 8 boolean values in a single `char`!)

  - Fewer comparisons (a single bitmask using a `long unsigned int` can replace up to 64 `if` statements!)

  - Fewer parameters to pass to functions and less need to remember parameter ordering!

  - Shorter, cleaner, more readable code in many cases!

## Reference sheet for some common bit field usages

```c

  uint8_t FLAGS = 0b10101001;  //can also be uint16_t, uint32_t, or uint64_t
  uint8_t foo   = 0b00010111;  //can also be uint16_t, uint32_t, or uint64_t

  //Check if all set bits in FLAGS are also set in foo
  bool allset1s = (foo & FLAGS) == FLAGS;

  //Check if any set bits in FLAGS are also set in foo
  bool anyset1s = (foo & FLAGS) > 0;

  //Check if no set bits in FLAGS are also set in foo
  bool noset1s = !(foo & FLAGS);

  //Check if all unset bits in FLAGS are also unset in foo
  bool allset0s = !(foo & (~FLAGS));

  //Check if set and unset bits match exactly in foo and FLAGS
  bool exactmatch = foo == FLAGS;

  //Make sure all set bits in FLAGS are also set in foo
  foo |= FLAGS;

  //Make sure all unset bits in FLAGS are set in foo
  foo |= (~FLAGS);

  //Make sure all unset bits in FLAGS are also unset in foo
  foo &= FLAGS;

  //Make sure all set bits in FLAGS are unset in foo
  foo &= (~FLAGS);

  //Flip all bits in foo
  foo = ~foo;

  //Flip all bits in foo that are set in FLAGS
  foo ^= FLAGS;

  //Flip all bits in foo that are unset in FLAGS
  foo ^= (~FLAGS);

  //Directly set nth bit of foo (n = 0-indexed, starting from right)
  foo |= (1 << n);

  //Directly unset nth bit of foo
  foo &= (~(1 << n));

  //Directly flip nth bit of foo
  foo ^= (1 << n);

  //Directly test if nth bit of foo is set
  bool isnthbitset(foo,n) { return foo & (1 << n); }

```

## Further Reading
- [Wikipedia article on bit fields](https://en.wikipedia.org/wiki/Bit_field)
- [Use of bit fields in C++'s `fstream`](https://www.cplusplus.com/doc/tutorial/files/)
- [C builtin specification of bit fields (includes multi-bit fields)](https://en.cppreference.com/w/c/language/bit_field)
- [C++ builtin specification of bit fields (includes multi-bit fields)](https://en.cppreference.com/w/cpp/language/bit_field)
- [Discussion of limitations of C/C++ builtin bit fields](https://stackoverflow.com/questions/25345691/bit-fields-portability)
