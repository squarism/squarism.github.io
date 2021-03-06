---
layout: post
status: publish
published: true
title: A courier4 upgrade snag.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 65
wordpress_url: http://squarism.com/2005/11/15/a-courier4-upgrade-snag/
date: 2005-11-15
categories:
- Unix
tags: []
comments: []
---
I ran into a weird error with Thunderbird. When I would reply to all in an email, some people were CC'd.  When I hit send, I got a relay error.  I restarted courier-imap and did all sorts of stuff and eventually decided to update all my mail software on my gentoo server.

It was a long shot but it actually fixed the CC: problem.  Whether or not it directly fixed the CC: problem, I cannot prove.  I did a `# emerge courier-imap postfix ` without enabling ~x86 unstable packages or bleeding edge stuff.  It happily emerged and didn't work.  I couldn't log into IMAP but postfix ran fine.  I was running courier3 and emerge picked up courier4.0.1.  Postfix went from 2.0.4 to 2.2.5.  Postfix did some upgrade bits on databases and config files (I think).  But courier-imap was dead in the water.  I had (and still have) a problem getting courier to log a bit more, like more debug messages.

`imapd: authentication error: Input/output error`

That wasn't quite enough.  But luckily this message was enough to run into a forum post:

`authdaemond: /usr/lib/courier-authlib/libauthpam.so.0: undefined symbol: nscd_flush_cache`

This is a shared library problem.  Someone linked against a file I don't have, so it bombs at runtime.  I found this bit via Google cache (the original hint has been removed..weird).

{% highlight bash %}
Now test the POP3 using any MUA.  If you get an error message (with DEBUG_LOGIN=2)

libauthpam.so.0: undefined symbol: nscd_flush_cache

you are using broken version of courier-libpam.  Try this:
# echo ">=net-libs/courier-authlib-0.57" >> /etc/portage/package.mask
# emerge courier-authlib
{% endhighlight %}


I did exactly that.  Masked 0.57 and re-emerged.  I restarted a few services:
{% highlight bash %}
# /etc/init.d/courier-authlib restart
# /etc/init.d/courier-imapd restart
{% endhighlight %}

And was able to get to my IMAP mail again.
