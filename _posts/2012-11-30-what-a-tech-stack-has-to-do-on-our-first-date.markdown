---
layout: post
status: publish
published: true
title: What a tech stack has to do on our first date
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1784
wordpress_url: http://squarism.com/?p=1784
date: !binary |-
  MjAxMi0xMS0zMCAyMTowNDowOSAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0xMi0wMSAwMjowNDowOSAtMDUwMA==
categories:
- Development
- Blog
tags: []
comments: []
---
<p><img src="/uploads/2012/11/monolingual.png" alt="" title="monolingual" width="319" height="156" class="aligncenter size-full wp-image-1789" /></p>
<h2>Listen to Dave Thomas</h2><p>
Watch this video -> <a href="http://www.confreaks.com/videos/368-rubyconf2010-keynote">please</a>.  Start at 45:50 and watch at least 10 minutes.</p>
<p>I tell a lot of people about this video.  I don't tell 10,000 people up on a stage on some world tour.  But whenever I get into a <em>good</em> discussion with geeks, I reference this video and tell them to watch it.  So I tell a lot of people in terms of <strong>percentage</strong> in conversations that I'm enjoying.  So in other words, I really like the video personally, it struck a chord (or a brain-thorn) and I want other people to consider his point of view.  Specifically, Dave Thomas says you <em>should learn a new language every year</em>.  Invariably, I'll tell people that Dave Thomas writes books and a few times people will dismiss his main idea because they think he's selling books.</p>

<!-- more -->

<p>Dismissing Dave Thomas' opinion that you should learn a new language every year just because he is an author is a crap position to take.  First, FUD.  Second, Dave Thomas doesn't sell books about the languages he says to check out in the video.  Thirdly, I trust Dave Thomas.  This isn't some fucking Larry Ellison power play.</p>
<p>So in terms of following his advice, I might pick up Scala.  It's different enough and anti-hipster-omg-embrace-the-java-enterprise enough that it will challenge me and/or be different than say continuing with Python (will is really Ruby like Spanish to Portugese) learning.  I've picked up <a href="http://www.amazon.com/Programming-Scala-Comprehensive-Step---Step/dp/0981531644/ref=sr_1_1?ie=UTF8&qid=1353200587&sr=8-1&keywords=scala">a Scala book</a> but haven't started it yet.  I looked at the Lift docs and was completely deflated.  <a href="https://twitter.com/chadfowler">Chad Fowler</a> tweeted about the Play! framework (thanks for the reminder) and thank god this looks better.</p>
<p>If I get sick of a city, I might move.  When I move, I'm looking for something new.  Similarly, starting out with Scala is going to be a bit like jumping into a new town.  Ok, I need to find the equivalents of the old things that I'm used to.  But wait, I moved to a new town to do something new!  If I bring my old habits with me, I'll just be <em>writing Ruby code in Scala</em>.  And that's crap.</p>

<blockquote>
Marge: I've dug myself into a happy little rut here and I'm not about to hoist myself out of it.<br>
Homer: Just bring the rut with ya, Honey.<br>
-- "<a href="http://www.snpp.com/episodes/3F23.html">You Only Move Twice</a>"
</blockquote>

<h2>What any technology stack is going to have to do on our first date</h2><p>
I need a list of libraries at least searchable by category and popularity.  Popular gems are likely to be used and therefore good.  This is great to get to higher level operations and gain productivity.  For example, <a href="http://ruby-toolbox.com">ruby-toolbox.com</a>.</p>
<p>I need screencasts ordered by date so you can learn community trends.  I'm going to need a way to keep up with the Jones' and know what's falling out of favor in the community because a shiny new library, technique or concept is getting the attention of key people.  This also operates as curated content.  For example, everyone is talking about CORS.  I'm sure there will be a <a href="http://railscasts.com">Railscast</a> on CORS even though CORS is not specific to Ruby or Rails.</p>
<p>Related to that last point, the community should be of high quality.  I know people like to hate on PHP but if you took a <a href="http://en.wikipedia.org/wiki/Core_sample">core sample</a> of PHP-land, I think you wouldn't be too happy.  Of course there are exceptions, for example, Facebook is full of brilliance.</p>
<p>Some easy way to install things that's Internet-enabled.  Maven is close.  Rubygems is good.  NPM is good.  Yum beats plain RPM.  Pip is fine.  CPAN is crap.  All these package managers connect to the Internet and resolve dependencies.  As a bonus, being able to repackage, bundle, freeze or tar up libs into a lib directory is great for corporate firewalls or making deployment not suck so hard.</p>
<p>I need a way to separate projects from one another.  Gemsets with RVM does this.  Virtualenv does this with projects.  Lib implicitly does this in Java (although CLASSPATH issues suck).  Explicit project isolation with libs is great.</p>
<p>Give me videos from the community like <a href="http://confreaks.com/">Confreaks</a>.  Video community talks are necessary.  The JavaOne video site sucks and only because of the content.  It doesn't have to be flashy and overly-produced.  Oracle publishes <a href="http://www.oracle.com/javaone/live/on-demand/index.html">3 minute videos</a> with zero details and zero content.  Yay?</p>
<p>I need quick feedback.  This means a REPL and/or event-based test suite runners.  If I save a file, I want a test to run (Ruby's Guard gem).  If I want to figure out how to do something, I want it to be instant feedback.  About the farthest thing I can think of away from this is deploying to Tomcat, reloading the webapp and hitting refresh in a browser (#fml).</p>
<h2>I'll call Scala back</h2><p>
So far, Scala has the REPL thing down (just type $ scala).  And the SBT tool does auto-reloading similar to Guard.  Of course, it has to compile things so it's slightly a slower feedback loop but it's not terrible.  SBT also seems to have a manifest thing going on for the equivalent of gemsets.  It all goes in project/plugins.sbt which is great.  There's also a concept of a global project in a ~/.sbt folder.  This reminds me a lot of NPM.</p>
<p>I haven't discovered the community side of things yet like screencasts (railscasts) or a news site (rubyflow).  On the negative side, there seems to be some Java crosstalk.  For example the Play! framework can generate a Scala or a Java project.  So if you are trying to get away from Java, this is a good step away but not a clean break.  I get a feeling of Java refugee camp (which is fine).</p>
<p>Something I'm working on right now is understanding the IDE landscape.  Eclipse was a bit weird with loading the Scala plugins and Intellij is coming out with a new version of IDEA soon.  Also I need to grok the sbt-console inside the IDEA plugin vs command line.  Are they the same?  I had this same challenge when trying RubyMine.  At some point you have to get a feel for what the One True Way was intended to be.</p>
