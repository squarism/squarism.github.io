---
layout: post
status: publish
published: true
title: Using gcj under gentoo
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'If you follow the instructions off of gentoo''s website (they are very
  good instructions) for x86 on 2004.1 then you end up with a system that doesn''t
  have gcj.  Here''s what I did to get it working.

'
wordpress_id: 43
wordpress_url: http://squarism.com/2004/06/01/using-gcj-under-gentoo/
date: !binary |-
  MjAwNC0wNi0wMSAxNTo1NDowNSAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0wNi0wMSAyMDo1NDowNSAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
If you follow the instructions off of gentoo's website (they are very good instructions) for x86 on 2004.1 then you end up with a system that doesn't have gcj.  Here's what I did to get it working.

<!-- more -->

This takes a while to run.  I suggest starting the emerge under "screen".  Type `screen' to start screen and then follow these instructions.  If you don't have screen, type `emerge screen'.  If you don't know what screen is [see this post](http://squarism.com/archives/cat_unix.html#000014), number 6 on the list.

First, emerge gcc again like this:

`
USE="java gcj" emerge gcc
`

At the time, this emerged 3.3.2-r5

`
sys-devel/gcc
      Latest version available: 3.3.2-r5
      Latest version installed: 3.3.2-r5
`

Then create your little java app:

<pre>
user@server /tmp $ cat HelloWorld.java
public class HelloWorld {
    public static void main(String args[]) {
        System.out.println("hi");
    }
}
</pre>

Next, compile it like this:
`
gcj --main=HelloWorld -o Hello HelloWorld.java
`

Finally, run it:
`
user@server /tmp $ ./Hello
hi
`

Then you can move that file to another Linux box (provided all the libc libraries match and other stuff I don't know about) and run it.  Very cool.

More info here:
[Linux Journal](http://www.linuxjournal.com/article.php?sid=4860)
[GCJ FAQ](http://gcc.gnu.org/java/faq.html)