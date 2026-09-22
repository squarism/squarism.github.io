---
title: "Upgrading Rbenv"
description: "Blog post about upgrading rbenv"
date: 2012-02-27T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I've recently switched from rvm to rbenv on most of my dev boxes.  I loved RVM to death, no offense to all the hard work that Wayne did.  He's a great guy and I listen to him talk on podcasts.  I just think RVM is a bit heavy handed in some things and dealing with readline failures (despite doing the same steps as I've done many times before) and other things was getting tiresome.  I'm not sure how complete all my testing is (such as Textmate or Sublime Text 2 support) so a bit of this is not "I've converted!" it's more of a "I'm currently converting".

The biggest change is how to pull new rubies in.  What I mean is, let's say a future version comes out.  Let's call it Ruby 14.0 so that this blog post doesn't look dated for a really long time (#wat).  If you wanted to update your global ruby with RVM, it'd go something like this: 1) rvm get latest 2) rvm install ruby-14.0  Then you'd migrate your gemsets or play with .rvmrc files.

Rbenv is a bit easier in this regard but it requires slightly more typing.  I'll also show you a little trick on how to incorporate some plugins neatly.

```bash
> rbenv versions
  1.8.7-p357
* 1.9.3-p0 (set by /home/user/.rbenv/version)
```

Bah.  We already dated this blog post.  Anyway.  1.9.3-p125 is currently out.  So let's try to pull it in.

```bash
> rbenv install 1.9.3-p125
ruby-build: definition not found: 1.9.3-p125
```

"What?  It's out!  I even just did this on another rbenv install!  What is going on?"
[Keep raging, don't ship apps.]

So what's happening here is the rbenv is so old that it doesn't know what p125 is.  So let's update our rbenv install.

```bash
> cd ~/.rbenv
> git pull
```

Great.  But that's not the equivalent of 'rvm get latest' because we are using ruby-build to do the 'rbenv install'.  Now the default documentation has you checkout ruby-build in your home directory.  So if you copied and pasted (like me) then you have a ~/ruby-build dir.  Let's move that to ~/.rbenv/plugins (make sure plugins is a directory).  If you are using rbenv-gemsets to mimic rvm gemsets then you already have a plugin directory.

```bash
> ls ~/.rbenv/plugins
rbenv-gemset  ruby-build

> cd ~/.rbenv/plugins/ruby-build
git pull
```

If you installed [ruby-build](https://github.com/sstephenson/ruby-build) into /usr/local then you can leave off the PREFIX variable.
```bash
> PREFIX=~/local ./install.sh
```

If you installed it into your home, you'll need to modify your PATH variable:
```bash
# for ruby build and other PREFIX overridden builds
if [ -d "$HOME/local/bin" ] ; then
    PATH="$HOME/local/bin:$PATH"
fi
```

If you want it in /usr/local, then leave off the above if statement etc and just run sudo ./install.sh like the ruby-build docs say.

Now rbenv knows what you're talking about:
```bash
> rbenv install --definitions 2>&1 | grep p125
```

And now you can install the new ruby and set it to be your default.  The good thing here is, unless you're switching ruby versions, you don't need to update all your gemset files like you need to in RVM.  So for me, there's less impact when keeping Ruby up-to-date.
