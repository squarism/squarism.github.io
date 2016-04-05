---
layout: post
status: publish
published: true
title: Ruby Slop Example
---
** This is all about Slop 3 (ruby 1.9 era).  Slop 4 has changed the API.  See the [README](https://github.com/leejarvis/slop/blob/master/README.md) **

One of my favorite features of slop is the automatic help generation.
But it's not intuitive.  It doesn't print out the help when the parsing
fails.  This isn't very unix-y.  So every time I want to use slop, I have to look up this snippet I saved for myself.  So I'm posting it here.  This is the only slop example
you'll ever need.

#### Unix style CLI program in Ruby

{% highlight ruby %}
require 'slop'

opts = Slop.new(strict: true, help: true) do
  banner 'Usage: slop_test.rb [options]'

  on 'resume=', 'Your resume file', required: true
  on :s, :skill=, 'Skill Name', as: Array, arguments: :optional
  on 'v', 'verbose', 'Enable verbose mode'  # same as adding required: false
end

begin
  opts.parse

  # validation passed
  puts "Here's the data"
  puts opts.to_hash
rescue Slop::Error => e
  puts e.message
  puts opts
end
{% endhighlight %}

Calling it like this will fail:
{% highlight text %}
$ ruby ./slop_test.rb
Missing required option(s): resume
Usage: slop_test.rb [options]
        --resume       Your resume file
    -s, --skill        Skill Name
    -v, --verbose      Enable verbose mode
    -h, --help         Display this help message.
{% endhighlight %}

Great!  Then using it correctly will do this:

{% highlight text %}
$ ruby slop_test.rb --resume hechicero-del-relámpago.doc
Here's the data
{:resume=>"hechicero-del-relámpago.doc", :skill=>nil, :verbose=>nil, :help=>nil}
{% endhighlight %}

The resume flag is the only required one, so in this case that's how
it's run correctly.

*Update:* I was very happy that @lee_jarvis (the slop author) [accepted my pull request](https://github.com/leejarvis/slop/commit/380672e6e96e58a34905b9a2c07c8a35b41d7ae9) to put
this example into the README.

