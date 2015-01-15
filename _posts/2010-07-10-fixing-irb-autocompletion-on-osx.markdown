---
layout: post
status: publish
published: true
title: Fixing IRB autocompletion on OSX
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 583
wordpress_url: http://squarism.com/?p=583
date: !binary |-
  MjAxMC0wNy0xMCAxMToyNTo0NCAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNy0xMCAxNjoyNTo0NCAtMDQwMA==
categories:
- Ruby
tags: []
comments:
- id: 2290
  author: Matt Topper
  author_email: matt@matttopper.com
  author_url: ''
  date: !binary |-
    MjAxMC0wNy0xMSAyMjoyMzoxNyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNy0xMiAwMzoyMzoxNyAtMDQwMA==
  content: Did you run into the EditLine issues as well or are you running Readline?
---
Using macports version of ruby (and irb), I noticed that the lovely and wonderful tab autocompletion wasn't working:
`
$ irb --simple-prompt
>> "foo".cap  (The tab key!  It does nothing!)
`

So you can see that I was hitting tab expecting to see .cap resolve to .capitalize but it did nothing.  I'm not quite sure if this has been broken for a long time or forever.  On Linux, irb seems to just work.  So I found a fix out on the 'tubes.

`sudo gem install bond
$ cat ~/.irbrc
require 'rubygems';
require 'bond';
Bond.start`

And now the tab is delicious.

`>> "foo".cap   [tab]
>> "foo.capitalize
=> "Foo"`

Now while you're at it, might as well get the color going with wirble:
`sudo gem install wirble`
Add some more lines to .irbrc.  Now our .irbrc looks like this:
`$ cat ~/.irbrc
require 'rubygems'
require 'wirble'
require 'bond'
Wirble.init
Wirble.colorize
Bond.start`

![](/uploads/2010/07/wirble_bond.png "wirble_bond")Irb will have color and [tab] now which you can see in the screenshot right there.  The colors can be customized in wirble but it seems to be limited to ANSI terminal colors.  I wish the terminal would support RGB #html_codes, you could really go crazy and port some of the awesome Textmate themes over to the irb term.