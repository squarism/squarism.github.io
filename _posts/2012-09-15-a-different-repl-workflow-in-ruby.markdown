---
layout: post
status: publish
published: true
title: A Different REPL Workflow in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1671
wordpress_url: http://squarism.com/?p=1671
date: !binary |-
  MjAxMi0wOS0xNSAyMDo0Mjo0NSAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0xNiAwMTo0Mjo0NSAtMDQwMA==
categories:
- Ruby
tags: []
comments:
- id: 7243
  author: SQUARISM &raquo; Splitting a sentence in Ruby and keeping the punctuation
  author_email: ''
  author_url: http://squarism.com/2012/09/21/splitting-a-sentence-in-ruby-and-keeping-the-punctuation/
  date: !binary |-
    MjAxMi0wOS0yMSAyMTo1Mjo0NyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wOS0yMiAwMjo1Mjo0NyAtMDQwMA==
  content: ! '[...] whatever. That&#8217;s regex stuff. Let&#8217;s try applying what
    we&#8217;ve learned from our last post and create an inline rspec test to do what
    we [...]'
- id: 7248
  author: SQUARISM &raquo; Making Rails Development on Windows Not Suck
  author_email: ''
  author_url: http://squarism.com/2012/09/22/rails-development-on-windows-not-suck/
  date: !binary |-
    MjAxMi0wOS0yMiAxODowODo0OCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wOS0yMiAyMzowODo0OCAtMDQwMA==
  content: ! '[...] could also try my inline rspec trick even though that still uses
    libevent for triggering the test [...]'
---
Normally what I do is open an editor and start coding.  In Textmate, I'll hit Cmd+R to just run it as a big procedural file for something simple.  If it gets too complicated, I'll put it in a class.  If something is confusing, I'll break out to irb.  The problem with this workflow is that you have to copy and paste a lot of code back and forth to get to "the breakpoint".

In rails, I'd just put a binding.pry and magically, I'm at the breakpoint to play around at that point in time.  No copying and pasting.  Nice.

After watching a bunch of destroyallsoftware screencasts though, I like his one setup from episode #7 where he inlines rspec tests.  Combine this with watchr and I might have a new favorite.

Let's say I had the following hello world example.

{% highlight ruby %}
class Hello
  attr_reader :message

  def initialize
    @message = "Hello Variable!"
  end

  def say_hello
    puts @message
  end

end
{% endhighlight %}

When I run it in Textmate with Cmd+R, it doesn't do anything.  Because there's no "main".  So then I have to add:

{% highlight ruby %}
Hello.new.say_hello
{% endhighlight %}

Great!  But wait a minute, when I use it in another class, it's going to print "Hello Variable!" out.  So then I take it out?  Then to test it again, I put it back in?  This workflow although easy kind of sucks.

So let's just inline some rspec.  But before we even do that, we need rspec and watchr.  We are going to use watchr to watch our files for changes.  It's best to install rev (Linux) or ruby-fsevent (Mac) for filesystem event firing.

`gem install watchr rspec ruby-fsevent`

Next, run this in a terminal and put it so where you can see it run while in your editor:
`watchr -e 'watch("hello.*\.rb") {|m| system("clear && rspec -c #{m};") }'`

Like this:
![](/uploads/2012/09/rspec_repl-580x308.png "rspec_repl")

When you save the file (even without changes), it should say:
`No examples found.

Finished in 0.00007 seconds
0 examples, 0 failures`

Ok, now let's inline some rspec tests to test our class.

{% highlight ruby %}
class Hello
  attr_reader :message

  def initialize
    @message = "Hello Variable!"
  end

  def say_hello
    puts @message
  end

end

describe Hello do
  it "has a say_hello method" do
    subject.respond_to?(:say_hello)
  end
end
{% endhighlight %}

Now we will get this nice rspec to the right <font color="green">**in color**</font> immediately upon saving:![](/uploads/2012/09/rspec_pry_pass-580x308.png "rspec_pry_pass")

So how about irb?  What if we want to learn/play in the code?  Well now that we have a class and a shell instead of Textmate, we can use pry again.

{% highlight ruby %}

require 'pry'

class Hello
  attr_reader :message

  def initialize
    @message = "Hello Variable!"
  end

  def say_hello
    puts @message
  end

end

describe Hello do
  it "has a say_hello method" do
    binding.pry
    subject.respond_to?(:say_hello)
  end
end
{% endhighlight %}

And now when we save, we'll be popped into a Pry shell.
![](/uploads/2012/09/pry_rspec.png "pry_rspec")

So give this a shot and see if you like this as an alt workflow.