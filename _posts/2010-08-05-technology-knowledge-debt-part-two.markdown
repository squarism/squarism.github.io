---
layout: post
status: publish
published: true
title: Technology Knowledge Debt, Part Two
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 569
wordpress_url: http://squarism.com/?p=569
date: !binary |-
  MjAxMC0wOC0wNSAyMjo0Mjo0OCAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wOC0wNiAwMzo0Mjo0OCAtMDQwMA==
categories:
- Systems
tags: []
comments:
- id: 2467
  author: Mr Henerd
  author_email: mrheneredjesus@gmail.com
  author_url: http://jesushenerd.blogspot.com
  date: !binary |-
    MjAxMC0xMS0zMCAyMTowMjoxMSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMi0wMSAwMjowMjoxMSAtMDUwMA==
  content: Hey there, very interesting post, it really got me thinking. Thank you.
---
Knowledge debt is then you don't spend the time to catch up.  This is Part Two, discussing common knowledge gaps in technology projects regardless of company, industry, project or people.  Part One is [here](http://squarism.com/2010/07/03/tech-knowledge-debt/) and talked about Troubleshooting, VNC, X11, Version Control, Sudo and Cron as common debted areas.  The original post that posed the questions is [here](http://squarism.com/2010/05/31/dearth-patterns/), where I wondered why the same patterns happen from project to project, company to company and person to person.

### Myth of supportability

In most teams, one person is responsible for the work that they do.  If you're lucky, you'll have two people responsible for some of the same things so that if one person goes on vacation, the work can continue.  In most projects I've been on, this is not the case.  One person is responsible for the beginning, middle and end.  That means figuring out the question, figuring out the answer and then writing the answer down in such a way that anyone (with some level of experience hopefully) can do the work in the future.  That's the idea anyway.

