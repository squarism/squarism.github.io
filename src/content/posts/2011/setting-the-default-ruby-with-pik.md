---
title: "Setting the default ruby with Pik"
description: "Pikhttps://github.com/vertiginous/pik/ is a nice alternative to RVM if you're on Windows. RVM has a few more features than pik but all in all, pik"
date: 2011-01-18T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

[Pik](https://github.com/vertiginous/pik/) is a nice alternative to RVM if you're on Windows.  RVM has a few more features than pik but all in all, pik does exactly what I want with very similar commands as RVM so it was a really nice transition.  I'm extremely impressed that they could get the whole thing to work actually.

However, there were a few gotchas (all detailed below).

1.  You need some version of ruby installed to get pik up and running.
2.  After installing any ruby using pik, you can switch your default and uninstall the bootstrap version if you wish.
3.  Pik supports proxies using the http_proxy environment variable.
4.  Installing a specific version has slightly different syntax than RVM.
First, you need some version of ruby installed (#1 up there).  I used JRuby for Windows (jruby_windows_x64_1_6_0_RC1.exe -- ymmv) because it had no dependencies.  JRuby gets installed to C:\jruby-1.6.0.RC1 (ymmv based on version) and pik picks it up and adds it to its list (very nice).  If you don't have a version of ruby installed you'll get:
`error: can't dup nilclass`
when you try to run pik.

What's really nice is that jruby's binary is jruby and not ruby.  But pik handled it.  I just ran both installers and then I had jruby in my "pik list".

What do I mean by pik list?  It's just like RVM.
```yaml
C:\Users\you>pik list
  160: jruby 1.6.0.RC1 (ruby 1.8.7 patchlevel 330) (2011-01-10 769f847) (Ja...
  187: ruby 1.8.7 (2010-12-23 patchlevel 330) [i386-mingw32]
* 192: ruby 1.9.2p136 (2010-12-25) [i386-mingw32]
```

Second, I wanted to set the default ruby with pik (why you are here reading this).  This was a bit odd and different than RVM.  RVM loads in the .bashrc so it makes sense that pik can't override the Windows cmd lifecycle.  The PATH variable sets which ruby is the default.  So just go to your Windows System Properties and set your user's %PATH% variable to the bin path of whichever ruby you want to use.  You can get the path like this:

```yaml
C:\Users\you>pik list -v
  160: jruby 1.6.0.RC1 (ruby 1.8.7 patchlevel 330) (2011-01-10 769f847) (Ja...
       ...va HotSpot(TM) 64-Bit Server VM 1.6.0_22) [Windows 7-amd64-java]
       path: C:\jruby-1.6.0.RC1\bin

  187: ruby 1.8.7 (2010-12-23 patchlevel 330) [i386-mingw32]
       path: C:\Users\you\.pik\rubies\Ruby-187-p330\bin

* 192: ruby 1.9.2p136 (2010-12-25) [i386-mingw32]
       path: C:\Users\you\.pik\rubies\Ruby-192-p136\bin
```

So for example, if you wanted 1.9.2 to be your default ruby, just add C:\Users\you\.pik\rubies\Ruby-192-p136\bin to the **beginning** of your user defined %PATH% variable in System Properties.  When you fire another cmd.exe, ruby should be all set.  Apparently this is the equivalent of the `rvm use 1.9.2 --default` on a 'nix system.

Pik supports proxies (phew).  Just do:
`set http_proxy=http://yourproxy`

You can test with viewing all the remote rubies:
`pik list -r`

Also, add this environment variable to your user's variable list just like you did with the %PATH% variable.

Installing a specific version is a bit different than RVM, you specify the version with a space.  In RVM, this would be "rvm install ruby-1.9.2"
`pik install ruby 1.9.2-rc1`

**Update:**
If you want to install a new ruby and move your gems do this:
```text
pik install ruby 1.9.2-p180
pik use 1.9.2-p180
(set your %PATH% to default as described above if you want)
pik gemsync p136 (imports from p136 into current which is p180)
```
