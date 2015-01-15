---
layout: post
status: publish
published: true
title: Mountain Lion and Rails development
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1589
wordpress_url: http://squarism.com/?p=1589
date: !binary |-
  MjAxMi0wNy0yNyAxOTo1MjowNiAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wNy0yOCAwMDo1MjowNiAtMDQwMA==
categories:
- Mac
tags: []
comments: []
---
![](/uploads/2012/07/10.8-300x220.jpg "10.8")
If you do development on a Mac, you might be considering upgrading to Mountain Lion because of speed improvements and you greatly desire a notes application with a [skeuomorphic leather-bound notes application](http://cdn.arstechnica.net/wp-content/uploads/2012/07/notes-full-screen-big.png).  :)

I was afraid to take the plunge early so last night I did a test upgrade on a Mac that is not my main dev one.

**Get Xcode working**
First of all, you can follow [this gist](https://gist.github.com/1860902):

They have you go to developer.apple.com to get Xcode 4.4 but you can also use the App Store's upgrade button.  Step #2 explicitly has you download the command line tools for Xcode but you can also use the Xcode 4.4 command line tools for 10.8 from the developer site.  Both of these downloads are under 300mb.

Also, please note that there are many, many forks of that gist above.  Some just include extra screenshots in case you aren't familiar with Xcode but some follow very different steps.  I pretty much followed just the 'master' fork of that gist to get Xcode working.

**Fix Bundler**
But then I did a `bundle` in a rails project that uses a native lib (eventmachine) and bundle puked because it couldn't find gcc-4.2 in my path.  It looked something like this:

<pre lang="bash">
Installing eventmachine (1.0.0.rc.4) with native extensions
Gem::Installer::ExtensionBuildError: ERROR: Failed to build gem native extension.</p>

~/.rbenv/versions/1.9.3-p125/bin/ruby extconf.rb
checking for rb_trap_immediate in ruby.h,rubysig.h... no
checking for rb_thread_blocking_region()... yes
checking for inotify_init() in sys/inotify.h... no
checking for __NR_inotify_init in sys/syscall.h... no
checking for writev() in sys/uio.h... yes
checking for rb_thread_check_ints()... yes
checking for rb_time_new()... yes
checking for sys/event.h... yes
checking for sys/queue.h... yes
creating Makefile

make
compiling binder.cpp
make: g++-4.2: No such file or directory
make: *** [binder.o] Error 1

Gem files will remain installed in
~/.rbenv/versions/1.9.3-p125/lib/ruby/gems/1.9.1/gems/eventmachine-1.0.0.rc.4 for inspection.
Results logged to
~/.rbenv/versions/1.9.3-p125/lib/ruby/gems/1.9.1/gems/eventmachine-1.0.0.rc.4/ext/gem_make.out
An error occured while installing eventmachine (1.0.0.rc.4), and Bundler cannot continue.
Make sure that `gem install eventmachine -v '1.0.0.rc.4'` succeeds before bundling.
</pre>

Because Xcode 4.4 is LLVM based.  So I followed the rest of the ruby specifc bits [on thoughtbot](http://robots.thoughtbot.com/post/27985816073/the-hitchhikers-guide-to-riding-a-mountain-lion).  Specifically, the "Fix Homebrew + install GCC" section.  The rest of the blog post is handled by the gist above.

Things seem to work but my test box is not my day-to-day dev box.  I thought I'd share so you guys know that it's not an automatic upgrade for devs.  Definitely do the upgrade over the weekend or with some downtime.

**Brew upgrade**
You might run a brew update && brew upgrade regularly to keep your libraries and apps up to date but it installs multiple versions.  So you run a brew cleanup to remove old versions.  Well beware of some changes I've seen (I don't know the timeframe).  Conf files might be in the old versions.  For example, my mongod.conf was under /usr/local/Cellar/mongodb/#{old_version} but brew cleanup removed that directory.  Luckily, I just had the default config file in there.  The new location is /usr/local/etc/mongod.conf (as it should be).  I've seen this in other packages too.  Some packages have changed over the years so just take a look at your filesystem paths and config file locations.  If you reinstall brews for the Mountain Lion upgrade or do a brew cleanup make sure files you want to save won't be lost when doing a `brew remove` or `brew cleanup`.

Also, the launchagent plists have changed.
ls ~/Library/LaunchAgents
homebrew.mxcl.mysql.plist  (the file used to be called org.mysql.plist)

So when upgrading, homebrew will tell you to launchctl unload the old one.  But homebrew won't tell you that the name has changed.  Just something else to watch out for.  If you delete the old file before launchctl unloading, you'll have a few extra steps to do for forcefully unload it.  Not a big deal.  Just follow homebrew's instructions but also realize that they won't tell you that the filename has changed.