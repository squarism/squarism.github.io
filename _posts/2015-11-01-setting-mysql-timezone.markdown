---
layout: post
status: published
published: true
title: Setting timezone with homebrew installed mysql
date: 2015-11-01
---

I couldn't find this information anywhere so I'm writing it.  If you installed mysql (and I mean MariaDB) through homebrew
then you might find some trouble when trying to set your timezone to UTC or GMT.

Edit `/usr/local/etc/my.cnf`. Add a new section at the bottom:

{% highlight text %}
[mysqld]
default-time-zone='+00:00'
{% endhighlight %}

Restart mysql.

{% highlight text %}
> select @@global.time_zone;
+--------------------+
| @@global.time_zone |
+--------------------+
| +00:00             |
+--------------------+
{% endhighlight %}

Alternatively, you could break this out into a file called `/usr/local/etc/my.cnf.d/gmt.cnf`

{% highlight text %}
[mysqld]
default-time-zone='+00:00'
{% endhighlight %}

The plus sign is critical.  If you find any tips/tricks related to this, send them to me on twitter.  Contact information
is there on the sidebar.
