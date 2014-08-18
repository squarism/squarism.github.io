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
<p>Sam Stephenson <a href="https://github.com/sstephenson/rbenv">has a pretty looking bash prompt</a> screenshotted in his rbenv project's README.  All you have to do is:</p>
<ul>
<li>Set your Terminal theme to Basic.  Make sure to re-set any preferences you might have (like no audible bell etc).</li>
<li>Set your Terminal font to 13pt Inconsolata.  This isn't the exact font he uses but it's as close as I could find.</li>
<li>Set your ANSI Color for Normal White(7) to Tin (Crayons tab in color picker)</li>
<li>Put this bash code from <a href="https://gist.github.com/1423532">this gist</a> at the end of your .profile file.</li>
<li>Install rbenv so you don't get the errors I got below because I'm still on RVM.  :)</li>
</ul></p>
<p><img src="/uploads/2011/12/rbenv_wannabe.png" alt="" title="rbenv_wannabe" width="613" height="353" class="aligncenter size-full wp-image-1480" /></p>
<p>I covet, I steal.</p>
<p>Even though I don't show it there, the bash script will do the git repo status magic for you on OSX.  You need to brew install git and have the shell completion scripts in /usr/local (<a href="http://mxcl.github.com/homebrew/">homebrew</a> will do this).</p>
