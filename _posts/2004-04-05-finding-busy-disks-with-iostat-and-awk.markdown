---
layout: post
status: publish
published: true
title: Finding busy disks with iostat and awk
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 41
wordpress_url: http://squarism.com/2004/04/05/finding-busy-disks-with-iostat-and-awk/
date: !binary |-
  MjAwNC0wNC0wNSAxNDo0MDoyNSAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0wNC0wNSAxOTo0MDoyNSAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
So you want to find busy disks in solaris?  Maybe you want a quick iostat summary?  Need an easier way to find slow disks?  Getting percent busy info from iostat is easy with awk.  Usually any disk with %busy greater than 0 (some people prefer >= 2) is a sign of a slow disk.

`
iostat -xcn|awk '$10 > 0{ print $10"%" " - "  $11 }'
`

Or perhaps you want to see how many disks are considered 'slow' in your system:

`
echo `iostat -xcn|awk '$10 > 0{ print $10"%" " - "  $11 }'|wc -l` out of `iostat -xcn|wc -l`
`