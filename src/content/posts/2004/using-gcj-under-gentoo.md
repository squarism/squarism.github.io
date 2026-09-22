---
title: "Using gcj under gentoo"
description: "If you follow the instructions off of gentoo's website they are very good instructions for x86 on 2004.1 then you end up with a system that doesn't"
date: 2004-06-01T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

If you follow the instructions off of gentoo's website (they are very good instructions) for x86 on 2004.1 then you end up with a system that doesn't have gcj.  Here's what I did to get it working.

<!-- more -->

This takes a while to run.  I suggest starting the emerge under "screen".  Type `screen` to start screen and then follow these instructions.  If you don't have screen, type `emerge screen`.  If you don't know what screen is [see this post](/posts/10-friggin-useful-linux-tips/), number 6 on the list.

First, emerge gcc again like this:

```bash
USE="java gcj" emerge gcc
```

At the time, this emerged 3.3.2-r5

```text
sys-devel/gcc
      Latest version available: 3.3.2-r5
      Latest version installed: 3.3.2-r5
```

Then create your little java app:

```bash
user@server /tmp $ cat HelloWorld.java
public class HelloWorld {
    public static void main(String args[]) {
        System.out.println("hi");
    }
}
```

Next, compile it like this:
```bash
gcj --main=HelloWorld -o Hello HelloWorld.java
```

Finally, run it:
```bash
user@server /tmp $ ./Hello
hi
```

Then you can move that file to another Linux box (provided all the libc libraries match and other stuff I don't know about) and run it.  Very cool.

More info here:
[Linux Journal](http://www.linuxjournal.com/article.php?sid=4860)
[GCJ FAQ](http://gcc.gnu.org/java/faq.html)
