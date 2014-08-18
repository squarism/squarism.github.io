---
layout: post
status: publish
published: true
title: Some OpenGL progress
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 52
wordpress_url: http://squarism.com/2004/11/08/some-opengl-progress/
date: !binary |-
  MjAwNC0xMS0wOCAxMToyNDo0MiAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMS0wOCAxNjoyNDo0MiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>I finally got the FTGL library built.  It was quite annoying to do.  In the end, I had a libfreetype.a file (looks like an assembly binary) and a libftgl.a file.  I added those to the XCode project.  Then I double clicked on the target icon to pull up a properties pane where I could add the Freetype2 headers I installed from source.</p>
<p>I made freetype2's prefix path /sw/freetype2 with `configure --prefix=/sw/freetype2'.  With that path, I included /sw/freetype2 and /sw/freetype2/include in the XCode project.</p>
<p>I'll post screenshots of this whole process because I couldn't find jack on the Internet about this.</p>
<p>After futzing around with some FTGL demos that didn't work I finally modified an example to the point that it loaded a true type font and displayed the string "hi" on the screen.  I was very happy.  I was then able to move the texture and change the alpha channel to make it fade away.  What I'm looking for is a little popup of arbitrary text to appear over someone's head when they get hit to represent damage.</p>
<p>Right now, I'm stuck trying to figure out how to trigger this whole drawing thing off of a keystroke instead of just being called with by the main function.  I'll post the entire example with pics soon.  [placeholder]</p>
