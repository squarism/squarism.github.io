---
layout: post
status: publish
published: true
title: OpenCV in Eclipse
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 139
wordpress_url: http://squarism.com/?p=139
date: !binary |-
  MjAwOS0wNC0wNSAwMToyMjozMiAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wNC0wNSAwNjoyMjozMiAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
<p>I was getting a weird runtime error about native library something in Eclipse while messing around with OpenCV (using Processing.org).
<code>!!! library OpenCV not found
Exception in thread "Animation Thread" java.lang.UnsatisfiedLinkError: capture</code></p>
<p>I found the answer was to configure native libraries in my project.  This is something I've never done in Eclipse so I thought I'd post it in case someone googles this error message.  First, I set up my project like the following.  Notice that I created a folder named "native".  I moved the shared library files (.dll, .so, .jndilib) into this folder.  I am on a mac but I moved the DLL files anyway.
<img src="/uploads/2009/04/opencv_eclipse_1.png" alt="opencv_eclipse_1" title="opencv_eclipse_1" width="208" height="328" class="aligncenter size-full wp-image-140" /></p>
<p>Then I went into my project properties and set the Native Library Location as this folder.  Viola.  The processing applet launches.
<img src="/uploads/2009/04/opencv_eclipse_2.png" alt="opencv_eclipse_2" title="opencv_eclipse_2" width="316" height="171" class="aligncenter size-full wp-image-141" /></p>
