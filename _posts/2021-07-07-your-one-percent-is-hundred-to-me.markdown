---
layout: post
status: published
published: true
title: Your 1% A/B Testing is 100% To Me
date: 2021-07-07
---

There's this popup thing happening.  I'm not sure it's because [I really don't care about GDPR cookies](https://addons.mozilla.org/en-US/firefox/addon/i-dont-care-about-cookies/) is making me exhausted.  I think there's this business optimization thing that I want to talk about.

<img alt="youtube red popup" style="margin: auto; width: 85%; " src="/uploads/2021/youtube_red.png" />

Imagine we have a company.  We've been in business for a while and we're public.  There are many stressors and influencers.  Being public, the biggest is money, shareholders and the board.  It's all very complicated and I'm kind of outside my lane.  I majored in business and this barely gives me a leg to stand on but just hang with me for a bit.

So there we are, pulling in 10% margins or whatever we have.  It really doesn't matter.  The business is what it is.  It's a machine that generally makes 10%.  But, along comes automation and analytics.  And we find a sub-machine.  If you pull this lever, you get a few more hits on the website.  And us having scale, dashboards and reports; this is almost like a noise function through a filter.  If we send an email, we make X.  If we send an SMS, we make Y.  If we put a banner on the site, we make Z.  On and on.  We're tracking our lever pulls and our knob twists.  This is what we wanted all this information for.

So we make our site, our cart, our onboarding, our existing users' experiences all like this.  Not on purpose from the start but iteratively through many small changes.  If we send an SMS, we make X.  Just on random noise.

```ruby
# sample all users as some_users
# send marketing to some_users

Flipper.enable_percentage_of_actors :youtube_red_popup, 1
```

But now in this (long established) digital world everything is like this.  I get sampled so often that I get popups as not occasional crackles and pops but as constant noise.  This is aggregate personalized noise across all the services I use.  I get the random sampling so often that I approach the constant random noise that the feature flags were trying to avoid from their perspective.  But this is the problem, it's just one perspective.

> If I am 1% sampled 100 times, I get 100% random sampling because I'm using 100 services making 100 decisions.

The particular numbers I'm using are being cute.  I'm sorry.  My point is, it's not 1% sampling to me.  I'm a part of many things but the single **things** think that they are everything.

In _Fast and the Furious_ everything is cars.  Cars solve all problems.  There are no bikes.  So A/B testing which car produces the most click-through makes all the sense in the world.  But you can't consider bikes.  Bikes don't exist and certainly not bike click-throughs or bike prompt exhaustion.  "It's only 1% car prompts, that's not that annoying."

Ok, back to the youtube red popup.  Even if we could design a popup with memory (this absolutely could be a thing), no for-profit company will use it.  We could absolutely design a popup component that has memory.  "How many times has Chris dismissed me?  Maybe I'm annoying!".  No one would use it.  Certainly not at scale.  At scale, 1% is amazing.  It enables projects, it destroys worry.

<img alt="youtube red popup" style="margin: auto; width: 100%; " src="/uploads/2021/error_boundary.png" />

There's [this great talk from Velocity NY 2013](https://www.youtube.com/watch?v=PGLYEDpNu60) where Richard Cook explains that businesses never know where the failure line is.  This isn't really in the same domain as reliability but I think it applies.  It's a great talk, you should watch it.

You fiddle with these knobs and see the profits coming in but who is going to represent the users?  It's only until after you have negative revenue impact that you'd have ammunition to argue against money.  The feature flags continue.