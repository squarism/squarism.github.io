---
layout: post
status: published
published: true
title: Why A Dev Log is Great - Two Years Later
date: 2017-04-10
---

![pensieve from harry potter](/uploads/2017/pensieve.jpg)

I wrote about setting up a Dev Log about two years ago.  At this point, I've been using
this setup for two years so I thought I'd write a little bit about it as a follow up.
After all, I hate [uninvolved advice](https://twitter.com/squarism/status/851568859232350212).


## What Have I Learned

I've learned that the dev log works as a pensieve.  It's a dumping ground for code snippets
and dreams.  I found it a good outlet for frustrations too.  But most importantly, it's
like an archeology site.  Let me give you the best payoff of the dev log as a small story.


### SSL Only Mystery

We use an external API for mobile stats tracking.  It will track installs and other things
from the app store.  It's wired up to our own API through a webhook.  This webhook has a
URL configuration.  Originally, it was something like `http://api.example.com/...` and it had
a payload and other such details.  We hadn't received data from them in many, many months.
I started looking at this but basically had no context other than this.

Of course, the first question in debugging is _what has changed_.  So what did changed?  I
didn't think anyone had messed with the config in months because essentially this service was a
set and forget kind of thing.  We also hadn't received Android or iOS data on the same day.  Too
suspicious, too convenient.  So, I knew the data it stopped working.  Let's go to the dev log!

What did we find on the day that it stopped working:

```
Switch to temporary SSL redirects by default
```

Later, there are some clues that we were working on making the temporary redirects into
permanent redirects.  There's notes all around this timeframe that we were working on making
the site SSL-only.  Ah.

Change the webhook to `https` and bam, we start getting rows in the database of payloads.
The URL didn't jump out to me as _wrong_.  It's obvious now but the dev log helped trigger
some clues around this.  The clues were also in the git log but not the surrounding context
that we were working on making the site SSL-only.


## The Surprise of the Double Me

Just as when you don't have a pair and you need to be the "high level person" and the
"low level person" all at once, I've found that my complaints and frustrations come off
_TO MYSELF_ as whining.  This is amazing.  Let me say this again.

> Logging frustrations in my dev log comes off as "whining" to myself later.

I still think this is good if it's a healthy outlet.  It's *not good* if it lets you polish your whining so it
can be delivered as a pithy zinger to an unexpecting listener.  The dev log is about capturing your thoughts.
Be careful what your thoughts are, you might get what you want.  I still like to capture task changes as this
represents time lost or spent.


## Do Not

Don't tag or organize your thoughts into an ontology or fancy structure.  The idea is to get in and get out.
One friend is good enough with org-mode that he was able to structure his log more than me.  That's fine.
Make it your own.  But don't start making per-project logs, I think it would just self-destruct.

I however would leave clues for myself like `LEARNED:` or `TIL` which could be used for retros.  Or `PR: S3
refactor` if I opened a pull request.  The idea is to capture _what have you been doing_ or _what is your time
being spent on_.  I capture interruptions or helping someone too.  That's a great thing to jot down when you
first come back to your desk or switch from Slack.

## Two Years Later

`10435 lines` and two years.  My intention or goal was never length.  It was always the pensieve.
Reading back on it is a massive log of bugs, TILs, tech gotchas and a frustration heat-sink.  There are
face-palm mistakes, logs of miscommunications, "this library doesn't do that" notes and details.

> # 2017-02-28 - Tuesday
> Trying to do a deploy, S3 goes down.

There are rabbit hole results with fantastic details right before you come back from the rabbit hole:

> Envconsul won't work for us because of our combination of unicorn zero downtime deployment configs, how we
> want to handle ENV restarts and a limitation of Go (golang).
>   envconsul won't work because it does in fact restart the app correctly if -once
>   is passed and you -QUIT the worker.  But since -once has been passed, you can't reload the environment.
>   https://github.com/hashicorp/envconsul/issues/52

This is the detail I wanted to capture so I can chunk it later as "we can't use envconsul" and then I can just
text search for this later.  This is how it actually worked many times.

