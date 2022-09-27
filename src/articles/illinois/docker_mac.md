---
title: Setting Up Your Programming Environment for CS 340

date: 2022-09-27

authors:
- shaffar3
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<style>
main ul > li:last-of-type { margin-bottom: 30px; }
h3 { margin-top: 30px; }
</style>

# Docker Setup Guide for Mac

To do many of our MPs on M1 macs, we reccomend using docker. Here are the commands you need to run.

Note: You NEED to press on the docker desktop app for this to work.

```bash
# Build a light-weight docker:
docker build -t cs340  .

# Run make clean, make, and run valgrind:
docker run --rm -it -v `pwd`:/mp1 cs340 "make clean"
docker run --rm -it -v `pwd`:/mp1 cs340 "make test"
docker run --rm -it -v `pwd`:/mp1 cs340 "valgrind ./test"
```
If you want to run without valgrind, simply run 
```bash
docker run --rm -it -v `pwd`:/mp1 cs340 "./test"
```
Replace mp1 with whatever mp your running. 
You can run any command that you would normally run on a local system in the quotes as well.

You must also have docker desktop installed for this to work. Install using this [link](https://docs.docker.com/desktop/install/mac-install/).
We recommend that you also download the docker vscode extension. This will show you graphically what containers and images exist, and allow you to create it.

## Why Do I Need to Do This When My Windows/Linux Friends Don't Need Docker
The most important problem with M1 macs is that valgrind is currently [not supported](https://valgrind.org/info/platforms.html) (as of 09/2022). As we require memory correctness in our MP's, valgrind is a neccisity. 
Even if you don't use valgrind, you will find that low-level systems programming on the M1 natively will provide you with many annoyances. Apple is increasingly very concerned about the [security](https://www.dictionary.com/browse/control) of its users. Thus trying to do some semi-sketchy low level stuff like sideloading an unsigned by apple malloc version in MP3 will give you problems.

## What do these commands do
Like good systems programmers, we never just run terminal commands without actually knowing what they do. Dockers [website](https://docs.docker.com/) has good documentation. 
Quickly, Docker has two main things you need to know about in this scenario
1) Image - A file system with packages installed.  


