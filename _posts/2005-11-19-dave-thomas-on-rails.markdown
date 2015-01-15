---
layout: post
status: publish
published: true
title: Dave Thomas on Rails
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 66
wordpress_url: http://squarism.com/2005/11/19/dave-thomas-on-rails/
date: !binary |-
  MjAwNS0xMS0xOSAxMjoxOTo1MCAtMDUwMA==
date_gmt: !binary |-
  MjAwNS0xMS0xOSAxNzoxOTo1MCAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
![dave_thomas.jpg](http://squarism.com/wp-content/photos/dave_thomas-thumb.jpg)

A while ago I ordered a Ruby book entitled, "Programming Ruby by Dave Thomas" off [amazon](http://www.amazon.com/gp/product/0974514055/102-9807925-0752118?v=glance&amp;n=283155&amp;v=glance) ([bookpool](http://www.bookpool.com/sm/0974514055) was close on price).  I read the first few chapters, got hung up on syntax and my interest was peaked.

One week later, a coworker says "Hey!  Dave Thomas is speaking at NovaJUG!"  (northern virginia java users group).  It was uncanny and I had to go.  To be fair, the opening act (as he called it) was on PMD Applied, by Tom Copeland.  He has written a book on PMD.  Essentially what I got out of it was a normalization process for code.  No duplicate code, no logical duplication and a Java tool to help detect it all.  I think Tom discredited himself a bit (understandably) by feeling like everyone was there for the Ruby bits.  This was only mostly true for me.  I wanted to see what the Java end of the JavaJUG was like.  I enjoyed his presentation although I felt he could have been more confident even if he was just the 'opening band'.  Tom knows his stuff for sure.

Dave Thomas got up and explained what Ruby on Rails is, what Ruby is and why he's even attempting to give his talk to a **Java Users Group**.  He explained that his talks are becoming more and more popular at Java seminars.  Why?  Probably because it's not a 300lbs hammer like Java is.  He had a good point about Programmers aren't Programmers anymore.  They are "Java Enterprise Programmers with XYZ framework experience".  A carpenter with only one tool.

Ok point taken.  But onto the gritty details.  Where does Ruby not work?  Where does it break?  How can it be perfect?  He did a good job of answering all of these common questions and explaining that Rails works for an estimated 70% of projects and the remaining 30% it might work 50% of the time if you changed the requirements or pushed back on the customers.

A really depressing part of the talk was when he explained that this Java programmer he talked to rewrote an app in Rails at night and in his free time.  The XML configuration of his Java app was 400+ lines, just the XML config.  Took him 4 months for the Java piece.  The same app in Ruby was less than 400 lines of Ruby code and he did it in 4 nights (spare time).  Now, obviously if you rewrite something you already know requirements, how the app works, domain experience and all the other stuff you already did.  So Dave said "double the time!  why not!  8 days!".

I'm still not convinced.  So he starts talking about JCP.  Said something like, "Take a good idea and put it into a Java committee where a bunch of vendors all influence the direction of a new spec to make the most money.  JSF was written so humans can't write it!  So you'd have to buy a tool!  Sun has killed Java.  If you look at C# and Java5, it's a checkbox contest.  Generics, check.  Autoboxing, check."

Ruby has configuration files that are written in Ruby.  No XML (unless you want to).  Ruby makes a lot of assumptions to make your life easier.   You can override the assumptions but could as easily take the defaults to make it quicker.

Dave then started coding on his mac laptop and we all watched.  He used MySQL as a database, YourSQL as a MySQL frontend (to create tables quick), TextMate as a text editor (did Ruby syntax autocompletion a bit) and a standard OSX terminal.  He created a database table and with one line of code 'scaffold' had the table on the web with 'show', 'edit', 'destroy' functionality per row.  Basic functionality.  He had run some scripts to generate the controller (comes with unit test).  But what he hadn't done was the killer.  He had URL rewriting (Rails does that), he had a simple database mapping (Rails I think) and he had a server running on port 3000 with no jboss or tomcat config deployment etc.

Everyone was excited.  I was excited.

He talked about how you can freeze your Ruby interpreter to your vendor/ directory within your development directory.  So if a new version of Ruby or Rails comes along you aren't screwed if you try out the new version.

He talked about a free ruby tool called [SwitchTower](http://manuals.rubyonrails.com/read/chapter/97) that lets you control versions of Ruby apps (not Ruby only) on deployment.  SwitchTower can roll back versions if a bug is found.  Looks neat.

He continued on at the end by talking about the future of Ruby.  He talked about JRuby.  Ruby running a Java VM.  You can call java objects from Ruby natively, way cleaner than that JNI crap.  He talked about possible verions of Ruby with bytecode like Perl6.  It's all very new.

It was a great talk, he graciously signed my book.  Dave Thomas is excited, honest, charmingly English (he forced him to pronounce status like us yanks -- Stah-tuss vs Stay-tuss) and approachable.  I could tell he's done lots of these talks, he's invested in Ruby, he's selling his book.  But that's his job for now.  Ruby speaks for itself upfront and I'm just going to have to explore the rest.  Dave Thomas and others were also invested in Java.  But they aren't throwing it away (maybe some are).  His point is to not use Java for everything.  Not to use Ruby for everything.  Anyone who says _one tool to bind them all_ is a salesman.

Don't use one tool for everything.  If I want to quickly parse XML in Java, what do I have to do ... get Xerces, Xalan, a million jars with the right version.  XML, Webservices, Unit Tests, AJAX, real object oriented stuff is just built into Ruby.  It's new.  It's improved.  You might like it for a side tool project.  Or a Java side-helper.

Don't drop Java he said.  Don't force and sell this to your boss.  Try it out.  Make an app quick and when people ask, "how the hell did you do that?" you say, "oh it was nothing".

**What I'm doing.**
I'm reading his book.  I'm going to try it out.  I'm going to see if I can write something quickly and use all these neat features.  So far the syntax is weird, I miss my curly braces.  But even without a book the commands and scripts are fairly self explanatory.  Emerging rails was a cinch under gentoo:
`
ACCEPT_KEYWORDS="~amd64 ~x86" emerge rails
`
And then I just mkdir "ruby" and "cd ruby" and "rails myproject".  I ran "script/server" and I had a rails server running on port 3000.  That was easy.  Like 5 minutes.

The rest of it is the kicker I think.