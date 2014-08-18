---
layout: post
status: publish
published: true
title: Using sed to manipulate ctd type strings from Solaris
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 48
wordpress_url: http://squarism.com/2004/10/22/using-sed-to-manipulate-ctd-type-strings-from-solaris/
date: !binary |-
  MjAwNC0xMC0yMiAxMzo0NzoyMiAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0xMC0yMiAxODo0NzoyMiAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p>This is a very specific example.  I found this tricky because regular expressions in <a href="http://www.student.northpark.edu/pemente/sed/sed1line.txt">sed </a>isn't the same as in <a href="http://perl.com/">Perl</a>.</p>
<p>I wanted to take output from the <em>format </em>command in Solaris and just get a list of disks on the system.</p>
<p>I ran <em>format </em>and redirected the output to a file called disks.txt</p>
<p>-- file: disks.txt --
<code>
       0. c0t0d0
          /pci@1f,4000/scsi@3/sd@0,0
       1. c0t1d0
          /pci@1f,4000/scsi@3/sd@1,0
       2. c1t32d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cf8ab02c,0
       3. c1t33d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cfb448ed,0
       4. c1t34d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cf70fd3f,0
       5. c1t35d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cfa6efc4,0
</code></p>
<p>Then I wanted just the 'ctd' names of these disks (ie: c1t35d0 being the last one).</p>
<p>-- magical sed trick --
<code>
cat disks.txt | sed -n 's/\(.*\)\(c[0-9]*t[0-9]*d[0-9]*\)\(.*\)/\2/p'
</code></p>
<p>This should output:
<code>
c0t0d0
c0t1d0
c1t32d0
c1t33d0
c1t34d0
c1t35d0
</code></p>
<p>The one thing I can't figure out is how to run <em>format</em>  in a non-interactive way for scripting.  It seems you have to resort to using the path_to_inst file.  I did something like this in my humble project <a href="http://squarism.com/projects/easylun.html">easylun</a>.</p>
