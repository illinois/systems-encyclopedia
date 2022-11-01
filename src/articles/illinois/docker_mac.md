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

To do our C MPs on M1 macs, we highly recommend using docker. Here are the commands you need to run.

Note: You NEED to start the docker desktop app first for this to work.

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
The most important problem with M1 macs is that valgrind is currently [not supported](https://valgrind.org/info/platforms.html) (as of 09/2022). As we require memory correctness in our MP's, valgrind is a necessity. 
Even if you don't use valgrind, you will find that low-level systems programming on the M1 natively will provide you with many annoyances. Apple is increasingly very concerned about the [security](https://www.dictionary.com/browse/control) of its users. Thus trying to do some semi-sketchy low level stuff like sideloading an unsigned by apple malloc implementation in MP3 may give you problems.

## What do these commands do
Like good systems programmers, we never just run terminal commands without actually knowing what they do. Docker's [website](https://docs.docker.com/) has good documentation. 
Quickly, Docker has two main things you need to know about in this scenario.
1) Image - A file system with packages installed.
2) Container - An instance of the image.

### Building Image

An image provides a template that containers use. An image takes long to build, but it will persist so that containers, which are built for short term tasks (and are usually closed after the task is finished) can borrow from the image. Thus an image will have things like valgrind, that will take too long to install on each container, but that every container will use.

When we run this command, we are telling it to build an image. 


```c
docker build -t cs340 .
```

The -t flag is the image name.

If you don't provide a -f command to signify the file name, it will assume that you are using the file Dockerfile, in the current directory.

Here is what a sample Dockerfile looks like (taken from mp2 in fall 2022)
```text
FROM gcc:latest
RUN apt-get update && apt-get install -y valgrind
COPY ./docker/entrypoint.sh /
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

The FROM command means we are using a base image (essentially a template with some pre-built stuff which we can then modify). In this case we are taking the latest version of gcc, which you can find here https://hub.docker.com/_/gcc.

To install stuff inside the image so that every container will have packages they can use, we can use the RUN command. "apt-get update" will make sure we have the most recent packages in our list of possible packages to download, and the "apt-get install -y valgrind" installs the valgrind package, which is needed to run autograder runs.

COPY in the Dockerfile copies files or directories from local to the docker container. 

ENTRYPOINT is a command that runs whenever we start a container (instance) of the container. In our example it is a bash script that we copy into the the root directory of the docker image. We also make sure to change the [permission](https://linuxpip.org/chmod-x-explained-everything-you-need-to-know/) using chmod +x, to allow the docker containers to execute the bash scrpt.

In our case the entrypoint script only changes the folder to mp2 and prints out a process is running.
```text
#!/bin/bash
cd mp2

echo "Running \`$1\` inside of a docker container..."
$1
```

### Running Container

Once we have the template that the image provides, we are able to start instances of those images known as containers.
Containers (in our case), are designed for one time use. They are also operating on your local file system (in our case), because we mount the docker container to your local file system (using -v flag). Thus you can think of it like running commands on your own filesystem, just using a different operating system.

For example

```bash
docker run --rm -it -v `pwd`:/mp1 cs340 "make clean"
```

The --rm flag is used so that the container is removed when it is stopped. Otherwise, the container will stay on your system, and once you have too many containers this will take up a lot of unnesseary space. 

The -it flag starts the container in interactive mode. This allows you to make commands while the docker container is running.

The -v flag performs a bind mount from the docker container to the local. That way your docker container is working on your local file system. If we didn't include this or some other mechanism of changing the local files, you files would be gone after the docker container is closed.

cs340 is the image name.

The command is then run. MAKE SURE TO USE QUOTES AROUND THE COMMAND!!!!! Otherwise it will be confused that there are multiple different flags it doesn't recognize.
