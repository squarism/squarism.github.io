---
layout: post
status: publish
published: true
title: Kontiki Trojan / Virus in disguise
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 39
wordpress_url: http://squarism.com/2004/03/31/kontiki-trojan-virus-in-disguise/
date: !binary |-
  MjAwNC0wMy0zMSAwMDo1NDo0OCAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMy0zMSAwNTo1NDo0OCAtMDUwMA==
categories:
- News
tags: []
comments: []
---
<p>At work a while back, we had hundreds of K of ICMP going to our router and we couldn't figure out why.  We threw a sniiffer on our network and take a look at the enclosed and censored screenshot.  Notice the part in the yellow box and the 5 second intervals.  I left the "sim" of the source machine so that you can see it's all coming from the same place.</p>
<p><a href="http://squarism.com/archives/dump.html">View image</a></p>
<p>Believe it or not, we finally traced the port number and service using fport for windows to kontiki.com.  They sneak their "marketing tool" in with bundled software and use your Internet connection to push out ads, files and who knows what else.  Of course it's all legal according to the license terms.</p>
<p>http://www.kontiki.com/client/terms.html</p>
<p>But just because it's legal doesn't mean it's right.  It pisses me off, wastes my time and can't possibly be good business.  Check out the following for more information:</p>
<p>http://www.extremetech.com/article2/0,3973,365073,00.asp</p>
