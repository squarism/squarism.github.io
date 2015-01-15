---
layout: post
status: publish
published: true
title: Login delay in ProFTPd fix - reverse lookups
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 34
wordpress_url: http://squarism.com/2004/01/16/login-delay-in-proftpd-fix-reverse-lookups/
date: !binary |-
  MjAwNC0wMS0xNiAxODo0ODo1NyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMS0xNiAyMzo0ODo1NyAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
So you've tried everything to get rid of the login delay to ProFTPd.  You've configured ProFTPd over and over again but it still doesn't work?!  You're not running ProFTPd in standalone mode and you've come to the end of your rope right!?!?  "What is causing the login delay?!" you ask in vain, brandishing your cold and bitter fist to the storm clouds ...

Read on and find salvation in the xinetd configuration.

1. First, lets take care of the ProFTP side.  Make sure that you have **global ** entries in your proftpd.conf file:

<pre>
IdentLookups off
UseReverseDNS off
</pre>

2. But we're not done.  If you are running ProFTP in xinetd mode (opposite of standalone), edit your /etc/xinetd.d/proftp (or equivalent) file and make sure that you don't have any USERID entries under log_on_success or log_on_failure.  Here's an example that works:

<pre>
service ftp
{
        disable = no
        flags                   = REUSE
        socket_type             = stream
        wait                    = no
        user                    = root
        server                  = /usr/local/sbin/proftpd
        log_on_success          += DURATION HOST
        log_on_failure          += HOST
        nice                    = 10
        #bind                   = [IP to bind to]
}
</pre>

Notice that the places where you usually find "USERID" are replaced with "HOST".  The only drawback is that you won't be able to identify remote users in your logs.  But this rarely works anyway.

1.  First off, proftp is unlikely to lookup remote users and log what UID they're logged in as (I haven't seen this work).
2.  Second, [IDENT (port 113)](http://www.faqs.org/rfcs/rfc1413.html) would have to be open on the remote host.  This is unlikely in the modern age of the Internet where firewalls are typically rejecting this type of traffic.
