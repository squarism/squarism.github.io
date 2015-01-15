---
layout: post
status: publish
published: true
title: A nice bash prompt
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 22
wordpress_url: http://squarism.com/2003/04/20/a-nice-bash-prompt/
date: !binary |-
  MjAwMy0wNC0yMCAxNToxNDo0OCAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNC0yMCAyMDoxNDo0OCAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
Throw this into your /etc/bashrc for all users to pick up this more interesting bash prompt.  If you just want to test it out on a single user's profile, add to ~/.bashrc (at the end is good).

{% highlight bash %}
# a ruley rule bash prompt
COLOR1="\[33[1;37m\]"
COLOR2="\[33[0;37m\]"
COLOR3="\[33[1;33m\]"
if [ "$UID" = "0" ];
then
COLOR2="\[33[1;34m\]"
fi
PS1="$COLOR2($COLOR1\u@\h$COLOR2)-($COLOR3\W$COLOR2)\\$ $COLOR1"
{% endhighlight %}

![](/files/ruley_rule_bash_prompt.jpg)