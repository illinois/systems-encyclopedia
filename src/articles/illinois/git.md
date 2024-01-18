---
title: Setting Up git for CS 340

date: 2022-08-16
updated: 2024-01-18

authors:
- waf, gcevans
---

# Setting Up git for CS 340

`git` is the industry standard for collaborative code management. GitHub is the most popular server for attaching git projects to. Among `git` and GitHub's many collaboration features are a few that will assist us in delivering and grading MPs.

The University of Illinois has an enterprise license to [github.com](http://github.com) and has enabled some security features which will make connecting to it more secure but also more involved than other GitHub sites.

## Creating a GitHub Account

To log into GitHub, you will use your own personal GitHub account (usually not your Illinois NetID, though it is possible you might be able to claim the same ID for github and for the university).  You will be privately associating your NetID with your GitHub account to be invited into the course organization for your course (e.g. `@cs340-illinois`).

**If you do not have a GitHub account**, you need to create a free GitHub account.  Most people use their github.com as part of their professional identity, so choosing a professional username is encouraged (ex: `gcevans` is Carl Evan's username, not `dy$t0pianUnIc0rN`).

- [Create your free github.com account on github.com](https://github.com/)


## Creating Your Private Course Repository

In CS 340, all of your work will be submitted in your personal, private repository in `@cs340-illinois` on GitHub.  We have developed a GitHub Repository Creator that will create a private repository for you in `@cs340-illinois` and set it up with the permissions so that course staff can also access you work.

- Complete the GitHub Repository Tool **all the way until you have a CS 340 repository link**: [https://edu.cs.illinois.edu/create-gh-repo/fa23_cs340](https://edu.cs.illinois.edu/create-gh-repo/sp24_cs340)
- You will need to use your repository link in the steps below (highlighted in yellow)


## Creating a Local Clone of Your CS 340 Repository

The `git` workflow is designed around working on a **local clone** of your repository that you regularly synchronize with your GitHub repository.

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<style>
main ol > li {
  margin-bottom: 20px;
}
</style>


1. On a terminal, **navigate** to your CS 340 directory (`cs340`): <pre class="language-bash"><code class="language-bash">cd cs340</code></pre>

2. **Clone** a local copy of your git repository with the following command (making sure to replace `YOUR-GIT-REPO-URL` with the URL from the "Course Repository Tool" above):

   <pre class="language-bash"><code class="language-bash">git clone <span style="background-color: yellow; color: black;">&lt;YOUR-GIT-REPO-URL&gt;</span> <span style="background-color: lime; color: black;">&lt;NETID&gt;</span>
   <span style="color: #42c26b"># Ex with HTTPS: git clone <span style="background-color: yellow; color: black;">https://github.com/cs340-illinois/fa23_cs340_gcevans</span> <span style="background-color: lime; color: black;">gcevans</span></span></code></pre>
   <span style="color: #42c26b"># Ex with SSH: git clone <span style="background-color: yellow; color: black;">git@github.com:cs340-illinois/fa23_cs340_gcevans.git</span> <span style="background-color: lime; color: black;">gcevans</span></span></code></pre>

   - **⚠️ You may get errors running this command and will need to set up your access to your GitHub.** 
   - `git` error messages are very good!  Often the error message will contain a URL where you github provides you the next steps (ex: generating a token, adding OAuth permissions, etc).  This command must be successful before you can continue.
   - GitHub is continually changing how parts of their system work; we recommend avoiding anything marked "beta"

3. Once you have a clone, **navigate** into your git directory by going into your NetID-named folder:

    <pre class="language-bash"><code class="language-bash">cd <span style="background-color: lime; color: black;">&lt;NETID&gt;</span></code></pre>


4. **Connect the release repository**, which is where initial code will be provided for you as part of CS 340:

    <pre class="language-bash"><code class="language-bash">git remote add release https://github.com/cs340-illinois/fa23_cs340_.release</code></pre>
    
   - **If you get ANY OUTPUT AT ALL, it was NOT successful**.  *(No output means no error! :))* 
   - `git` error messages are very good!  Carefully and completely read the error message to help you out.
   - If you are not sure, you can run it again and it will say that "the remote already exists".

5. Finally, let `git` know your student identity (replacing your name and e-mail):

    <pre class="language-bash"><code class="language-bash">git config user.name <span style="background-color: cyan; color: black;">"Your Name"</span><br>git config user.email <span style="background-color: cyan; color: black;">"netid@illinois.edu"</span></code></pre>













