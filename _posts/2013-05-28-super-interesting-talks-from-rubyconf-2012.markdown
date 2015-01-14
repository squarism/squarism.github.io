---
layout: post
status: publish
published: true
title: Super Interesting Talks from RubyConf 2012
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1998
wordpress_url: http://squarism.com/?p=1998
date: !binary |-
  MjAxMy0wNS0yOCAyMTo0ODoxNyAtMDQwMA==
date_gmt: !binary |-
  MjAxMy0wNS0yOSAwMjo0ODoxNyAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
Trying to summarize someone's 30-60minute talk is really hard.  So apologies go out to anyone I'm trying to paraphrase here.  I took it upon myself to watch every single video from [RubyConf 2012](http://www.confreaks.com/events/rubyconf2012?sort=post) which started airing in November.  It's May now.  There's a lot of content there and you can't just slurp it down and expect to process it all.  So I thought I'd leave little breadcrumbs to myself noting which things were super interesting to me.

[Real Time Salami - Aaron Patterson](http://www.confreaks.com/videos/1291-rubyconf2012-real-time-salami)

Any presentation by @tenderlove is great and this one was fun and interesting as expected.  Aaron talks about parallelism, streaming and making Salami (actual salami).

<!-- more -->

[Tokaido: Making Ruby Better on OSX - Yehuda Katz](http://www.confreaks.com/videos/1284-rubyconf2012-tokaido-making-ruby-better-on-osx)

This was an exciting talk about Tokaido which is a work in progress to make a Rails.app one-click super-easy dev tool for Mac.  He talks about other platforms too, don't worry.  This talk really makes you appreciate how hard this problem is.  There are some super interesting low-level OSX details in there.

[Why JRuby Works - Charles Nutter, Thomas Enebo](http://www.confreaks.com/videos/1281-rubyconf2012-why-jruby-works)

This was a great talk about JRuby and was very convincing presentation.  Since watching it, I've been playing with Torquebox and JRuby.  Unfortunately the audio and video are a bit weird.  For me, I loved the part about garbage collection.  It was a great summary about how good the JVM is at garbage collection.

[Zero Downtime Deploys Made Easy - Matt Duncan](http://www.confreaks.com/videos/1279-rubyconf2012-zero-downtime-deploys-made-easy)

This talk was great.  Matt walks through all the problems you will encounter when trying to reach a large number of nines.  He covers a lot of gotchas, like "whoops that database migration locks the entire table and just took your site down".  He covers how Yammer does database changes, managing job queues and external services when you are trying to keep uptime at maximum.  This was definitely an eye opening talk.

[Y Not -- Adventures in Functional Programming - Jim Weirich](http://www.confreaks.com/videos/1287-rubyconf2012-y-not-adventures-in-functional-programming)

OMG.  This talk left my brain on the floor.  I can't really explain how awesome Jim (he wrote rake) is.  If you want to see the best live coding I've ever seen and learn about the y-combinator, watch it.  I didn't follow along 100% but I was blown away.

[The Celluloid Ecosystem - Tony Arcieri](http://www.confreaks.com/videos/1302-rubyconf2012-the-celluloid-ecosystem)

This was a great intro into everything surrounding the celluloid gems.  More importantly though, it was a _reference_ concurrency state of the union talk.  If you want to learn why the actor model is the way to go (in Ruby or Scala actually) then watch it.

[Ruby vs. the world -  Matt Aimonetti](http://www.confreaks.com/videos/1288-rubyconf2012-ruby-vs-the-world)

A great overview of languages other than Ruby.  His starting point about the Sapir-Whorf Hypothesis - that language influences thought is a great opening to this talk.  Matt chooses really interesting topics and does a good job.  He covers Clojure, Scala and Go.  This is a great talk if you don't know what any of those are or want a quick 'Rosetta Stone'.

[Your app is not a black box - Josh Kalderimis](http://www.confreaks.com/videos/1282-rubyconf2012-your-app-is-not-a-black-box)

This talk is easy to watch.  He does a great job of keeping it interesting.  It's basically a talk about DevOps but more importantly about tooling.  I found this talk very interesting from an ops, polish and motivation.  Please watch this.

[How to build, use and grow internal tools - Keavy McMinn](http://www.confreaks.com/videos/1292-rubyconf2012-how-to-build-use-and-grow-internal-tools)

One of my favorites.  I forwarded to a bunch of people.  Github is worth emulating and Keavy shares insight about tools, culture and teams.

[Asynchronous Processing for Fun and Profit - Mike Perham](http://www.confreaks.com/videos/1290-rubyconf2012-asynchronous-processing-for-fun-and-profit)

A great talk about sidekiq vs redis from the authority on sidekiq.

[Change your tools, change your outcome - Dr. Nic Williams](http://www.confreaks.com/videos/1295-rubyconf2012-change-your-tools-change-your-outcome-the-next-frontier-of-deployment)

Dr. Nic nailed this talk.  Some NSFW language.  Hilarious and interesting talk about getting over nice to haves (like fast MRI spin-up time) and making your app more awesome for Ops people.  Super great talk.

[Grow Your Unix Beard Using Ruby - Jesse Storimer](http://www.confreaks.com/videos/1289-rubyconf2012-grow-your-unix-beard-using-ruby)

A reference talk all about Unix.  I found this very educational even though I consider myself pretty unix savvy.  Jesse is great, he has a book on pragprog.

[Boundaries - Gary Bernhardt](http://www.confreaks.com/videos/1314-rubyconf2012-boundaries)

Amazing talk by destroyallsoftware's Gary.  He talks about an imperative shell vs a functional core which is all the rage right now.  Gary is brilliant.

[Abstracting Features Into Custom Reverse Proxies - Nick Muerdter](http://www.confreaks.com/videos/1270-rubyconf2012-abstracting-features-into-custom-reverse-proxies-or-making-better-lemonade-from-chaos)

Some great ideas about reverse proxies.

[Service Oriented Architecture at Square - Chris Hunt](http://www.confreaks.com/videos/1273-rubyconf2012-service-oriented-architecture-at-square)

Chris walks you through creating a web service like they do at square as if you were working there.  He introduced some amazing open source libraries from square that I need to check out (cane, fdoc, jetpack).  For example, they use jetpack to auto-pack up and deploy a rails app with Jetty.  So all you need is a JVM.

I'm pretty sure I picked more than half of the talks as ones that I found super interesting.  There were many more but I can't just pick everything.  It takes a while to watch all these videos but they are worth your time.