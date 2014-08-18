---
layout: post
status: publish
published: true
title: Awk process shows up every night
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 89
wordpress_url: http://squarism.com/2008/10/08/awk-process-shows-up-every-night/
date: !binary |-
  MjAwOC0xMC0wOCAxMDo0NjoxOSAtMDQwMA==
date_gmt: !binary |-
  MjAwOC0xMC0wOCAxNTo0NjoxOSAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p>We had a weird problem at work towards the end of a java development / identity management project turn up.  The symptom was every night, an awk process would show up with some weird program arguments in the process table.</p>
<p>It was similar to this:
<code>ps auxww|grep awk
 0 13076 12539 16 0 2456 264 pipe_w S ? 0:00 awk -v progname=/etc/cron.daily/logrotate progname {????? print progname ":\n"????? progname="";???? }???? { print; }
</code></p>
<p>Of course, it wouldn't happen when logrotate would be forced to run, it would simply happen at night only.  So we had to wait a day, try something and wait again.  So after many tests and troubleshooting we figured out that it was related to file permissions.  This was a surprise.  Why would file permissions cause something to hang forever like this?  Permissions usually cause black/white problems like "cannot open file" or "horrific death exception".</p>
<p>I figured out why this happens and satisfied my inquisitiveness so that I could return to sanity.  It has to do with <a href="http://examples.oreilly.com/upt3/split/run-parts">run-parts</a>.  It has logic in it that detects executable files and runs awk.  You can see the "awk -v progname" string inside the if() statement eight lines from the bottom.</p>
<pre>
#!/bin/bash</p>
<p># run-parts - concept taken from Debian</p>
<p># keep going when something fails
set +e</p>
<p>if [ $# -lt 1 ]; then
        echo "Usage: run-parts <dir>"
        exit 1
fi</p>
<p>if [ ! -d $1 ]; then
        echo "Not a directory: $1"
        exit 1
fi</p>
<p># Ignore *~ and *, scripts
for i in $1/*[^~,] ; do
        [ -d $i ] && continue
        # Don't run *.{rpmsave,rpmorig,rpmnew,swp} scripts
        [ "${i%.rpmsave}" != "${i}" ] && continue
        [ "${i%.rpmorig}" != "${i}" ] && continue
        [ "${i%.rpmnew}" != "${i}" ] && continue
        [ "${i%.swp}" != "${i}" ] && continue
        [ "${i%,v}" != "${i}" ] && continue</p>
<p>        if [ -x $i ]; then
                $i 2>&1 | awk -v "progname=$i" \
                              'progname {
                                   print progname ":\n"
                                   progname="";
                               }
                               { print; }'
        fi
done</p>
<p>exit 0
</pre></p>
<p>...Mystery solved.</p>
