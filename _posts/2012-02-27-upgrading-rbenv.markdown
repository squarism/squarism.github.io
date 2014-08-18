---
layout: post
status: publish
published: true
title: Upgrading Rbenv
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1560
wordpress_url: http://squarism.com/?p=1560
date: !binary |-
  MjAxMi0wMi0yNyAyMTo1MzoyMiAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMi0yOCAwMjo1MzoyMiAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 7626
  author: stayce
  author_email: staycek@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMy0wNS0wNyAxMjo1OTozMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMy0wNS0wNyAxNzo1OTozMiAtMDQwMA==
  content: Thanks so much. All the other instructions are mac specific.
---
<p><img src="/uploads/2012/02/rbenv.png" alt="" title="rbenv" width="140" height="140" class="alignright size-full wp-image-1566" style="padding:10px"/>
I've recently switched from rvm to rbenv on most of my dev boxes.  I loved RVM to death, no offense to all the hard work that Wayne did.  He's a great guy and I listen to him talk on podcasts.  I just think RVM is a bit heavy handed in some things and dealing with readline failures (despite doing the same steps as I've done many times before) and other things was getting tiresome.  I'm not sure how complete all my testing is (such as Textmate or Sublime Text 2 support) so a bit of this is not "I've converted!" it's more of a "I'm currently converting".</p>
<p>The biggest change is how to pull new rubies in.  What I mean is, let's say a future version comes out.  Let's call it Ruby 14.0 so that this blog post doesn't look dated for a really long time (#wat).  If you wanted to update your global ruby with RVM, it'd go something like this: 1) rvm get latest 2) rvm install ruby-14.0  Then you'd migrate your gemsets or play with .rvmrc files.</p>
<p>Rbenv is a bit easier in this regard but it requires slightly more typing.  I'll also show you a little trick on how to incorporate some plugins neatly.</p>
<p><code>
> rbenv versions
  1.8.7-p357
* 1.9.3-p0 (set by /home/user/.rbenv/version)
</code></p>
<p>Bah.  We already dated this blog post.  Anyway.  1.9.3-p125 is currently out.  So let's try to pull it in.</p>
<p><code>
> rbenv install 1.9.3-p125
ruby-build: definition not found: 1.9.3-p125
</code></p>
<p>"What?  It's out!  I even just did this on another rbenv install!  What is going on?"
[Keep raging, don't ship apps.]</p>
<p>So what's happening here is the rbenv is so old that it doesn't know what p125 is.  So let's update our rbenv install.</p>
<p><code>
> cd ~/.rbenv
> git pull
</code></p>
<p>Great.  But that's not the equivalent of 'rvm get latest' because we are using ruby-build to do the 'rbenv install'.  Now the default documentation has you checkout ruby-build in your home directory.  So if you copied and pasted (like me) then you have a ~/ruby-build dir.  Let's move that to ~/.rbenv/plugins (make sure plugins is a directory).  If you are using rbenv-gemsets to mimic rvm gemsets then you already have a plugin directory.</p>
<p><code>
> ls ~/.rbenv/plugins
rbenv-gemset  ruby-build</p>
<p>> cd ~/.rbenv/plugins/ruby-build
git pull
</code></p>
<p>If you installed <a href="https://github.com/sstephenson/ruby-build">ruby-build</a> into /usr/local then you can leave off the PREFIX variable.
<code>
> PREFIX=~/local ./install.sh
</code></p>
<p>If you installed it into your home, you'll need to modify your PATH variable:
# for ruby build and other PREFIX overridden builds
<code>
if [ -d "$HOME/local/bin" ] ; then
    PATH="$HOME/local/bin:$PATH"
fi
</code></p>
<p>If you want it in /usr/local, then leave off the above if statement etc and just run sudo ./install.sh like the ruby-build docs say.</p>
<p>Now rbenv knows what you're talking about:
<code>
> rbenv install --definitions 2>&1 | grep p125
</code></p>
<p>And now you can install the new ruby and set it to be your default.  The good thing here is, unless you're switching ruby versions, you don't need to update all your gemset files like you need to in RVM.  So for me, there's less impact when keeping Ruby up-to-date.</p>
