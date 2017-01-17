---
layout: page
status: publish
published: true
title: Questions I Have
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 74
wordpress_url: http://squarism.com/questions/
date: !binary |-
  MjAwNy0wMi0wOSAxNDozNTo0NSAtMDUwMA==
date_gmt: !binary |-
  MjAwNy0wMi0wOSAxOTozNTo0NSAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---

This is a list of personal boundaries.  That is, as I learn or work in a particular area, I reach a limit and some questions remain.  This is also a list of things I want to [grok](http://en.wikipedia.org/wiki/Grok).  This list is incredibly hard to keep up to date.  Which is probably why it's an oddball on the web.  People want this but maybe people don't want to do it.

<em>"The fool can ask more questions than the wise man can answer."</em>

**This list is pretty old (2011 or earlier activity).  I now track a list of spikes to hack on on a personal trello board.**

### Ruby and Rails


- <del datetime="2014-05-31T19:18:59+00:00">How to integrate rapid development into my daily Java based job.</del>  Answer: build solutions where people don't care what language it's in.  Services.
- <del datetime="2010-09-02T18:48:40+00:00">Does Rails3 have anything that would help me code faster?</del>  (jquery helpers, bundler)
- <del datetime="2014-05-31T19:20:33+00:00">How to orchestrate capistrano, github, SVN and my own servers.  Ie: deploying to a test box running apache/passenger from a webbrick dev box through git and having all the seeds and migrations work.</del>This was basically solved with git branches and a very good capistrano deploy.rb script.
- <del>Understand and use migrations.</del>
- <del>Learn how to go from Omnigraffle mock up to working prototype.</del>
- Learn how to build a daemon process, a MVC and possibly multiple nodes/mesh architecture and make it all work seemlessly using the minimum number of quality libraries as possible.
- <del datetime="2010-08-13T16:39:19+00:00">How to integrate JQuery widgets.</del>
- <del datetime="2011-02-03T21:59:01+00:00">Write a gem.</del>  Done: simple printer test
- <del datetime="2010-08-13T16:39:19+00:00">Put a project on github.</del>
- <del>Write a textile README file for doc instead of .txt.</del>
- <del>Use bundler to freeze gems.</del>
- <del>Grok freezing rails.</del> Solved with bundler and vendoring even with private gems.
- <del>Write or use an ORM type layer for LDAP.</del>  Done: used activeldap, a little messy.
- <del datetime="2014-05-31T19:05:04+00:00">Play with memcache.</del>
- Understand <del datetime="2010-09-02T18:48:40+00:00">.collect, .map</del> and .lambda methods.
- <del>Understand the splat operator.</del>
- <del>Write a rake task.</del>
- <del>Write a module as if designing an API and publishing as gem</del> Done this multiple times at this point.  Start with a README.
- <del datetime="2011-08-28T15:11:36+00:00">Write a web service as if designing an API and publishing over HTTP</del>  <a href="http://squarism.com/2011/04/01/how-to-write-a-ruby-rails-3-rest-api/">Done</a>.
- <del datetime="2011-08-28T15:11:36+00:00">Is publishing a test gem to rubygems bad form?</del>  Yes, there's no need for it because you can gem install a local file for testing.
- <del datetime="2011-08-28T15:11:36+00:00">Write a gem for a rails controller, a mix in lib to do security.</del>  This little hint is what became the <a href="https://github.com/squarism/firewool">Firewool</a> gem, a rails firewall plugin.
- Do joins across datasources.  YAML to MySQL to MongoDB to Redis.  Use datamapper or activerecord or both.  Obviously the data has to be logically connected.  What performance tradeoffs are there?  Do any of these gems help with migration?  Could we temporarily load all data into Redis and switch to that datastore type exclusively?
- <del datetime="2016-12-11">Play with better ways of passing data between rails and JS.  Usually I create a hidden form element or use a DOM element for a key for, say, an ajax call to get some other data.  There has to be a better way like the Gon gem.</del>This has WAY been solved by rest and SPAs.
- <del datetime="2016-12-11">Try an <a href="http://www.unlimitednovelty.com/2012/04/introducing-dcell-actor-based.html">actor-based concurrency model</a> like dcell.  I've used threads and eventmachine but I'm still jealous of node.js.  Many ruby-centric articles extoll ruby options but invariably seem to fall short on real solutions.  How good is celluloid and dcell?  How native does it feel?</del> Still no actor model on rails.  Currently things are moving towards Elixir/Phoenix.
- <del>Write a DSL.   Here's an example: <a href="https://www.destroyallsoftware.com/screencasts/catalog/building-rspec-from-scratch">Building Rspec from Scratch</a>.  Write a DSL to rename a bunch of files in a directory.  For example, the mp3 rename problem.  Or vacation photo problem.  Take files named "DSC709.jpg" and rename to hawaii_709.jpg.</del>
- Close a Rails bug.


### HTML/CSS

- Use CSS resets
- Understand HTML5 <a href="https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills">polyfills</a>
- Do a <a href="https://github.com/paulirish/lazyweb-requests">lazyweb_request</a> for Paul
- Understand sass/bourbon/etc.


### Javascript

- <del datetime="2012-09-06T15:42:02+00:00">Use comet for pubsub, ie: database trigger, avoid polling in client.  Can use in many projects: cat_faucet, daemonizing punc (screen scraping) and others.</del>  I create a polling avoidance app called <a href="https://github.com/squarism/pollpole">pollpole</a> which used Faye instead.  This entry was so old is was filed under AJAX which no one even talks like that anymore.
- Grok React.  A todo app to start with.  Finish udemy course.
- React shopping cart.  I could do the API in 3 languages (eventually) but the frontend would be a struggle.


### Node

- <del datetime="2017-01-12">Take an example Sinatra app from the web and write it in Node.</del>  No one cares.  Alt-rails is Go/Elixir right now.
- How could I write an app that reacts to events like when nodes come online?  I mean, behave like Zeroconf.  Peer up etc.
- Is the sweet spot low-level message routing and small utilities?
- Rails gives you so much, why and when would I pick Node?  What's the killer use case?


### Elixir
- Everything.  Read the book.
- Start on phoenix.  Translate rails experience -> phoenix.


### Golang

- Write a file system trigger app (in-progress now).
- Expand on Martini until it reaches Sinatra or Rails levels or functionality.  Can it be my go-to tool for web stuff?
- How do you think at a lower level?  <a href="http://programmers.stackexchange.com/questions/220391/help-me-think-in-c">I've asked this before about C++</a>.
- Finish integrating a few packages and ship it as a single binary (ringu project).
- Rewrite `whatthefi` as golang because it has Slop dependencies which is annoying.  Then blog about it.


### NOSQL

- <del datetime="2017-01-12">Hadoop cluster setup (with VMs or small atom boxes)</del> _high level distributions are the way.  I'm not interested._
- Write a simple map/reduce job other than wordcount.  I stopped at an ecommerce example because it was the
  wrong use case and I understood how many transformations would be required.
- Use a schema-less CouchDB store in a simple rails app.
- <del>Use an ORM layer like Mongoid with MongoDB.</del>
- Write a hotel finder / reservation system using Cassandra / rails.


### Cloudish

- <del datetime="2017-01-12">Use EC2.  Grok the tools.  Find out how many instances I can spin up.</del>AWS is
  large and complicated.  EC2/S3/SNS/VPC (less so)/Data Pipeline are under mybelt now.
- <del datetime="2017-01-12">Figure out if EC2 is cheaper than my servers.</del>  No.  Having a Digital Ocean box is nice though.
- <del datetime="2017-01-12">EC2 with capistrano?</del>Cancelled.  Build with packer.  Deploy with terraform.  Small projects just use heroku.
- How would I admin one million hosts?


### GameDev

- How to animate a box.  That is, how to nicely animate a box.  AnimationManager.doFlyOut(boxObject)  and then easily have the animation stop and do AnimationManager.doMoveUpAndFadeOut(boxObject) or some such arbitrary "decorators".
- My game objects are nice but how about logic with LUA?
- Creating a really great event-based music soundtrack that reacts to game moods without breaking the flow of music.
- What is a transformation mesh?
- Building a scene graph.
- Using vertices from a obj model.  Or making a custom model format just to learn.
- Creating a heightmap out of a black & white image.  Then modifying the heightmap to do cool things like realistic cliffs.
- How to use Unity after all of these above tests are done.


### C++
- How to have multiple binaries built with a Makefile and call them between each other.
- What the double asterisk in <code>int pointer**</code> means.
- Does not using a pointer mean that I've cloned memory?  Is that the use of it when not doing an initial assignment (x=0)?
- Build a simple OOP test like <a href="http://unigine.com/documentation/code/car/">a Car</a>.
- Understanding pointers in regards to my scene graph.

### Obj-C

- <del datetime="2009-05-21T19:49:10+00:00">How to build classes as quick as I build them in Java or C++</del>  I get it.
- <del datetime="2010-09-02T18:41:23+00:00">The "everything is a message" metaphor?</del>  I get it.  It's just like ruby, <a href="http://stackoverflow.com/questions/3065489/semicolon-in-object-variable-name">see my question answered</a> on stackoverflow that's related.
- <del datetime="2009-05-21T19:49:10+00:00">All the file layout and syntax stuff.  What should go in implementation.m?  What should go in interface.h?</del>  I get it now.  Go CS193P.
- How much use is it beyond Apple?
- How to use the data views on the iPhone.  Specifically, create a data driven app and check out the methods and events.


### Software Design
- <del>How to do object composition.</del>
- How to notify an ArrayList of objects in the Observer pattern.  Well, how to do it without a book.
- <del datetime="2014-05-31T19:05:15+00:00">What the advice "program to an interface" really means.</del>It means duck-type in Ruby and contracts in Java/others.


### Software Architecture

- Read the Architecture of Open Source Applications.
- Try designing something really big without implementation.  Something you know.  Like a Starbucks full of Robots.


### Java

- How to use a JMS queue.
- How to read a sparsely documented Java API.  For example <a href="http://www.opensymphony.com/osworkflow/api/">OSWorkflow</a>.  Or maybe this is just hard in and of itself.
- <del datetime="2012-06-01T19:38:54+00:00">How to not do JEE projects for the rest of my life.</del> Answer: Fake it until you make it.  Refuse projects, learn enough to get a project you want.
- How to create and monitor a C process from Java (JNI).


### Unix

- <del datetime="2009-03-13T18:10:51+00:00">Authenticating Linux against OpenLDAP.  I had this working for a while but never grok'd it.</del>
- How to write a device driver.
- Understanding "man vga.h".  I think I understand it <a href="http://groups.google.com/group/comp.os.linux.misc/browse_thread/thread/329d5a0b9416440d/0b47c8032c02a39d?lnk=st&q=vga.h&rnum=6&hl=en#0b47c8032c02a39d">more now than I did before</a>.
- Sharing with without a SAN.  GFS2 + DRBD?  Or sharing spare local disk in a cluster cheaply.
- How to sudo ALL except /bin/bash?  Impractical?  Impossible?
- Distributed filesystems, can you reclaim free space?  Does this work as something that would consolidate commodity hardware easily?
- How virtual memory works vs real mode OS.  IE: what would happen if you wrote zeros to every device?


### Hardware

- Is there any chance that ethernet can be a fast interconnect?
- Why do commodity southbridges suck?  Why are ASICs better?  Are ASICs better or maybe the custom concept has gone to FPGAs?


### Networking

- Spanning tree?
- Never did Cat-6 wiring.
- Optical networks.  Just did uplinks between switches.


### Music Production

- Learning how to mix on headphones versus external monitors.
- Creating a good sampled sound from an analog source, ie: recording an analog drum loop that would work in electronica.
- What side-chaining means with regards to how I do my sends/inserts.
- What mastering means besides the definition of mastering.
- What producer would be willing to listen to my serious work for 30 minutes and how painful the feedback would be.
- Learn how to use a preamp.
- OSC from iPad to Ableton
- Doing a live show with Ableton and a laptop, including optimization and stability (bouncing intense plugins tracks to straight WAVs) to avoid crashes.
- Writing an Ableton script to control a song's energy, for example a slider that mixes in more and more layers.
- Modeling a sound with an analog synth.
- More plugins like Izotope's latest.


### Computer Science

- More gang of four experience.
- How to create AI or fuzzy logic.
- Use a neural network API.
- How do people reverse engineer something like the NES?  Or something like the iPhone bootloader?
- Write a recursive permutation algorithm of all combinations of "WORD".
- <del datetime="2014-05-31T19:17:13+00:00">Do something with pubsub</del>


### Electronics Hacking

- <del>How to use an Xbee and Arduino.</del>
- How to power an Arduino using solar power and Xbee for a completely wireless sensor thing.  Power
  calculations etc for it to survive the night.
- How to create a mesh or robot swarm.
- <del datetime="2014-05-31T19:18:04+00:00">Reading input from an old notebook keyboard into an arduino.</del>  Tried and failed, it's too hard because of the ribbon cable.
- <del>Creating a servo powered cat faucet.  How to make a simple robot arm?</del>
- Wire up arduino to ruby and do some heavy lifting like parsing IRC traffic, logs or <del datetime="2010-09-02T18:41:23+00:00">create an online bot that can flip a light switch</del> or something.


### Security

- <del>How to publish a CA into LDAP for a poor man's PKI.</del>  I did this at home.  It wasn't really that exciting.
- <del>How to publish a user certificate into LDAP.</del>
- Find someone who monitors SANS for 0-day exploits and ask them how they think or work.  How do these people have jobs like that?  What are they called?  Grok it, not just get it answered.
- How does a buffer overflow work?  And not just an overview.  Grok it.  Do it.  Audit existing code.
- Write a certificate storage device for the iPhone.  Or a secure document reader with strong auth (I don't know which strong auth you could use ... maybe a face chooser).

