---
layout: post
status: published
published: true
title: Great dev log with vim and iTerm
date: 2015-11-13
---

> What did you do this week?
> _Um. Uh. (remembering intensifies)_


I have this problem a lot at work.  I'm cranking on stuff, figuring things out
day to day but if someone asks me what I've done, I have no clue.  Being put
on the spot sucks.  When something sucks, it's a problem.  Put it on the
[tool sharpening list](https://devchat.tv/ruby-rogues/129-rr-sharpening-tools-with-ben-orenstein).

So what can we do?  It's pretty easy, just keep a *diary*.  But there are some specifics that I've worked out because
I've had _Lists of Lists™_ before.  I've learned that _Lists of Lists™_ do not work.

I want to:

* Keep it simple.
* Have it be easy to use, non disruptive.
* Actually use it.  Something that I'm not going to hate, throw away or give up on.


### A Nice Setup

iTerm allows you to launch a terminal with a global hot key and run a command.
What's better is that it stays out of your way when you click away.


#### iTerm Setup
Configure a new profile in iTerm.  Set a command to run vim.

![iterm_profile_creation](/uploads/2015/dev_log_iterm_1.png)

Make the profile pop up with a hot key.

![iterm_hotkey](/uploads/2015/dev_log_iterm_2.png)

Voilà!

![iterm_hotkey](/uploads/2015/dev_log_log.png)

Combine this with a quick vim script to insert the date headers (including knowing what weekends are),
it's pretty nice.


#### Vim Setup

_(completely optional)_

Here's a shortcut that will add a header like `# 3000-12-25 - Thursday` at the top of the file.
Assign it to a shortcut and hit that at the beginning of the day.  Put this in your `.vimrc` or `.vimrc.local`
depending on how you have vim setup.

{% highlight vim %}
" Insert the date at the top of a development log.
nmap <leader>N ggi# <C-R>=strftime("%Y-%m-%d - %A")<CR><CR><CR>
{% endhighlight %}

Now, in command mode, hit `,N` for next date.  It will jump you to the top and start today's entry.
It's fast, it's nice and it stays out of your way.  You'll do this all the time so this is important.

{% highlight text %}
1 # 2017-01-26 - Thursday
2
3 █
{% endhighlight %}


### Awesome Things This Does

#### No more remembering during standups

During standups or retros, I can convert this quickly into a summary:

* What I worked on
* What I'm waiting on

Whatever your format is, your log is what you did and you won't forget stuff.

As a bonus, after using this log for a while, it also can show you how hard you've been working and keep
yourself from being too hard on yourself.  That _thing_ you really tried hard on that you forgot where you
left it, maybe you chunked it as a failure *when it was not a failure*.  Maybe you left yourself enough detail
to show:

> I could keep going on this experiment but the point was proven.
> I ran into a limitation beyond my control.
> I tried many different options and approaches but the technology isn't ready or something else is up.

As time goes on, this chunking effect is more dramatic.  Wait until you forget how hard you tried.


#### No more forgetting that cool command you typed

Sometimes I browse my history to find that `curl` that worked.  But which one?
In my dev log, I'll just paste in a command or _the thing_ that actually worked.
Maybe I was debugging something because I forgot something silly.  Writing that
down is like a tiny "hurrah" but also a breadcrump to *future me* what the hold-up was.


#### Weekend Me

I don't think about work on the weekend.  Monday me hates this.  With a dev log, this
isn't a problem.  I just review Friday and that's enough to jog my memory.


### Advice Time

I've been using this for a year and it's been amazing.  I've done it everyday.
So let me hand out some advice.

- Don't create multiple files.  If you work in multiple teams, don't try to orgranize
your thoughts into teams.  Just split it up by day.  Embrace the chaos.  This is
quick.  Hit key, brain dump, hit key, keep working.  If you hate this and it keeps
you from logging then change this advice.  I think most people would hate having
to categorize work into separate files.

- Don't worry about tagging or searching.  I only tag things like TIL so it jumps out.
Not even for retrevial.  Text search works fine.  I have 7500 lines from 1.5 years of
content and I can find anything just with vim text search.

- Make it yours.  If you don't want to call it dev_log.md, call it something else.

- Whatever you hate about this blog post, change it.  The real idea is: solve a problem for you,
in my case and most people's on my team it has been remembering what you did and remembering your wins.


