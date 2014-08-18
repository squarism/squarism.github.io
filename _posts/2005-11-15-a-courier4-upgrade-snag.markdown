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
date: !binary |-
  MjAwNS0xMS0xNSAxOTo0Nzo1NCAtMDUwMA==
date_gmt: !binary |-
  MjAwNS0xMS0xNiAwMDo0Nzo1NCAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
<p>I ran into a weird error with Thunderbird. When I would reply to all in an email, some people were CC'd.  When I hit send, I got a relay error.  I restarted courier-imap and did all sorts of stuff and eventually decided to update all my mail software on my gentoo server.</p>
<p>It was a long shot but it actually fixed the CC: problem.  Whether or not it directly fixed the CC: problem, I cannot prove.</p>
<p>I did a
<code>
# emerge courier-imap postfix
</code>
without enabling ~x86 unstable packages or bleeding edge stuff.  It happily emerged and didn't work.  I couldn't log into IMAP but postfix ran fine.</p>
<p>I was running courier3 and emerge picked up courier4.0.1.  Postfix went from 2.0.4 to 2.2.5.  Postfix did some upgrade bits on databases and config files (I think).  But courier-imap was dead in the water. </p>
<p>I had (and still have) a problem getting courier to log a bit more, like more debug messages.  </p>
<p><code>
imapd: authentication error: Input/output error
</code></p>
<p>That wasn't quite enough.  But luckily this message was enough to run into a forum post:</p>
<p><code>
authdaemond: /usr/lib/courier-authlib/libauthpam.so.0: undefined symbol: nscd_flush_cache
</code></p>
<p>This is a shared library problem.  Someone linked against a file I don't have, so it bombs at runtime.  I found this bit via Google cache (the original hint has been removed..weird).</p>
<blockquote><p>
Now test the POP3 using any MUA. If you get an error message (with DEBUG_LOGIN=2)</p>
<p>libauthpam.so.0: undefined symbol: nscd_flush_cache</p>
<p>you are using broken version of courier-libpam. Try this:</p>
<p># echo ">=net-libs/courier-authlib-0.57" >> /etc/portage/package.mask
# emerge courier-authlib</p>
<p>I have had problems with 0.57 versions, version 0.55 works fine.
</p></blockquote>
<p>I did exactly that.  Masked 0.57 and re-emerged.  I restarted a few services:
<code>
# /etc/init.d/courier-authlib restart
# /etc/init.d/courier-imapd restart
</code></p>
<p>And was able to get to my IMAP mail again.</p>
