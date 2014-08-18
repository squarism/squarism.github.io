---
layout: post
status: publish
published: true
title: Downloading en mass
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 474
wordpress_url: http://squarism.com/?p=474
date: !binary |-
  MjAxMC0wNS0xNSAyMjowODoyNyAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0xNiAwMzowODoyNyAtMDQwMA==
categories:
- Unix
tags: []
comments:
- id: 1953
  author: Matt Topper
  author_email: matt@matttopper.com
  author_url: ''
  date: !binary |-
    MjAxMC0wNS0xNiAxMjo1NTozMSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNS0xNiAxNzo1NTozMSAtMDQwMA==
  content: Or an even easier approach would be to remind me to copy you the directory
    I already have.  But again that wasn't the point.  I really wish someone would
    do a "Railscasts Revisited" series since there are better approaches to many of
    the techniques shown as rails / gems have evolved over time.
---
<p><img src="/uploads/2010/05/txt.png" alt="" title="txt" width="103" height="130" class="alignright size-full wp-image-479" />
<a href="http://railscasts.com/">Railscast</a> has a podcast on iTunes which lets you download all past episodes and thus this post is moot.  But, I thought, what if it wasn't?  What if I found a cool site with a bunch of media files I want to download?  I knew wget can do this but it's been a while.  So here's what I did.</p>
<h3>Get the links</h3><p>
First I downloaded the <a href="http://railscasts.com/episodes/archive">archive page</a>.  It's full of links to other pages which have the .mov media files on it.  But I really needed a list of those pages within the archive page.  Ok, I wget'd the archive html source page in a file named archive.txt:
<code>curl -o archive.txt http://railscasts.com/episodes/archive</code></p>
<p>However this page is full of html source and all I need is the list of episodes.  So a simple:
<code>grep href urls.txt|grep episodes > urls_href.txt</code> gets me that.  But it's really full of text that looks like this: <code><a href="/episodes/195-my-favorite-web-apps-in-2009">My Favorite Web Apps in 2009</a></code></p>
<h3>Clean the links</h3><p>
 Ok now I just need to trim all this crap out.  First, there's a bunch of whitespace out front in the links.  Let's use sed inline.  This works on OSX and Linux but won't work on Solaris (inline boo).
<code>sed -ie 's/^[ ]*//' urls_href.txt</code>.  Now we're missing a those spaces out front.</p>
<p>Ok, now we need to trim down to the relative link to the episode.  We want a URL that looks like:
<code>http://railscasts.com/episodes/30-pretty-page-title</code></p>
<p>So at this point sed was failing me because the regex syntax is different than I'm used to.  So let's switch to perl.
<code>cat urls_href.txt | perl -e 'while(<>) { s/\<a\s*(.*)\>(.*)\<\/a\>/$1/; print}' > urls_href_clean.txt</code></p>
<p>We're almost there.  We have URLs that look like this:</p>
<pre lang="html">"/episodes/17-habtm-checkboxes"
"/episodes/16-virtual-attributes"
"/15-fun-with-find-conditions"</pre></p>
<p>We need a prefix of the domain and to get rid of those quotes:
cat urls_href_clean.txt | perl -e 'while(<>) { s/href\=/http\:\/\/railscasts.com/; s/\"//; s/\"//; print}' > urls_href_super_clean.txt</p>
<p>Despite our horribly unmaintainable "super" naming convention, we now have a text file full of URLs that looks like this:</p>
<pre lang="html">http://railscasts.com/episodes/17-habtm-checkboxes
http://railscasts.com/episodes/16-virtual-attributes
http://railscasts.com/episodes/15-fun-with-find-conditions</pre></p>
<h3>Scrape</h3><p>
Fire wget using our text file as input (-i).  Recurse (-r), go only two levels deep (-l), don't download the file if we have one that's newer and use timestamps to make this possible (-Nc), span hosts (-H), no directories (-nd), disrespect the robots.txt file (-erobots=off) and look for only .mov files (-A).
<code>wget -r -erobots=off -l2 -H -Nc -nd -A.mov -i urls_href_super_clean.txt</code></p>
<p>You might want to create a working directory for this before you run it.  And probably run it under "screen" if you have that command.  After you do, you'll eventually you'll have a directory full of railscasts.  Or, you could just subscribe to <a href="http://itunes.apple.com/us/podcast/railscasts/id218282043">their feed on iTunes</a>.  Getting it through iTunes is a lot easier but that wasn't <a href="http://en.wikipedia.org/wiki/Knowledge_by_acquaintance">the point</a>.</p>
