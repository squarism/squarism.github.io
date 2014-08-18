---
layout: post
status: publish
published: true
title: ! 'Target Agnostic ETL '
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<em>This is a question <a href=\"http://stackoverflow.com/questions/5097867/is-avoiding-the-t-in-etl-possible\">I
  posted to stackoverflow</a>.  It's something I've been wondering about for a
  while.  The polling nature of ETL has always bugged me but now it seems like the
  parsing bit of it is annoying too.</em>\r\n\r\n<a href=\"http://en.wikipedia.org/wiki/Extract,_transform,_load\">ETL</a>
  is pretty common-place. Data is out there somewhere so you go get it. After you
  get it, it's probably in a weird format so you transform it into something and then
  load it somewhere. The only problem I see with this method is you have to write
  the transform rules. Of course, I can't think of anything better. I supposed you
  could load whatever you get into a blob (sql) or into a object/document (non-sql)
  but then I think you're just delaying the parsing. Eventually you'll have to parse
  it into something structured (assuming you want to). So is there anything better?
  Does it have a name? Does this problem have a name?\r\n\r\n<h2>Example</h2>\r\n\r\nOk,
  let me give you an example. I've got a printer, an ATM and a voicemail system. They're
  all network enabled or I can give you connectivity. How would you collect the state
  from all these devices? For example, the printer dumps a text file when you type
  status over port 9000:\r\n<code>\r\n> status\r\n===============\r\nhas_paper:true\r\njobs:0\r\nink:low\r\n</code>\r\nThe
  ATM has a CLI after you connect on port whatever and you can type individual commands
  to get different values:\r\n<code>\r\nmaint-mode> GET BILLS_1\r\n[$1 bills]: 7\r\nmaint-mode>
  GET BILLS_5\r\n[$5 bills]: 2\r\netc ...\r\n</code>\r\nThe voicemail system requires
  certain key sequences to get any kind of information over a network port:\r\n<code>\r\ntelnet>
  7,9*\r\n0 new messages\r\ntelnet> 7,0*\r\n2 total messages\r\n</code>\r\n\r\n"
wordpress_id: 952
wordpress_url: http://squarism.com/?p=952
date: !binary |-
  MjAxMS0wMi0yMyAyMjo0Mjo0NSAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0wMi0yNCAwMzo0Mjo0NSAtMDUwMA==
categories:
- Brainstorm
tags: []
comments: []
---
<p><em>This is a question <a href="http://stackoverflow.com/questions/5097867/is-avoiding-the-t-in-etl-possible">I posted to stackoverflow</a>.  It's something I've been wondering about for a while.  The polling nature of ETL has always bugged me but now it seems like the parsing bit of it is annoying too.</em></p>
<p><a href="http://en.wikipedia.org/wiki/Extract,_transform,_load">ETL</a> is pretty common-place. Data is out there somewhere so you go get it. After you get it, it's probably in a weird format so you transform it into something and then load it somewhere. The only problem I see with this method is you have to write the transform rules. Of course, I can't think of anything better. I supposed you could load whatever you get into a blob (sql) or into a object/document (non-sql) but then I think you're just delaying the parsing. Eventually you'll have to parse it into something structured (assuming you want to). So is there anything better? Does it have a name? Does this problem have a name?</p>
<h2>Example</h2></p>
<p>Ok, let me give you an example. I've got a printer, an ATM and a voicemail system. They're all network enabled or I can give you connectivity. How would you collect the state from all these devices? For example, the printer dumps a text file when you type status over port 9000:
<code>
> status
===============
has_paper:true
jobs:0
ink:low
</code>
The ATM has a CLI after you connect on port whatever and you can type individual commands to get different values:
<code>
maint-mode> GET BILLS_1
[$1 bills]: 7
maint-mode> GET BILLS_5
[$5 bills]: 2
etc ...
</code>
The voicemail system requires certain key sequences to get any kind of information over a network port:
<code>
telnet> 7,9*
0 new messages
telnet> 7,0*
2 total messages
</code></p>
<p><a id="more"></a><a id="more-952"></a></p>
<h2>My thoughts</h2></p>
<p>Printer - So this is pretty straight-forward. You can just capture everything after sending "status", split on lines and then split on colons or something. Pretty easy. It's almost like getting a crap-formatted result from a web service or something. I could avoid parsing and just dump the whole conversation from port 9000. But eventually I'll want to get rid of that equal signs line. It doesn't really mean anything.</p>
<p>ATM - So this is a bit more of a pain because it's interactive. Now I'm approaching expect or a protocol territory. It'd be better if they had a service that I could query these values but that's out of scope for this post. So I write a client that gets all the values. But now if I want to collect all the data, I have to define what all the questions are. For example, I know that the ATM has more bills than $1 and $5 so I'd have a complete list like "BILLS_1 BILLS_5 BILLS_10 BILLS_20". If I ask all the questions then I have an inventory of the ATM machine. Of course, I still have to parse out the results and clean up the text if I wanted to figure out how much money is left in the ATM machine. So I could parse the results and figure out the total at data collection time or just store it raw and make sense of it later.</p>
<p>Voicemail - This is similar to the ATM machine where it's interactive. It's just a bit weirder because the key sequences/commands aren't "get key". But essentially it's the same problem and solution.</p>
<h2>Future Proof</h2></p>
<p>Now what if I was going to give you an unknown device? Like a refrigerator. Or a toaster. Or anything? You'd have to write "connectors" ahead of time or write a parser afterwards against some raw field you stored earlier. Maybe in the case of these very limited examples there's no alternative. There's no way to future-proof. You just have to understand the new device and parse it at collection or parse it after the fact (your stored blob/object/document).</p>
<p>I was thinking that all these systems are text driven so maybe you could create a line iterator type abstraction layer that simply requires the device to split out lines. Then you could have a text processing piece that parses based on rules. For the ATM device, you'd have to write something that "speaks ATM" and turns it into lines which the iterator would then take care of. At this point, hopefully you'd be able to say "I can handle anything that has lines of text".</p>
<p>But then what will you call these rules for parsing the text? "Printer rules" might as well be called "printer parser" which is the same to me as "printer transform". Is there a better term for all of this?</p>
