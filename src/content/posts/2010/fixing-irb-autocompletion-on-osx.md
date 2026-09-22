---
title: "Fixing IRB autocompletion on OSX"
description: "Using macports version of ruby and irb, I noticed that the lovely and wonderful tab autocompletion wasn't working: $ irb --simple-prompt"
date: 2010-07-10T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Using macports version of ruby (and irb), I noticed that the lovely and wonderful tab autocompletion wasn't working:
```bash
$ irb --simple-prompt
>> "foo".cap  (The tab key!  It does nothing!)
```

So you can see that I was hitting tab expecting to see .cap resolve to .capitalize but it did nothing.  I'm not quite sure if this has been broken for a long time or forever.  On Linux, irb seems to just work.  So I found a fix out on the 'tubes.

```bash
sudo gem install bond
$ cat ~/.irbrc
require 'rubygems';
require 'bond';
Bond.start
```

And now the tab is delicious.

```text
>> "foo".cap   [tab]
>> "foo.capitalize
=> "Foo"
```

Now while you're at it, might as well get the color going with wirble:
`sudo gem install wirble`
Add some more lines to .irbrc.  Now our .irbrc looks like this:
```bash
$ cat ~/.irbrc
require 'rubygems'
require 'wirble'
require 'bond'
Wirble.init
Wirble.colorize
Bond.start
```

![](/uploads/2010/07/wirble_bond.png "wirble_bond")

Irb will have color and [tab] now which you can see in the screenshot right there.  The colors can be customized in wirble but it seems to be limited to ANSI terminal colors.  I wish the terminal would support RGB #html_codes, you could really go crazy and port some of the awesome Textmate themes over to the irb term.
