---
layout: post
status: published
published: true
title: Git is Below Your Project
date: 2021-07-05
---

I've sometimes seen people asking about dependency management, hooks, tracking bugs and other sort of higher level (to me) things than git provides.  You can see this if you look at stackoverflow questions about submodules.  What's wrong with submodules?  Well, compared to what exactly?  When I do a clone of a project and run yarn install, it gives me a list of CVEs that match.  When I do a `bundle exec` it loads my project and has an opportunity (with a very high level of context) to tell me that I've forgotten to run migrations or run yarn update in a while.  You don't get this with git.  Maybe these examples are too web-tech specific.  But I'd like to suggest that this pattern will probably apply to Go, Rust and whatever else.  Git is below your project and your project is trying to get better stuff done.  So stop trying to solve your problem with Git and listen to how a few other communities do their thing.

I'll also say that every project is different and as much as I want there to be universal truths, project differences really put some of this stuff into a spin.  A lot of this is "to me".  But, I've also seen people doing "weird stuff" with Git and when I probe, they haven't seen or felt success and so they are turning to Git as the tool they already have in place.

Git is really dumb.  It's in the name.  It's in the slogan.  It only really knows how to work with text.  You can teach it to understand [machine learning binaries](https://dvc.org/) and possibly image assets but this is fighting the default.  Game developers know this well (I don't).  So it's interesting when I see other people trying to do it anyway.  What I see is a lack of tooling in the language they are using.

Let me give some concrete examples.  First, someone that is trying to do Git tricks for a game project.  The answer is go inside your editor (in this case, Unity).  They probably continued with git submodules, I'm not sure.  Second, someone who was trying to track what code is in what place.  They have current releases apparently.  The answer here is probably a spreadsheet, automation software or feature flags (this whole project was a bit of an oddball).  Third, someone who is trying to run code automatically on the repo (git hooks).  The answer here is CI.  Finally, someone who wants to share code between projects so they want to use submodules.  The answer here might be to look at your language's packaging and produce a library just like the ones you are consuming from the Internet.

In each case, the details don't matter too much.  Someone is trying to trick Git into doing something.  It's almost like a challenge.  "If I can sneak past the guard then I can ...".  Just stop for a minute.  Listen to other projects and how they are doing it.  Explore other languages.  You don't have to learn the whole thing.  If you are stuck in Java or C++, learn about Yarn/Cargo/Bundler.  Look at what Go went through.

<img alt="git is a water pipe" style="margin: auto; width: 65%; " src="/uploads/2021/kool-aid.png" />

But most of all, move up a level.  Go into your language, your IDE, your framework or your engine.  Git is this plumbing bringing you water and you need to add the Kool-Aid packet for your Kool-Aid.  It's so much closer to what you are trying to make.