However, most projects actually don't work out like that.  In the movie Ironman, Tony Stark invents a mini arc reactor which powers his suit.  The antagonist asks an engineer to build what Tony Stark made.  The engineer [says he can't do it](http://www.imdb.com/title/tt0371746/quotes?qt0478037), _I'm not Tony Stark_.  Of course it's just a movie but I feel it rings true.  Maybe it's going on where you work.  Here are some symptoms:

*   You can't go on vacation.
*   You'd probably get a raise or a bonus if you threatened to quit.
*   No one knows what you're actually working on.
*   To cross-train someone means starting from the beginning (ie: beyond two week notice).
*   You fix your own mistakes even when they are years later discovered.  This doesn't have be negative.  You could enhance your own project years later or answer questions about projects long since turned over to other people or teams.</p>

It's called being "one deep" and it's not where you want to be.  However, sometimes it's impossible to find qualified people to support an effort.  Maybe it's money, maybe it's recruiting.  I don't know.  It's certainly not a problem at a single company.  I suspect it might have to do with the specialized nature of [Enterprise Software](http://www.codinghorror.com/blog/archives/000227.html).  For example, a generic problem is only bound by budget.  If you have an array sorting algorithm to write, a database schema to design and a cluster or Apache servers to set up; it's going to be really easy to find these people.  But if you have a [Documentum](http://www.emc.com/domains/documentum/index.htm) connection pool performance problem when using AIX 5.1 for SCO mainframes but only when using the thick Oracle database driver that's being load balanced by a ... blah blah blah; it's going to be really hard to find someone that's done whatever craziness you're doing and then even harder to find someone who immediately knows how to fix your problem.

What I'm talking about is [COTS](http://en.wikipedia.org/wiki/Commercial_off-the-shelf).  COTS stands for "I don't want to take a risk" software.  It means you're going to buy vs build.  It's been a strategy forever and yet we're all not on the beach with the information problems of the world solved for cheap.  Of course, reinventing the wheel is not the greatest approach either.  There's a middle ground, not directly in the middle, that's probably the best approach.

I was tasked once to get a workflow engine running.  A meeting happened and there were suggestions like buy a workflow engine or reuse a web service out there somewhere.  The web service of course was BPEL compliant.  BPEL is a pain in the ass and I thought it was overkill just to do notifications when something happens.  I implemented OSWorkflow as a library and it worked out fine.  In the end, the effort was changed completely and my time was filed under [Cheese Movement](http://en.wikipedia.org/wiki/Who_Moved_My_Cheese%3F).  If I had killed myself getting a BPEL workflow engine working, I would have been a lot more upset when the project was canned.  And even worse, if it hadn't gotten canned and the project went live, they'd have an overcomplex system that's harder to hand off to cheaper support staff.  In the end, a workflow library was easier to integrate than a stand-alone COTS workflow product.

Anecdotal argument aside, something is broken.  Is it a complete lack of development skills in systems engineering?  Is it a fear of concentrated thinking?  Do customers react horribly when you pitch "we're going to roll our own"?  Maybe it's eating your own dog food: if you used Sybase on one project, why would you store your preferences in XML?  Let's use Sybase again even though it's impossible to find Sybase people!  Yay!

And even if you are allowed to roll your :

*   If you're single threaded you only have one guy doing something.  If he does it manually, that's considered ok.
*   If he leaves, the manual step is gone.
*   If he codes it in COBOL (something unfamiliar), that's bad.
*   If he does code it in COBOL, at least you have that asset if he leaves.
*   If you force him to do it in Java or whatever your shop "knows", you need to hire a dev to replace him, which you don't have anyway.  If you did, you'd have your dev do it in Java right now.
*   But just because you do it in Java, doesn't guarantee people are available or can read it.  I've gotten thrown some crazy code that was insane despite it's language.</p>

I say bring the solution and not the language.  Instead of harping on "you shouldn't have done it that way", say "I'm glad you got it done, now we own it and you've created an asset for us".  Don't [FUD](http://en.wikipedia.org/wiki/Fear,_uncertainty_and_doubt).  Just do it.

### Copy and paste

First of all, a really whiney semantic point: cut is not copy.  Cut **removes** the text and copies it.  Copy **leaves** the text and copies it.  I know cut has one less syllable but when people say "I cut and pasted from that webpage", [I die a little](http://xkcd.com/727/).  You can't cut and paste on a read-only thing, like a webpage.

Anyway, copy and paste changes with the application and OS.  Here's some examples:

*   Native windows app: Ctrl+C and then Ctrl+V
*   Native Linux app in Gnome: Ctrl+Shift+C and then Ctrl+Shift+V
*   Putty copies to the clipboard when you select.  You don't need to Ctrl+C.  Ctrl+C means something else when you're SSH'ing to a Unix box.  Just select and Ctrl+V back to notepad or whatever you're using.
*   Putty pastes with the right mouse button.  Don't Ctrl+V.
*   The command-prompt in Windows pastes with the right mouse button too.  There's also a nice option to do Quick Edit if you go to Properties in the cmd.exe icon while it's running.  Quick Edit will let you select on left click drag and then copy with Enter.
*   X11 copies on select.  It pastes with the middle mouse button.  If you select anything before you paste, guess what, you just copied that.</p>

I want to re-iterate that last point because I've seen this for years.  Copy on select is hard to grasp for Windows-y people.  I see people copy a bunch of text from Notepad, move their mouse over to the putty window and click on the right-ish portion of the screen.  When the click, a large white line has appeared and then they paste.  _Nothing but blanks!  What the hell happened!  Argh!  I hate computers!_

![](/uploads/2010/07/paste_example.png "paste_example")

When you click in putty, click on the left portion of the screen with text.  If you click on text, you won't select the blank space on a line.  Even better, just click on the menu bar to switch windows.  Or use alt+tab.  If you click on empty space, you're going to overwrite your clipboard with nothings.

Linux virtual consoles sometimes have a mouse pointer (btw I'm talking about the Ctrl+Alt+F1 - F6 consoles if you walk up to the server).  On RedHat, it has this by default.  It's a little mouse driver and it's handy for copy and paste.  Select some text and right click.  It'll paste in.  But this clipboard isn't shared from the virtual console to the X11 GUI or to an SSH client.

### Hierarchies in Software Architecture

As you go from project to project, some patterns should emerge.  You should see the same themes over and over in different software packages, different approaches to a problem and in the problems themselves.  I'm not the only one who's noticing patterns.  I've met lots of smart people that can relate one thing to something else that they know.  It's a good sign that they are paying attention.

But of all the recurring patterns, hierarchies are the least discussed.  I don't know why I notice hierarchies so much.  Maybe because I've been working with LDAP a lot lately.  Maybe I'm a [tree hugger](http://en.wikipedia.org/wiki/Tree_(data_structure)).  Bam.  Pun'd.

Hierarchies organize.  Hierarchies can't avoid defining relationships.  A hierarchy has at least one path to get to a node and to that point, hierarchies have paths.

Here are some hierarchies and typical paths:

*   A filesystem: C:\temp\whatever.txt  or /tmp/whatever.txt
*   An LDAP DIT: DN: cn=joe,dc=yahoo,dc=com
*   A workflow definition: Start -> Request raise -> Manager -> Deny -> Create monster.com account for employee -> End
*   An HTML document: html -> body -> p ->Hello World
*   A solid state disk: Controller -> Block -> Page
*   A hard disk: Controller -> Cylinder -> Track -> Sector
*   Ruby class: Class -> Module -> Object -> nil
*   Java class: java.lang.Error -> java.lang.Throwable -> java.lang.Object -> null</p>

These are just example paths, they are not how you'd persist these things.  For example, a workflow can be stored in XML, which is similar in structure to an HTML document:
`<workflow name="Raise process">
<step id="1" name="Start"/>
<step id="2" name="Request Raise">
  <action class="Email" to="joe-boss@company.com" />
  <unconditional-result status="Waiting for your boss to approve"/>
</step>
<step id="3" name="Manager Decision">
  <condition name="Decision" class=CheckForApproval>
    <arg name="approved" string="true" status="Approved" step="4">
  </condition>
  <unconditional-result status="Denied" step="5">
</step>
<step id="4" name="Raise">
  <action class="RaiseSalary" status="Raised" step="6" />
</step>
<step id="5" name="Job Board">
  <action class="CreateMonsterAccount" status="Getting you a new job" step="6" />
</step>
<step id="6" name="End" />
</workflow>
`

This is sort of an OSWorkflow style document which is not by any means something that will parse correctly (If I had to do workflow again, I'd use the ruby gem [state machine](http://slagyr.github.com/statemachine/), which is awesome).  I'm just illustrating that this workflow is really a hierarchy/tree of steps.  And because trees are logically so generic, you'll see them everywhere.

Here's a Java class hierarchy:
`public class Hierarchy {
  public static void main(String[] args) {
    System.out.print(Error.class.getName() + " -> ");
    System.out.print(Error.class.getSuperclass().getName() + " -> ");
    System.out.print(Error.class.getSuperclass().getSuperclass().getName() + " -> ");
    System.out.println(Error.class.getSuperclass().getSuperclass().getSuperclass());
  }
}`

Which will spit out: `java.lang.Error -> java.lang.Throwable -> java.lang.Object -> null`

And here's the equivalent ruby code:

`ruby -e 'print "#{Class} -> #{Class.superclass} -> #{Class.superclass.superclass} -> #{Class.superclass.superclass.superclass}"'
outputs: Class -> Module -> Object ->`

(there's a hidden null there)

So that's hierarchies and especially that ones that I've noticed are all very much related.  You could transform any of these things into the other, like LDAP to XML to a file system hierarchy to a physical structure and back (and [people do](http://en.wikipedia.org/wiki/Graph_transformation)).

### Web application (webapp) vs webpage

A lot of the projects I've worked on haven't been purely a development task.  It's lately been lego-style integration projects so I understand that all people won't be developers.  However, I find it interesting that the words webapp and webpage can be so wrongly mingled.  Even in product names (such as Websphere and Weblogic) and product features.  Templates, wizards and new project dialogs confuse me sometimes.  If I saw a "Create New Web Application Website" button, I'd wonder if I'm going to get some HTML and CSS or weather I'll end up with WAR project.  Sometimes there are hints like "dynamic" and that's really the distinction.

Webpages are static.  Webapps are dynamic.  Let's not get muddy with client-side javascript (it's a blurry line).  But where the terms really matter is on the server stack  you choose.  Application servers can serve HTML, yes.  But if you want to really use a pure web server, you'll go with [Apache](http://en.wikipedia.org/wiki/Apache_HTTP_Server)/[Nginx](http://en.wikipedia.org/wiki/Nginx)/etc.  Which in turn, can run code through modules.  But it's not in the spirit of Apache as a web server.  A web server is really just a file server on the web.  In some sense, an application server is a programming language on the web.  Every app server has its own language that it was built for.  Tomcat, JBoss, Weblogic and Websphere are all Java app servers.  Mongrel, Thin, WEBrick and Phusion Passenger are Rails app servers (with JRuby, Weblogic can run Rails but that's muddy again).  You can front these app servers with a web server and create a powerful and flexible environment with Apache modules.  In this way, you are using a web server not to serve "web pages" but to serve "web apps".

So don't say app server when you mean web server and vice-versa.

### Plain-text

Think about what plain-text is.  It's human readable, it's not encrypted (which is really human readable) and it's also written, ultimately, by a human.  There are protocols, file formats and other standards that are simply plain text.  Sometimes plain text allows you to manipulate the system interactively and can help you debug or understand.  For example, when I wrote [my IRC bot](http://squarism.com/2010/02/28/arduino-command-protocol/), I simply wrote strings to a network connection object that complied with the [RFC protocol](http://www.ietf.org/rfc/rfc1459.txt).  But before doing that, I simply telnet'd to the IRC server and tried typing commands to stay connected.

Try this from a command prompt or unix shell:
`telnet irc.freenode.net 6667`
You'll see the server hang and try to do an identd query.  You probably won't have one set up so you'll see the message "No Ident Response"

Now type this:
`NICK ohmynickname
USER ohmynickname 0 * ohmynickname
JOIN #PieIsGreat
`

Now join up with a regular IRC client so you can see your message.  Back in the telnet window type:
`PRIVMSG #PieIsGreat :Isn't pie just wonderful?`

You'll see this in your regular IRC client (irssi in this case):
![](/uploads/2010/07/manual_irc.png "manual_irc")

And so on.  All IRC is, is a plain-text protocol.  It's just like SMTP.

To illustrate, let's send an email manually.  You'll need a Linux box for this one.
`$ dig -t mx gmail.com | grep smtp
gmail.com.              3249    IN      MX      20 alt2.gmail-smtp-in.l.google.com.
gmail.com.              3249    IN      MX      30 alt3.gmail-smtp-in.l.google.com.
gmail.com.              3249    IN      MX      40 alt4.gmail-smtp-in.l.google.com.
gmail.com.              3249    IN      MX      5 gmail-smtp-in.l.google.com.
gmail.com.              3249    IN      MX      10 alt1.gmail-smtp-in.l.google.com.

$ telnet alt2.gmail-smtp-in.l.google.com 25
Trying 74.125.43.27...
Connected to alt2.gmail-smtp-in.l.google.com.
Escape character is '^]'.
220 mx.google.com ESMTP a10si18542430bkc.24
helo me
250 mx.google.com at your service
MAIL FROM: <someone@something.com>
250 2.1.0 OK a10si18542430bkc.24
RCPT TO: <test@gmail.com>
250 2.1.5 OK a10si18542430bkc.24
DATA
354  Go ahead a10si18542430bkc.24
From: Bob Slow
Subject: Manual SMTP
This is great.
.
250 2.0.0 OK 1279640642 a10si18542430bkc.24
`

Go check your gmail.  You'll see an email.  It's probably going to be listed under your spam folder because we didn't specify a proper sender, our domain is bogus.  You'll want to use an actual domain name as the from address.  It really depends on Google's spam filter.  Sometimes they can check to see if you're actually sending from that domain, which is tricky unless you have a proper mail server to send from.  If you get something through, it'll look like a normal email.

![](/uploads/2010/07/manual_smtp.png "manual_smtp")

And why should it be any different?  This is what Thunderbird, Outlook or Mail.app program is doing behind the scenes.  This is also why email is so insecure.  Anyone can sniff your mail as it goes over the network (provided they have their sniffer set up right).  Even if you're using https on gmail.com's web interface, it's hard to say if SMTP is encrypted to your destination (probably not).  SSL certificates are hard to set up.

Ok, one last example for our pattern.  We're going to make a manual connection to the HTTP listening port to a Yahoo! web server.

`$ telnet yahoo.com 80`

You'll see this message:
`Escape character is '^]'.`

You can hit enter and some blank lines will appear.  This means you're connected but the web server doesn't think much of newlines (ignores them).  Now type "GET /" before it times out.  If you time out, just telnet again.  You'll get a response:

> Your browser did not send a "Host:" HTTP header, so the virtual host being requested could not be determined.  To access this site you will need to upgrade to a modern browser that supports the HTTP "Host:" header field.

Hmm.  That's interesting.  Yahoo uses an accelerator that needs to switch on a host header for virtual hosting and load balancing.  Let's do as they say.  First, we'll grab just the HEAD from the root document.

`$ telnet yahoo.com 80
Trying 98.137.149.56...
Connected to yahoo.com.
Escape character is '^]'.
HEAD / HTTP/1.1
Host: www.yahoo.com
Connection: close

`

Make sure to add an extra newline (enter) at the end after Connection: close.  You'll see a `HTTP/1.1 200 OK` at the top of the little response block, which is a success.  The following is what you'll see (I put some [snips] in there to reduce length).

`HTTP/1.1 200 OK
Date: Tue, 20 Jul 2010 22:03:14 GMT
P3P: policyref="http://info.yahoo.com/w3c/p3p.xml", CP="CAO DSP COR CUR ADM DEV TAI PSA PSD IVAi IVDi CONi TELo OTPi OUR DELi SAMi OTRi UNRi PUBi IND PHY ONL UNI PUR FIN COM NAV INT DEM CNT STA POL HEA PRE LOC GOV"
Cache-Control: private
Set-Cookie: IU=deleted; expires=Mon, 20-Jul-2009 22:03:13 GMT; path=/; domain=.yahoo.com
Set-Cookie: PH=deleted; expires=Mon, 20-Jul-2009 22:03:13 GMT; path=/; domain=.yahoo.com
Set-Cookie: fpc=d=[snip]&v=2; expires=Wed, 20-Jul-2011 22:03:14 GMT; path=/; domain=www.yahoo.com
Set-Cookie: fpms=u_30345330=%7B%22lv%22%3A1479641794%2C%22uvc%22%3A1%7D; expires=Wed, 20-Jul-2011 22:03:14 GMT; path=/; domain=www.yahoo.com
Set-Cookie: fpps=_page=%7B%22wsid%22%3A%22879345330%22%7D; expires=Wed, 20-Jul-2011 22:03:14 GMT; path=/; domain=www.yahoo.com
Set-Cookie: fpt=d=[snip]0._vZOYA-&v=1; path=/; domain=www.yahoo.com
Set-Cookie: fpc_s=d=h[snip]&v=2; path=/; domain=www.yahoo.com
Vary: Accept-Encoding
Content-Type: text/html;charset=utf-8
Age: 0
Connection: close
Server: YTS/1.17.23.1

Connection closed by foreign host.
`

Looks like they set a ton of cookies in the head.  Ok, fine.  So now just change the HEAD / to GET /.

`$ telnet yahoo.com 80
Trying 98.137.149.56...
Connected to yahoo.com.
Escape character is '^]'.
GET / HTTP/1.1
Host: www.yahoo.com
Connection: close

`

You'll get the entire HTML document, header and all.  You'll see the same header that we saw before.  Scroll up past the &lt;!DOCTYPE html&gt; and &lt;html&gt; opening tags to find it.  At the end of the document, you'll see the &lt;/html&gt;.  Your browser turns this plain-text into widgets, buttons and pictures using it's rendering engine.  Note that the security concerns of plain-text SMTP previously discussed also apply to HTTP.  Simply because it is plain text.  Instead of a yahoo front page, this response could include a DIV tag with a bank account number and balance or a HTTP POST with a username and password.

So what?  Why would anyone use telnet as a test?  Who cares about plain-text?  What kind of [weirdo](http://www.youtube.com/watch?v=PB-wmOYelnM) are you?

*   It's interactive - you can watch a log while you type manually
*   It's verbose - many times, errors will pop up when you do thing manually that would otherwise be hidden by [infinite layers](http://www.codinghorror.com/blog/2005/03/the-great-enterprise-software-swindle.html) of enterprise software abstraction
*   It's a good test that you can do if you're stuck at a client site without your dev machine because almost every OS (like Windows) has telnet
*   It's near-absolute - If you can't telnet to port 80, your browser won't work (excepting proxies and other things)
*   It's security related - Watch in horror as your html comes over the wire in the clear.  Shouldn't you be using SSL?</p>

### Hands-On Security

I don't have a lot to say about this one so let's recap what my original complaint was:

> Policy makers vs whitehats. Like actually checking Sans for actual 0-day remote root-level ultra-bad exploit on foo software. Security is always a huge blanket statement with very few actual experts. I'm certainly not one but I have met very few that I thought were teaching me something. I want the guy who actually knows what a XSS attack or a buffer overflow is. This might just be a reflection on the projects I've been on.

Like I said, I haven't really met a hands-on security analyst that had a VM with a bunch of security demos/hacks etc on it.  There's some good security related videos out there but the really good ones aren't around me I guess.  Maybe that's telling of something.  Maybe they're ranting on about me.  I dunno.  Mark this one as incomplete.

### Conclusion

Ok well this was longer than I wanted.  Hopefully these tips help you directly, these tips could be linked to someone you know or perhaps seeing these common shortfalls listed out by me is some kind of cathartic release for you.  Until the next post, I'll be trying to understand ruby threading.  Threading and concurrency is a personal debt of mine.