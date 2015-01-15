---
layout: post
status: publish
published: true
title: Setting Defaults in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1504
wordpress_url: http://squarism.com/?p=1504
date: !binary |-
  MjAxMi0wMi0yMSAyMzo1MjoyOCAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMi0yMiAwNDo1MjoyOCAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2012/02/ruby_defaults.png "ruby_defaults")
Let's start out with a plain old method.

{% highlight ruby %}
def hello
  puts "Hi!"
end
{% endhighlight %}

Now let's un-hardcode that string in the puts by adding a parameter.

{% highlight ruby %}
def hello(greeting="Hi!")
  puts greeting
end</p>

>> hello
Hi!
>> hello("Hola!")
Hola!
{% endhighlight %}

<p>Great.  We have a default String.  But what about something more complex.  What if we want a hash of options.  Say we have a little piece of an IRC client.

{% highlight ruby %}
def connect(options={})
  defaults = {
    :server => "irc.freenode.net"
  }
  options = defaults.merge(options)
  puts "Connecting to #{options[:server]} ..."
end
{% endhighlight %}

Now when we use it like this, we can connect to a default server or override it.

`
>> connect
Connecting to irc.freenode.net ...</p>

>> connect({:server => "irc.efnet.net"})
Connecting to irc.efnet.net ...
`

Now a more complicated example.  All we're doing here is loading defaults from a YAML file and doing the same thing as before.

{% highlight ruby %}
require 'yaml'</p>

class Preferences
  def initialize
    if !File.exists?("preferences.yml")
      # example file
      options = {:server => "irc.efnet.net"}
      self.save!(options)
    end
    @values = YAML::load(File.open("preferences.yml"))
  end

  def to_hash
    @values
  end

  def save!(options)
    preferences = File.open("preferences.yml", "w") do |f|
      f.write(options.to_yaml)
    end
  end
end

def connect(options={})
  defaults = {
    :server => "irc.freenode.net",
    :username => "CHANGE-USER-NAME, see README.txt",
    :channel => "#chat"
  }
  options = defaults.merge(options)
  puts "Connecting to #{options[:server]} as #{options[:username]}..."
end

# Main
prefs = Preferences.new

options = {:channel => "#meow"}
connect(prefs.to_hash)

options[:username] = "Bob"
options[:server] = "irc.efnet.net"
prefs.save!(options)
{% endhighlight %}

<p>Go ahead and give it a try and play with it.  It's a good recipe with many uses.