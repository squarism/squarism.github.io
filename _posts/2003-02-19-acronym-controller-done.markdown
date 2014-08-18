---
layout: post
status: publish
published: true
title: Acronym Controller Done
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 12
wordpress_url: http://squarism.com/2003/02/19/acronym-controller-done/
date: !binary |-
  MjAwMy0wMi0xOSAxMDowOTo0MiAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMi0xOSAxNTowOTo0MiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>
The controller is finished, although it may change later.  It takes a URL string from the request and instantiates an Action object which then can forward someone to a JSP page or do whatever.
</p></p>
<p>In the following very specific example, the controller receives this URL: <code>http://server/controller/post</code>
</p></p>
<p>
The controller would look at the actionMap.properties file (it grabs this from the web.xml deployment descriptor) and translate that into <code>package.action.postAction</code>.  Let's say that we wanted to thank the user for posting.  The postAction can be setup to forward to a thank you JSP page called thanks.jsp.  The URL won't change during this process.  This is good for hiding the technology that I'm using.  Makes it look cleaner.
</p></p>
<p>
My next step is to get the display JSP page working.  This involves some SQL stuff.  Trying to find the best way to do SQL queries.  Beans?  Custom Tags?
</p></p>
