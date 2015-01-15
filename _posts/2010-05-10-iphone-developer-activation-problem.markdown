---
layout: post
status: publish
published: true
title: iPhone Developer Activation Problem
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 461
wordpress_url: http://squarism.com/?p=461
date: !binary |-
  MjAxMC0wNS0xMCAxNzo1ODowNiAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0xMCAyMjo1ODowNiAtMDQwMA==
categories:
- Mac
- ObjC
tags: []
comments: []
---
![](/uploads/2010/05/iphone_portal_expiration.png "iphone_portal_expiration")
I went to renew my membership on my iPhone developer account and although the membership is $99/year, my expiration date was only extended out for 3 months.  I opened a ticket and it took about a month or two to get this thing resolved.  I had to send screenshots, steps and evidence that I was doing the right thing (ok, fine, tier 1 support).  Eventually I got a person that had a trick up their sleeve but didn't quite get it right.  I'm blogging this in case this is happening to someone else.

First, the symptoms.  Let's say your dev account is about to expire in January 2010.  You want to renew for another year.  You add a year subscription to your cart, pay for it.  You'd expect your new expire date to be Jan-2011.  But in your profile and in the "thanks for ordering" activation page it says March 2010 or something else wrong.  Support send me activation links basically to the same page that wouldn't activate any differently.  Each time I checked out, it would say March 2010.

The trick was to click on renew membership (as if paying again), click the checkbox to select which membership you want to buy ($99 year) and hit continue.  Now you're on a "Review your purchase" page.  Click continue here.  Finally, it says "Proceed to your country's Apple Online Store to purchase" and has an add to cart button.  Stop here.

Click the following link: [http://developer.apple.com/iphone/enroll/activate.action](http://developer.apple.com/iphone/enroll/activate.action).  It should bring you to a page with a single textbox for your activation code (the one you've been trying to use all along).  Put this in and hit continue.  Your expire date should be correct now.  If not, try using a link formatted like this:
`http://developer.apple.com/iphone/enroll/activate.action?activationCode=YOURCODEHERE`

Seems like they have some bug in the dev store.  Please comment if this helped you so it's documented.