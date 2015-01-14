---
layout: post
status: publish
published: true
title: Useful Crontab Header
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 54
wordpress_url: http://squarism.com/2004/11/12/useful-crontab-header/
date: 2004-11-12
categories:
- Unix
tags: []
comments: []
---

{% highlight bash %}
# minute (0-59),
# |      hour (0-23),
# |      |       day of the month (1-31),
# |      |       |       month of the year (1-12),
# |      |       |       |       day of the week (0-6 with 0=Sunday).
# |      |       |       |       |       commands
{% endhighlight %}

Good for putting at the top of crontab files.