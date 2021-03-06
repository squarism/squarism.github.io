---
layout: post
status: publish
published: true
title: Ruby array sort and uniq bug
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 903
wordpress_url: http://squarism.com/?p=903
date: !binary |-
  MjAxMS0wMS0zMCAxNzo0NTo0NyAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0wMS0zMCAyMjo0NTo0NyAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
I found a ruby bug, reported it and it got fixed.  I'm posting this because I thought the whole process was pretty cool.  I very rarely find bugs but it's always fun feeling like you're giving back to the community you've lurked in for a long time.

First, the bug.

{% highlight ruby %}
a = [
  { :color => "blue",  :name => "water" },
  { :color => "red",   :name => "fire" },
  { :color => "white", :name => "wind" },
  { :color => "green", :name => "earth" },
  { :color => "green", :name => "moss" },
  { :color => "white", :name => "snow" }
]

# taking out the sort_by solves the problem
a.sort_by! { |e| e[:color] }
a.uniq! {|e| e[:color]}

puts a
{% endhighlight %}

Now it's supposed to print this:

{% highlight ruby %}
{:color=>"blue", :name=>"water"}
{:color=>"green", :name=>"moss"}
{:color=>"red", :name=>"fire"}
{:color=>"white", :name=>"wind"}
{% endhighlight %}

But instead ruby crashes.  On OSX, it's a BAD_EXEC error.  On Linux, it drops core with another error.  You can read my [whole bug report here](http://redmine.ruby-lang.org/issues/show/4346).  I wanted to test it a bunch and I found that the sort_by! is what causes it.  There were many workarounds possible but ruby should handle this case.

Anyway, I submitted a bug on the redmine site.  I knew redmine from work so this was easy.  Some time later, Yui Naruse [committed a fix](https://github.com/ruby/ruby/commit/a924b1768f2144cea4e6201245e3ee57aedc5318#diff-0).  Now, I had attempted to trace the issue myself.  But it's all C and ruby is huge.  So I was completely lost.  I can't even tell what the solution actually is even when looking at it.  :(

So the issue was closed, revision 30739 had the fix.  So I tried to update ruby-1.9.2-head using RVM but it kept pulling an older version.  I tried doing rvm cleanup all 1.9.2-head but it kept pulling and building an older revision.  So I just checked out [ruby from SVN](http://svn.ruby-lang.org/) and built it:

<pre lang="bash">
cd ~/tmp
svn co http://svn.ruby-lang.org/repos/ruby/trunk ruby
mv ruby/ ruby_svn_30739
cd ruby_svn_30739/
autoconf ./configure.in > configure
chmod u+x ./configure
./configure
make
</pre>

This was on a mac, so you have to have autoconf (I think I'm using the [homebrew](http://mxcl.github.com/homebrew/) version).  Anyway, ruby is built but I didn't want to install it if I couldn't built it with RVM (because it'd be hard to tear it out -- or at least I didn't know how).  So I was able to run the built ruby without installing like this:

<pre lang="bash">
user@box:ruby_svn_30739$ ./ruby -I lib:. bug.rb
</pre>

Where bug.rb is the code from above that crashes ruby.  And when you run it, it prints out the hash after removing the uniques based on a hash key.

Pretty awesome day today.  And I can always check if it's in the Ruby interpreter by doing this:

<pre lang="bash">
 wget --no-check-certificate -O - https://github.com/ruby/ruby/raw/trunk/array.c \
| grep -A 4 ARY_SHARED_P |grep -B 4 ary_resize
</pre>

Grep will return this.

<pre lang="C">
if (ARY_SHARED_P(ary) && !ARY_EMBED_P(ary)) {
  rb_ary_unshare(ary);
  FL_SET_EMBED(ary);
}
ary_resize_capa(ary, i);
</pre>

Of course the better way is to run the included ruby tests that Yui Naruse wrote.  :)