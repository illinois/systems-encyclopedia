---
title: Setting Up Your Programming Environment for CS 340

date: 2022-08-16
updated: 2022-08-16

authors:
- waf
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<style>
main ul > li:last-of-type { margin-bottom: 30px; }
h3 { margin-top: 30px; }
</style>

# Programming Environment Setup for CS 340

Before you get started programming, you'll need to set up your programming environment. We **highly recommend** you set up your own computer as your development environment, and we believe that real-world, industry-standard tools that are used by millions of people every day are the best tools to use for your development environment.


## Visual Studio Code

In lecture, you'll see me use Visual Studio Code for all programming.  I recommend you set up VS Code yourself if you don't already have it installed (it's free).

- [Install Microsoft's Visual Studio Code](https://code.visualstudio.com/) - Available for Windows, Mac, and Linux


## C Programming Environment

Setting up an programming environment for C will depend on what operating system you are using and this page has a section for Windows, OS X, and Linux.  


### Windows

On Windows, we recommend setting up [Windows Subsystem for Linux 2 (WSL2)](https://docs.microsoft.com/en-us/windows/wsl/install-win10) with Ubuntu Linux.  WSL2 is a virtualization tool that will allow you to run an installation of Linux, which has much better support for the tools used in CS 340.

- [Follow Microsoft's Guide: "Install Linux on Windows with WSL"](https://docs.microsoft.com/en-us/windows/wsl/install)


After you Install WSL2, next you will need to set up both Ubuntu for C Development and Visual Studio Code:

- [Follow Microsoft's Guide: "Using C++ and WSL in VS Code"](https://code.visualstudio.com/docs/cpp/config-wsl)


Finally, create a `cs340` directory inside of your Ubuntu home directory.

- Open Ubuntu in the same way as you did in Microsoft's Guide.
- Create your CS 340 directory:
    <pre class="language-bash"><code class="language-bash"><span style="color: #16c60c">waf@ILLINOIS</span>:<span style="color: #3b78ff">~</span>$ mkdir cs340   <span style="color: #42c26b"># Create the cs340 directory</span><br><span style="color: #16c60c">waf@ILLINOIS</span>:<span style="color: #3b78ff">~</span>$ cd cs340<span style="color: #42c26b">      # Navigate into the cs340 directory</span><br><span style="color: #16c60c">waf@ILLINOIS</span>:<span style="color: #3b78ff">~/cs340</span>$</code><span style="color: #42c26b">         # When your prompt shows cs340, you're inside of the cs340 directory!</span></pre>
- You will use this directory for all your CS 340 work.
    - If you want to access your Linux file system in Windows, you can visit the address `\\wsl$\Ubuntu\home\` inside of File Explorer to view your Linux home directory within Windows.  *It is possible to access your Windows file system from Linux (`/mnt/c/...`), but this is slow, removes all file permission bits from Linux, and generally does not work as well.* 



<!--
- An alternative to using WSL is using the [MinGW platform](https://www.mingw-w64.org/), a Windows port of GCC. However, we **do not** reccomend you use this over WSL to develop for this course, both because MinGW is much more difficult to set up properly and because we provide no guarantee that C code which compiles and runs on native Windows will compile and run on our autograder.
-->

### Mac OS X

⚠️ OSX is a Unix-like operating system, but is not Linux.  As a systems course, there will be times that you will encounter unexpected behavior and will have to find workarounds.  Where possible, we will support OSX as best as possible.

To develop on MacOS, you'll need the following prerequisites:
- [XCode Command Line Tools](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
- [The Homebrew package manager](https://docs.brew.sh/Installation), or other package manager to install software


Finally, create a `cs340` directory on your Desktop.

- Open Ubuntu in the same way as you did in Microsoft's Guide.
- Create your CS 340 directory:
    <pre class="language-bash"><code class="language-bash"><span style="color: #16c60c">waf@my-mac</span>:<span style="color: #3b78ff">~</span>$ cd Desktop           <span style="color: #42c26b"># Navigate to your Desktop</span><br><span style="color: #16c60c">waf@my-mac</span>:<span style="color: #3b78ff">~/Desktop</span>$ mkdir cs340  <span style="color: #42c26b"># Create the cs340 directory</span><br><span style="color: #16c60c">waf@my-mac</span>:<span style="color: #3b78ff">~/Desktop</span>$ cd cs340<span style="color: #42c26b">     # Navigate into the cs340 directory</span><br><span style="color: #16c60c">waf@my-mac</span>:<span style="color: #3b78ff">~/Desktop/cs340</span>$</code><span style="color: #42c26b">        # When your prompt shows cs340, you're inside of the cs340 directory!</span></pre>
- You will use this directory for all your CS 340 work.  You will also find this folder as a visual folder on your desktop.




### Linux

On Linux, setting up your environment should be as simple as installing the required packages for C development on your distribution. If you're running Linux, we trust you know how to get packages as you need them. :)


### Non-Local Alternative: EWS Labs

If for any reason you are unable to or do not want to develop on your local machine, you may work remotely on an EWS machine. EWS will provide a limited Linux development environment which is already set up with most of the tools needed for this course. For more information, see the EngrIT guide here: [https://answers.uillinois.edu/illinois.engineering/page.php?id=81727](https://answers.uillinois.edu/illinois.engineering/page.php?id=81727).

Note: Running on EWS requires you to run `module load gcc` each time you log in to ensure you have a recent version of the compiler in use.

