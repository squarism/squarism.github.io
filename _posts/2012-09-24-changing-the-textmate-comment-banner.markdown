---
layout: post
status: publish
published: true
title: Changing the TextMate Comment Banner
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1736
wordpress_url: http://squarism.com/?p=1736
date: !binary |-
  MjAxMi0wOS0yNCAyMjozOTo1OSAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0yNSAwMzozOTo1OSAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
I like to put a little date banner on files that are like a CHANGELOG.  The Insert Comment Banner in Textmate is great for this.  You just hit Ctrl+Shift+B and this appears:
{% highlight text %}
=========
= Banner
=========
{% endhighlight %}

And the equal signs on top and bottom adjust as you type in "Banner".  It's pretty cool.  But what I wanted is a timestamp in the banner.  So I'd leave Banner highlighted and then right click in Textmate and select "Filter through command" and put the Unix command date in there.  That's great except it puts Fri Jan 20 21:46:13 EDT 2034 in there which is a bit long.</p>

{% highlight text %}
===============================
= Fri Jan 1 21:46:13 EDT 2034
===============================
{% endhighlight %}

Too long.  So here's what you can do.  Go to Bundles->Bundle Editor->Show Bundle Editor.  Then go to the Source category.  You can filter at the top for Snippets if it's easier.  See this picture.

![snippet_banner](/uploads/2012/09/snippet_banner-580x431.png)

Then put this code in:

{% highlight perl %}
${TM_COMMENT_START/\s*$//}==${1/(.)|(?m:\n.*)/(?1:=)/g}==${TM_COMMENT_END/^\s*(.+)/ $1/}
${TM_COMMENT_START/\s*$//}= ${1:${TM_SELECTED_TEXT:`date +'%a %b %d %Y'`}} =${TM_COMMENT_END/\s*(.+)/ $1/}
${TM_COMMENT_START/\s*$//}==${1/(.)|(?m:\n.*)/(?1:=)/g}==${TM_COMMENT_END/\s*(.+)/ $1/}
{% endhighlight %}

This will give you a banner like this:
{% highlight text %}
===================
= Fri Jan 1 2034 =
===================
{% endhighlight %}

And it'll be the right length automatically.  Nice.
