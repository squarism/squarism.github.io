---
layout: post
status: publish
published: true
title: Old Email Syntax
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 72
wordpress_url: http://squarism.com/2007/01/04/old-email-syntax/
date: !binary |-
  MjAwNy0wMS0wNCAxMDozMDowMiAtMDUwMA==
date_gmt: !binary |-
  MjAwNy0wMS0wNCAxNTozMDowMiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>I ran into <a href="http://www.42inc.com/~estephen/humor/support.txt">a 1994 post from Jeff Liebermann</a>, very funny, very interesting read because he's ranting about computer support.  It has historical significance because he's talking about the early days of the net and PCs.  He's talking about 2400 baud modems, 3.5 floppy drives, losing the CMOS disk geometry on an IDE drive and all this 1990 tech.  But right at the end he had something that sent me off on a trail.</p>
<blockquote><p>--
# Jeff Liebermann   Box 272     1540 Jackson Ave     Ben Lomond    CA   95005
# 408.336.2558 voice  wb6ssy@ki6eh.#nocal.ca.usa  wb6ssy.ampr.org [44.4.18.10]
# 408.699.0483 digital_pager    73557,2074  cis [don't]
# jeffl@comix.santa-cruz.ca.us  <font color="red">scruz.ucsc.edu!comix!jeffl</font></p></blockquote>
<p>In his signature he has that bit in red.  It's completely foreign to me.  Of course, searching for the name of something on Google, when you don't know the name of what you are searching for, is a near-impossible task.  Luckily, wikipedia came to my rescue in a very simple way.  I looked up <a href="http://en.wikipedia.org/wiki/Exclamation_mark">exclamation mark</a> and lo and behold wikipedia says</p>
<blockquote><p>Early e-mail systems also used the exclamation point as a separator character between hostnames for routing information, usually referred to as "bang path" notation.</p></blockquote>
<p>Ah, of course, bang is another term for exclamation point.  So I looked this up and found that this <em>bang path</em> notation is also related to <a href="http://en.wikipedia.org/wiki/UUCP">UUCP</a> notation.  Which makes sense because it's a list of hosts to route to and then at the end of it, a user name.</p>
<p>I also reflected that this process of routing to machines and then delivering to a user account is not gone.  The modern user@domain SMTP styled does this same thing with MX records.  When you email to domain.com, a MX query is done (perhaps many times) and SMTP can forward mail indefinitely (checking for loops) until finally a user is found and the email is delivered.  But the complicated syntax is gone.  Certainly user@domain is much more intuitive than domain!user, email clients can autocomplete the address easier because you're likely starting out with a friendly name like joe@yahoo, people aren't really intending to email the machine anyway.  The joe@yahoo SMTP syntax is more friendly than yahoo!joe for these ease of use reasons.</p>
<p>But even with all this digging, I wonder if this is the real reason that UUCP died out.  Wikipedia says that SLIP and PPP services offered by ISPs killed UUCP but is that directly related to the bang-path notation?  SLIP and SMTP aren't technically related, but maybe just timing and convenience related.</p>
