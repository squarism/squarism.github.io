---
title: "OpenCV in Eclipse"
description: "I was getting a weird runtime error about native library something in Eclipse while messing around with OpenCV using Processing.org. !!! library Op"
date: 2009-04-05T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I was getting a weird runtime error about native library something in Eclipse while messing around with OpenCV (using Processing.org).
```text
!!! library OpenCV not found
Exception in thread "Animation Thread" java.lang.UnsatisfiedLinkError: capture
```

I found the answer was to configure native libraries in my project.  This is something I've never done in Eclipse so I thought I'd post it in case someone googles this error message.  First, I set up my project like the following.  Notice that I created a folder named "native".  I moved the shared library files (.dll, .so, .jndilib) into this folder.  I am on a mac but I moved the DLL files anyway.
![opencv_eclipse_1](/uploads/2009/04/opencv_eclipse_1.png "opencv_eclipse_1")

Then I went into my project properties and set the Native Library Location as this folder.  Viola.  The processing applet launches.
![opencv_eclipse_2](/uploads/2009/04/opencv_eclipse_2.png "opencv_eclipse_2")
