---
layout: post
status: publish
published: true
title: Strip off tabs in vim
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 64
wordpress_url: http://squarism.com/2005/09/22/strip-off-starting-or-beginning-tabs-in-vim/
date: !binary |-
  MjAwNS0wOS0yMiAxNTozNTozOCAtMDQwMA==
date_gmt: !binary |-
  MjAwNS0wOS0yMiAyMDozNTozOCAtMDQwMA==
categories:
- Unix
tags: []
comments:
- id: 12
  author: phil76
  author_email: me@phillipoertel.com
  author_url: ''
  date: !binary |-
    MjAwNi0wMy0wNiAxMzowMzoyMiAtMDUwMA==
  date_gmt: !binary |-
    MjAwNi0wMy0wNiAxODowMzoyMiAtMDUwMA==
  content: most of the time, highlighting the text in visual block mode and then pressing
    = works, too - it'll be indented correctly afterwards.
- id: 13
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAwNi0wMy0wOSAxNDo1NDo1NCAtMDUwMA==
  date_gmt: !binary |-
    MjAwNi0wMy0wOSAxOTo1NDo1NCAtMDUwMA==
  content: Phil76, I couldn't get your tip to work on a bit of XML text.  Does it
    only work in certain situations or when vi thinks you are working in a specific
    programming language?
---
<p>When you paste a block of text into a Putty window, many times you'll get an increasing number of leading tabs.  Not so if you use gnome-terminal (IIRC).  Quite annoying in a Windows world.</p>
<p>Strip tabs and spaces out from current position to the end of the file with:
<code>
:.,$s/^[<tab>]*\s*//
</code></p>
<p>Or perhaps you only want a small block in the middle of the file changed.  First, turn on line numbers.</p>
<p><code>
:set number
</code></p>
<p>Then search and replace on specific line numbers (in this example lines 15 through 41).
<code>
:15,41s/^[<tab>]*\s*//
</code></p>
<p>Then use Ctrl-V (down arrow or h,j,k,l keys to select block) and hit ">" to re-indent.  Works much better than reformatting by hand.</p>
