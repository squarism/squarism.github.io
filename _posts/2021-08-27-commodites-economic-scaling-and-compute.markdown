---
layout: post
status: published
published: true
title: Commodities, Economic Scaling and Compute
date: 2021-08-27
---

<img alt="Photo by Andre Medvedev on Unsplash" style="width: 100%; margin: auto;" src="/uploads/2021/engine.jpg" />

I wanted to chat about economic engines, side effects and network effect type sources of change.
These topics are very broad and so please bear with me.  I hope you see an interesting pattern and don't get too caught up in the specifics.

## A Bookstore Makes The Cloud

This is probably the most recognizable one so I'm starting with this first.

AWS had a successful online bookstore.  They [eventually enhanced their site](https://en.wikipedia.org/wiki/Amazon_Web_Services#Founding_(2000%E2%80%932005)) to include other types of products but the the initial push was books.  As they scaled their site (fueled by success) they had extra compute capacity but also a shared platform for internal and external sites.  Eventually they decided to open up the platform to everyone and sell the service.  What was useful for them internally and a limited number of customers could be useful for everyone.

Eventually the scaling was so successful that it became a named compute paradigm.  In certain workloads and architectures using AWS is so cheap and effective that it's a bit of a defacto choice.  The word Cloud before AWS would likely get you a [rare network symbol](https://en.wikipedia.org/wiki/Cloud_computing#History) search engine hit but now it generally means something else.  Cloud Computing is advertised during NFL games and should be credited to AWS and its bookstore engine.

> A bookstore creates a new compute paradigm


## Video Games Created HPC GPUs

Video games are compute intensive simulations.  Video game players demand high performance.  Nvidia and other companies invented GPUs to bring that performance for these simulations.  GPUs would increase in power every year, funded by gamers who want high performance and companies who wanted their games to _pop_ and astonish.  Eventually Nvidia would create a slightly more general purpose language called CUDA which could run specialized code on these GPU cards.  Originally, CUDA was intended to run small programs called shaders to do specialized effects or work in a game.

Eventually, someone realized that you could use this general-ish language CUDA to do meaningful work on wide datasets.  The width of the datasets were a close match for the wide nature of video game pixels.  Doing this same work on CPUs would be too slow.  This is already what video games had experienced for graphics and given birth to GPUs in the first place.

Eventually Nvidia would create a new business division around selling GPUs to companies doing High Performance Computing (HPC) and Machine Learning (ML).  Many new and interesting innovations would come out of this progression.  HPC was a concept before and there were many other products and companies involved but following just the Nvidia story illustrates the point.

> Gamers funded modern HPC and compute


## Mobile Phones and Processor Manufacturing

This one is really interesting to me.  There are two parts to this.  One, manufacturing.  The other, architecture.

First, CPUs have a long history but let's focus on recent events.  ARM recently has been challenging x86 on a performance front but instead I want to focus on process nodes.  You can't really compare process nodes between manufacturers but let's try anyway.  Why is Apple on 5nm and Intel (king of kings for so long) on 14-10nm manufacturing process?

Making chips is hard.  Apple doesn't make their own chips.  Who are they using and who are they?  Today, TSMC is making Apple's M1 chips on their 5nm node which has been fueled by mobile phones.  [TSMC has gained so much experience](https://www.tomshardware.com/news/arm-6-7-billion-chips-per-quarter) from making mobile phones that they are really good at it.  Samsung makes phones, it's the same and Samsung is also driving transitor density at scale.

Even if Apple wanted to work with Intel, they wouldn't do it.  TSMC is doing leading edge work and buying the majority of ASML's EUV machines.

> Mobile phones change transitor manufacturing


## Processor Speeds Increase Network Bandwidth

This is really outside my lane but I talked to a low level network engineer about this (and so my understanding is simplified).  He said that compute speed is speeding up network speed.  As an example, two switches with a fiber cable connected between them will emit and multiplex light at a certain rate.  This rate is CPU bound.  As processor (or CPU speeds) increase, so does bandwidth.  We weren't talking about your ISP or specific products.  What I mean is, why have progressed at all from 10mb to 100mb to gigabit and beyond over the same physical medium (copper)?

Or put another way, have we hit the theorical limit of fiber?  Do we know what the practical limit is?

The answer to both of these is no.  We're doing more and more tricks with light divisions, noise and other things but the fiber itself is unchanged.  We'll find out the limits when the system is no longer CPU bound.  It doesn't really have a lot to do with fiber.  Copper hasn't changed either.

So whatever processor side effects I've mentioned above would also affect this thing here.

If Apple came out with an ARM chip that is one million times as fast as any specialized processor, ASIC or other chip; you'd use it for network switching and set a network world record (assuming the same amount of noise).

> Processor speed improvements increase global network bandwidth


## Commodity Processors

A long time ago, x86 was pretty bad compared to IBM (power) and Sun (sparc) chips.  "Real" servers would run on these custom chips.  But then commodities kicked in.  Not just on the CPUs themselves, but even the motherboards.  There were Dell server motherboards so cheap and derived that you could saturate the PCI bus by filling in all the I/O cards.  This wasn't the case with Sun boards but the Sun boards were much more expensive.  This would be the equivalent of today of having a server chip without enough PCI-E lanes.

Eventually Intel chips would be faster and cheaper than the IBM/Sun chips.  Even if the technology was better (or different) in many ways, it didn't matter.  In this way, commodities were one piece of it but the other was performance.  Intel got all this economic fuel from desktops, gamers and cheap servers.  The mass market was fueling the engine.  Now the same is happening from mobile but [it's architecture](https://debugger.medium.com/why-is-apples-m1-chip-so-fast-3262b158cba2).  There's the very real possibilities that we are at an inflection point and chip manufacturers are going to have to catch up.  But Apple has 2 trillion dollars (mostly from mobile).

The same thing happened with the PS3 to PS4 transition.  PowerPC was based on IBM's power architecture.  This was dropped for x86.  In the future I wouldn't be surprised if consoles were ARM or something that reflects economies of scale.

How did this happen?  Why couldn't x86 keep up?  I think it's mobile phones.  Just look at Apple's revenue and where it's coming from.

> Commoditity x86 replaced POWER and SPARC server chips

In the future, maybe commoditiy and server x86 chips are replaced by ARM which was fueled by mobile phones.  When this happens, there will be another reductive quote here.  :)


## Wrap Up

I hope these reductive cause and effect topics aren't too polarizing.  I just wanted to highlight some second-order effect engines of [S-curves](https://www.open.edu/openlearn/nature-environment/organisations-environmental-management-and-innovation/content-section-1.7) and a few examples in one place.
