---
title: "A Different REPL Workflow in Ruby"
description: "Normally what I do is open an editor and start coding. In Textmate, I'll hit Cmd+R to just run it as a big procedural file for something simple. If..."
date: 2012-09-15T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Normally what I do is open an editor and start coding.  In Textmate, I'll hit Cmd+R to just run it as a big procedural file for something simple.  If it gets too complicated, I'll put it in a class.  If something is confusing, I'll break out to irb.  The problem with this workflow is that you have to copy and paste a lot of code back and forth to get to "the breakpoint".

In rails, I'd just put a binding.pry and magically, I'm at the breakpoint to play around at that point in time.  No copying and pasting.  Nice.

After watching a bunch of destroyallsoftware screencasts though, I like his one setup from episode #7 where he inlines rspec tests.  Combine this with watchr and I might have a new favorite.

Let's say I had the following hello world example.

```ruby
class Hello
  attr_reader :message

  def initialize
    @message = "Hello Variable!"
  end

  def say_hello
    puts @message
  end

end
```

When I run it in Textmate with Cmd+R, it doesn't do anything.  Because there's no "main".  So then I have to add:

```ruby
Hello.new.say_hello
```

Great!  But wait a minute, when I use it in another class, it's going to print "Hello Variable!" out.  So then I take it out?  Then to test it again, I put it back in?  This workflow although easy kind of sucks.

So let's just inline some rspec.  But before we even do that, we need rspec and watchr.  We are going to use watchr to watch our files for changes.  It's best to install rev (Linux) or ruby-fsevent (Mac) for filesystem event firing.

`gem install watchr rspec ruby-fsevent`

Next, run this in a terminal and put it so where you can see it run while in your editor:
`watchr -e 'watch("hello.*\.rb") {|m| system("clear && rspec -c #{m};") }'`

Like this:
![](/uploads/2012/09/rspec_repl.png "rspec_repl")

When you save the file (even without changes), it should say:
```text
No examples found.

Finished in 0.00007 seconds
0 examples, 0 failures
```

Ok, now let's inline some rspec tests to test our class.

```ruby
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
```

Now we will get this nice rspec to the right **in color** immediately upon saving:![](/uploads/2012/09/rspec_pry_pass.png "rspec_pry_pass")

So how about irb?  What if we want to learn/play in the code?  Well now that we have a class and a shell instead of Textmate, we can use pry again.

```ruby

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
```

And now when we save, we'll be popped into a Pry shell.
![](/uploads/2012/09/pry_rspec.png "pry_rspec")

So give this a shot and see if you like this as an alt workflow.
