---
title: "Kontiki Trojan / Virus in disguise"
description: "At work a while back, we had hundreds of K of ICMP going to our router and we couldn't figure out why. We threw a sniiffer on our network and take ..."
date: 2004-03-31T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

At work a while back, we had hundreds of K of ICMP going to our router and we couldn't figure out why.  We threw a sniiffer on our network and take a look at the enclosed and censored screenshot.  Notice the part in the yellow box and the 5 second intervals.  I left the "sim" of the source machine so that you can see it's all coming from the same place.


Believe it or not, we finally traced the port number and service using fport for windows to kontiki.com.  They sneak their "marketing tool" in with bundled software and use your Internet connection to push out ads, files and who knows what else.  Of course it's all legal according to the license terms.

http://www.kontiki.com/client/terms.html

But just because it's legal doesn't mean it's right.  It pisses me off, wastes my time and can't possibly be good business.  Check out the following for more information:

http://www.extremetech.com/article2/0,3973,365073,00.asp
