---
layout: post
status: publish
published: true
title: swt, eclipse and OS X problems
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 35
wordpress_url: http://squarism.com/2004/01/17/swt-eclipse-and-os-x-problems/
date: !binary |-
  MjAwNC0wMS0xNyAxODozNzo0NSAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMS0xNyAyMzozNzo0NSAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
Following a hello world tutorial, I got stuck on this error:

<pre>
java.lang.UnsatisfiedLinkError: no swt-carbon-3034
</pre>

Couldn't find anything so I thought I'd post the fix for someone like me out there:

Found it from an [unusual source](http://llama.logos.k.u-tokyo.ac.jp/~simokawa/archives/000247.html).  Seems I couldn't get the VM parameters to work so I have to do SWT's not recommended suggestion of copying the file to the jre bin path.  **Although they never gave the file or the path!** (I'm going to send them an email.)

Just do this:

<pre>
cp [path to libswt-carbon-3034.jnilib] \
/System/Library/Frameworks/JavaVM.framework/Versions/1.4.1/Libraries/
</pre>

Note that libswt-carbon-3034.jnilib is version dependant.  It could be named libswt-carbon "anything" .jnilib.  I found in [ECLIPSE HOME] /plugins/org.eclipse.swt.carbon_3.0.0/os/macosx/ppc