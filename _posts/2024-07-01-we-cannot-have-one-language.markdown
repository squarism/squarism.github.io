---
layout: post
status: published
published: true
title: We Cannot Have One Language
date: 2024-07-01
---

Why don't we just invent a programming language to do everything?  Why are there so many?  Have we ever had a language that does everything?  Could we have one language that does mostly everything?

I understand the historical context and the common answers to this question but I want to approach this from a
different angle and even make a prediction heuristic related to my [Microframeworks Are Too Small](https://squarism.com/2023/12/20/microframeworks/) post.  I think there's something deeper than the platitude _"use the right tool for the job"_.  I think we've never had a language that is both human-happy and machine-happy and I'll explain why.


## Low and High Complexity Apps

Let's set context.  When I say low level, I mean something like:

- I can write firmware for this embedded dev board I just handed you without [a
    transpile](https://learn.adafruit.com/welcome-to-circuitpython/what-is-circuitpython)
- I could write a Linux kernel driver and not just because Linus approves of it
- At some point, someone mentions pointers

This is a rough definition but I think you get the point.

When I say a high level app, I mean something very close to the business.  A marketing dashboard.  A complete
native desktop application.  A Photoshop clone.  A web appplication with a shopping cart, a job queue and push notifications.  Big things, lots of polish.  Less talk about computers, more talk about what we're doing with them.

<img alt="A random sales dashboard" style="width: 100%; margin: auto;" src="/uploads/2023/dashboard_nonsense.jpg" />

Try building this dashboard above in a single language like Rust / Go / C or assembly.  Try doing it without any webtech.  Now add the ability to print it to PDF or be read by a screenreader.  Try adding high DPI scaling and zoom levels.  Make it scale down on mobile phones.  Don't use a browser, HTML, Javascript or CSS.  I think some of you might have considered trying making that dashboard in Rust until the list of features kept growing.

The inverse is also true.  Try building a Linux kernel module in PHP or Javascript.  Building a marketing
dashboard in Go (and Go only) is extremely difficult.  But, why?  Why can't we have a language that is fast
and productive that lets you scale all the way from pointers and registers to the marketing manager doesn't
like the cornflower blue I picked for the campaign header?  Or, more importantly, have we ever had a language
like this and could we have it?

> Use the right tool for the job

Yes, but I think it's deeper than this.  Why can't we have the right tool work in two places like a multi-tool?  I don't think we've never had a single language and I think we won't ever have it.  There's some fundamental tradeoff that cannot be defeated.  More than that, I want to make a heuristic of predicting what will be possible when the next hot language is hyped or announced.

<!-- more -->


## Languages Have Hits

It seems like certain languages make full-feature frameworks and others do not.  Some of the most feature rich
frameworks are:  Next / Remix / Laravel / Django / Rails / Phoenix / .NET and Spring Boot.  There is quite a
bit of variance in these frameworks but I think they follow a certain pattern.  Additionally, many of the low
level languages only have microframeworks.  C and C++ essentially do not have a web framework worth
mentioning (sorry).  Why?  If C++ is so great, you could solve any problem, right?  Turning complete and all
that?  Why not just make a web framework like Next.js in C++ and shut-up the haters?

I think it's impossible.

Take Laravel / Next / Rails and Django.  They are pretty similar although I haven't tried Laravel myself.
Just looking at the docs, it seems like they have a similar feature set.  Even inertiajs had an official Rails and
Laravel adapter (things [have changed](https://inertiajs.com/community-adapters) it seems).

So the languages with hit frameworks are the dynamic or scripting ones.  The ones that don't compile to
binary.  And the middling ones are VM based.  Elixir has Phoenix which is very good but not entirely feature
complete (imo) compared to the others.

```
┌────────────────────┐       ┌────────────────────┐
│ Python / Ruby / JS │       │ Script-ish runtime │
└────────────────────┘       └────────────────────┘
┌────────────────────┐       ┌────────────────────┐
│ Java / C# / Elixir │       │  Virtual Machine   │
└────────────────────┘       └────────────────────┘
┌────────────────────┐       ┌────────────────────┐
│     Go / Rust      │       │      Compiled      │
└────────────────────┘       └────────────────────┘
```

Excuse the broad categories in the right boxes, especially script-ish languages (they invoke plain text, even if compiled to
bytecode).  What I mean is, they invoke source files directly.

Because the top languages are so productive, they sometimes have many good options.  In some cases, they are
overly productive.  Javascript has so many frameworks, it's a meme.  I'll mention Rich in Python later.

I won't deny that some of this is socio-technical.  But Go's hit applications have mostly been CLIs and daemons and not much else.  One of the biggest Go hits has been Docker and yet the GUI for Docker Desktop is written in web-tech.  Try hitting your keyboard shortcut for zoom out in Docker Desktop and you'll see this.

<img alt="Docker Desktop zoomed out way too far" style="width: 80%; margin: auto;" src="/uploads/2023/awkward.jpg" />

So, would we ever have a future where Docker Desktop could have been written in Go?  Is anyone going to try and succeed?



## Apps Have Complexity Tiers

```
┌────────────────────┐     │
│  Fullstack Webapp  │     │  ┌────────────────────┐
└────────────────────┘     │  │   Frontend Realm   │
┌────────────────────┐     │  └────────────────────┘
│   GUI or Mobile    │     │
└────────────────────┘     │



┌────────────────────┐     │
│   TUI framework    │     │
└────────────────────┘     │
┌────────────────────┐     │
│ CLI flags library  │     │  ┌────────────────────┐
└────────────────────┘     │  │   Backend Realm    │
┌────────────────────┐     │  └────────────────────┘
│    File library    │     │
└────────────────────┘     │
┌────────────────────┐     │
│   Kernel Module    │     │
└────────────────────┘     │
```

Roughly speaking, application types settle around groupings of complexity.  There are many other tiers and
examples but this is probably good enough of a list to continue with.  Swift is possible to
have [on the server](https://www.swift.org/server/) but it's either not possible or not popular
to try to force Swift all the way down the stack to the frontend.  In the case of Swift and
mobile, it gets very close because Swift controls its own destiny through iOS.  It's also
arguable that it has a frontend to LLVM which itself is written in C++.

My point is that I think this is an unsolvable [Flexibility vs
Usability](https://en.wikipedia.org/wiki/Flexibility%E2%80%93usability_tradeoff) tradeoff.  The
productive languages are stuck in their sweet spots and the bare metal languages are too hard
to work with.  For any attempt to make [yourself the web yet](https://www.arewewebyet.org/),
something else will be shipping or changing by the time you are done.

We cannot have a language that scales up and down this complexity spectrum and we never will.
This is why I have historically had two active languages: a _CLI language_ and a _"dashboard" language_.  You can make a CLI in Rust but if you want a GUI, you have webtech in Tauri.  This is very similar to punching out of C++ to Lua in a game.  If you think about it, Javascript is embedded in a browser like Lua in a game engine is.


## Productivity

Let me make a wild extrapolation here to set up my next point about human-happy.  Python has a library called Rich which is really quite a lot of polish.  Look at this extra-credit homework as an example of how much productivity there is here.

<img alt="Python library Rich terminal text colors demo" style="width: 100%; margin: auto;" src="/uploads/2023/rich.jpg" />

Ruby has
[lolcat](https://github.com/busyloop/lolcat) to print out rainbows in the terminal.  Similar terminal polish
libraries exist in Go from [charmbraclet](https://github.com/charmbracelet/bubbletea) but Go doesn't go as far
into the upper tiers of apps, even with [Gobuffalo](https://gobuffalo.io/).  Ideas in browser Javascript from the frontend get ported back in the case of [Ink](https://github.com/vadimdemedes/ink) which uses JSX for CLI apps.

There are many other such _extra-credit_ libraries.  It's almost as if the community has so much productivity that they can mess around.  It's not just Rich in Python.  If there's a progress meter in Go and a progress meter in Python then the Python one has themes.  If there's a logging library then the Python one has bluetooth support.  It's not about bloat, it's about productivity.  It's been like this for a long time and I think a prediction could be made.



## Human Happy vs Machine Happy

Languages usually fall into either the category of human-happy or machine-happy.  Human happy languages are productive but slow executing.  Fast executing languages are slow to write for humans.  We've never had a language that is both human-happy and machine-happy as compared to the other options at the time.  We can seem to have a sort of a middle of the trade-off spectrum in the form of VM languages, which is interesting but they still don't scale up and down.  Windows Vista was famously attempted to be written on .NET which is a VM language but it wouldn't scale.

So, if a new language comes along and it's compiled, mentions pointers and is tied to math concepts for the sake
of purity then it's probably machine-happy.  Which means it's not human-happy.  We can predict it's not going to have many design systems, GUI options on the order of infinite CSS libraries and be an appropriate choice to make a marketing dashboard.  The inverse is true.  If a language is easy to use and there is a lot of productivity, activity and open source options then you know it won't be great to use lower down.  It's similar to the _use the right tool_ but what I think is interesting is this human vs machine happy thing and how, in my opinion, we won't ever have one language.

If at any point you could make an efficient, machine-happy program, you could just select a slower-executing human-happy language to solve even more problems.  So, it seems like the trade-off is eternal.
