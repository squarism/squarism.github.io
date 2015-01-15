---
layout: post
status: publish
published: true
title: Rbenv bash prompt
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1479
wordpress_url: http://squarism.com/?p=1479
date: !binary |-
  MjAxMS0xMi0wNSAxNjowNToyNyAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMi0wNSAyMTowNToyNyAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
Sam Stephenson [has a pretty looking bash prompt](https://github.com/sstephenson/rbenv) screenshotted in his rbenv project's README.  All you have to do is:

*   Set your Terminal theme to Basic.  Make sure to re-set any preferences you might have (like no audible bell etc).
*   Set your Terminal font to 13pt Inconsolata.  This isn't the exact font he uses but it's as close as I could find.
*   Set your ANSI Color for Normal White(7) to Tin (Crayons tab in color picker)
*   Put this bash code from [this gist](https://gist.github.com/1423532) at the end of your .profile file.
*   Install rbenv so you don't get the errors I got below because I'm still on RVM.  :)</p>

![](/uploads/2011/12/rbenv_wannabe.png "rbenv_wannabe")

I covet, I steal.

Even though I don't show it there, the bash script will do the git repo status magic for you on OSX.  You need to brew install git and have the shell completion scripts in /usr/local ([homebrew](http://mxcl.github.com/homebrew/) will do this).