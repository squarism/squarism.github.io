---
layout: post
status: publish
published: true
title: Acronym Challenge Demo
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 14
wordpress_url: http://squarism.com/2003/02/28/acronym-challenge-demo/
date: !binary |-
  MjAwMy0wMi0yOCAyMjoxNTowOCAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMy0wMSAwMzoxNTowOCAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p><strong>Update: This is incredibly not accurate anymore.  Posterity</strong></p>
<p>
I've deployed the 1st version of the Acronym Challenge webapp to the server at <a href="http://www.fuzzylemon.net:8080/acronym/controller">this location</a>.
</p></p>
<p>
The controller passes off the request to an Action class.  The URL is preserved because it forwards the whole request object along to the action object.  See the code below:
</p></p>
<pre>
action.perform(this, req, res);
</pre></p>
<p>
The action object above is an interface.  Action objects have to have this perform method in it.  'this' refers to the servlet itself so the hand off is transparent (by design).  The user is handed off to an Action servlet based on the URL (hover over the plus and minus signs to see the href) and then forwarded back to the controller in one motion.
</p></p>
