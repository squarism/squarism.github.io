---
layout: post
status: published
published: false
title: Great dev log with vim and iTerm
date: 2015-11-13
---

> What did you do this week?
> _Um. Uh. (remembering intensifies)_


I have this problem a lot at work.  I'm cranking on stuff, figuring things out
day to day but if someone asks me what I've done, I have no clue.  Being put
on the spot sucks.  When something sucks, it's a problem.  Put it on the
tool sharpening list.

So what can we do?  It's pretty easy and I don't want to drone on about it.
Keep a diary.

I want to:

* Keep it simple.
* Have it be easy to use, non disruptive.
* Actually use it.  Something that I'm not going to hate, throw away or give up on.

## A Nice Setup

iTerm allows you to launch a terminal with a global hot key and run a command.
What's better is that it stays out of your way when you click away.


### iTerm Setup
Configure a new profile in iTerm.  Set a command to run vim.

![iterm_profile_creation](/uploads/2015/dev_log_iterm_1.png)

Make the profile pop up with a hot key.

![iterm_hotkey](/uploads/2015/dev_log_iterm_2.png)

Viola!
![iterm_hotkey](/uploads/2015/dev_log_log_3.png)

Combine this with a quick vim script to insert the date headers (including knowing what weekends are),
it's pretty nice.

### Vim Setup

...

## Awesome Things This Does

### No more remembering during standups

During standups or retros, I can convert this quickly into a summary:

* What I worked on
* What I'm waiting on

Whatever your format is, your log is what you did and you won't forget stuff.


### No more forgetting that cool command you typed

Sometimes I browse my history to find that `curl` that worked.  But which one?
In my dev log, I'll just paste in a command or _the thing_ that actually worked.
Maybe I was debugging something because I forgot something silly.  Writing that
down is like a tiny "hurrah" but also a breadcrump to *future me* what the hold-up was.


### Weekend Me

I don't think about work on the weekend.  Monday me hates this.  With a dev log, this
isn't a problem.  I just review Friday and that's enough to jog my memory.
