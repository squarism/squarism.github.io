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
<p>If you follow the instructions off of gentoo's website (they are very good instructions) for x86 on 2004.1 then you end up with a system that doesn't have gcj.  Here's what I did to get it working.
<a id="more"></a><a id="more-43"></a>
This takes a while to run.  I suggest starting the emerge under "screen".  Type `screen' to start screen and then follow these instructions.  If you don't have screen, type `emerge screen'.  If you don't know what screen is <a href="http://squarism.com/archives/cat_unix.html#000014">see this post</a>, number 6 on the list.</p>
<p>First, emerge gcc again like this:</p>
<p><code>
USE="java gcj" emerge gcc
</code></p>
<p>At the time, this emerged 3.3.2-r5</p>
<p><code>
sys-devel/gcc
      Latest version available: 3.3.2-r5
      Latest version installed: 3.3.2-r5
</code></p>
<p>Then create your little java app:</p>
<pre>
user@server /tmp $ cat HelloWorld.java
public class HelloWorld {
    public static void main(String args[]) {
        System.out.println("hi");
    }
}
</pre></p>
<p>Next, compile it like this:
<code>
gcj --main=HelloWorld -o Hello HelloWorld.java
</code></p>
<p>Finally, run it:
<code>
user@server /tmp $ ./Hello
hi
</code></p>
<p>Then you can move that file to another Linux box (provided all the libc libraries match and other stuff I don't know about) and run it.  Very cool.</p>
<p>More info here:
<a href="http://www.linuxjournal.com/article.php?sid=4860">Linux Journal</a>
<a href="http://gcc.gnu.org/java/faq.html">GCJ FAQ</a></p>
