---
layout: post
status: published
published: true
title: Sciencing Out Updates
date: 2021-09-10
---

During a project's life, the minimum amount of change you will encounter is from security updates sources.  There are many sources of change.  If you are going to switch versions, bump a package, try a new framework version or port to a new language version that is a big lift; the least you could do for yourself is make it less stressful.  I'm going to describe a nice workflow for the simpler versions of this situation.

I'm using python as an example just to highlight some tooling but this is not python specific although I hope this is a new take or maybe cross-pollinated from other tech circles than python.


## Try Updates In A Branch

There's a workflow around updates that I wish I could write on the moon.  Given ~90% code coverage and lots of confidence in the test suite, here's how I would update a project in a major way (say moving from like python2 to python3 or updating Django by a major version).

```bash
git checkout -b python3_update
asdf local python 3.9.6 # asdf is an "every language" version manager
poetry run task test # invoke pytest
# note errors
# let's say requests throws an error
poetry update requests
poetry run task test # invoke pytest again
# keep iterating, you have a list of stacktraces at this point
# work the list

# on test suite pass, commit the change for python
# remove .tool-versions if `asdf local` created one
# edit pyproject.toml (upcoming PEP that poetry already uses) to require 3.9.6
# commit everything (this should be package changes in your deps and lock file and the pyproject python version)
```

Now the effect of this is:
* You can open an MR with all the code and all the change that represents moving from python2 -> python3
* The person reviewing can replicate by doing `poetry install` and will receive an error message saying "you need 3.9.6" etc
* The reviewer has a better time, new hires / project members have a better time
* The best part of this is ... it's a branch for a major change.  Minimal worry and then less stress.  It's an experiment and a commit.  CI reuses it.
* This same workflow can work to update django or flask or something huge and *you have a list to work on*

This is a great workflow to me.  It's very familiar to me from other languages.  I'm not saying the upgrade is automatic, I'm saying this is more like an experiment where you measure and find out how hard the upgrade is going to be.  Not doing at least this flow makes me think of hoping and praying and I think it's enabled by tooling so that's the next topic.

### What We Are Really Doing

1. Specifying dependencies we want to try
1. Setting up an environment to measure things in
1. Exercising as much of our code as we can
1. Asserting things

When we measure our code for defects in the environment that includes updated packages or language runtime, we try to find out as much as we can.


## The Tools in Play

### Dependencies

Our project's dependencies are managed by a human-editable project file and a machine usable lock file.
The dependency file is `pyproject.toml` and the lock file is `poetry.lock`.  There are other tools but they follow this pattern.

  1. You edit the dependency file with what you want
  2. You run an explicit update and the dependency tree is resolved (hopefully, this is not guaranteed)
  3. Your lock file is written with the solution
  4. Your update is complete and repeatable

### Language Runtime

Dynamic languages need a runtime or [really a development environment](http://squarism.com/2017/02/25/porting-ruby-to-crystal/) (unfortunately).
Poetry has a section for this:

```toml
[tool.poetry.dependencies]
python = "^3.9.6"
```

Using requirements.txt won't get you this.  There's also sort of a different take on this with `.tool-versions` and [asdf](https://github.com/asdf-vm/asdf) which will switch versions for you automatically.  You can drop a file in your project declaring what you want.  Your shell or language manager might pick up on this file so you aren't activating and deactivating.

The downsize of not setting your runtime or your packages in a more permanent way is that all commands you would run are prefixed with `poetry run`.
Some people find this really annoying.  They might find this so annoying that they bail on the entire idea.  I have a few workarounds:

1. Make an alias.  In fish, when I type `pr` it autoexpands to `poetry run`.
2. Use long running commands like test watches or http servers.
3. Get used to it?  :|  Many other languages have prefixes: `yarn run foo` and `cargo foo` and `bundle exec foo` and others
4. If you have an app, make a bin dir full of helper scripts.  You probably want these anyway instead of README blocks.
5. If you embrace prefixes, you can use [taskipy](https://github.com/illBeRoy/taskipy) and get `poetry run task foo`, stay in python and avoid Makefiles.


### Git Branches

By using all these files that are inside the project, nothing exists outside the project except for the install directory.
Thusly, you can commit everything and your major change is able to be viewed as any old change.


## Larger Upgrades

On a huge project, this simple approach doesn't work.  A large lift is a long running branch, those are no good.  It's going to be horrible to maintain parallel branches and deal with merge conflicts.  Scaling this out is kind of beyond what I wanted to talk about but [you can read about](https://github.blog/2018-09-28-upgrading-github-from-rails-3-2-to-5-2/) Github's major upgrade which will show you some similar tricks.  In their case, the workflow is very similar (but different).  They ended up with a 2,000 item todo list off a branch and iterated.  It's [a good listen](https://www.youtube.com/watch?v=ZkSER2NQNZU) about scaling this idea out.

  
## Conclusion

This post is focused on python but it's not about python.  I've taken this workflow to many languages and if the tooling is in place,
the flow stays familiar.

1. Checkout a branch to play in
2. Make changes
3. Measure change with tests
4. Commit changes for review

This is just the basics to me, failure is still possible.  You'd want smoke tests and other tooling.  I just wanted to describe how language tooling is an enabler.