---
title: "Setting Defaults in Ruby"
description: "Blog post about setting defaults in ruby"
date: 2012-02-21T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2012/02/ruby_defaults.png "ruby_defaults")
Let's start out with a plain old method.

```ruby
def hello
  puts "Hi!"
end
```

Now let's un-hardcode that string in the puts by adding a parameter.

```ruby
def hello(greeting="Hi!")
  puts greeting
end
>> hello
Hi!
>> hello("Hola!")
Hola!
```

Great.  We have a default String.  But what about something more complex.  What if we want a hash of options.  Say we have a little piece of an IRC client.

```ruby
def connect(options={})
  defaults = {
    :server => "irc.freenode.net"
  }
  options = defaults.merge(options)
  puts "Connecting to #{options[:server]} ..."
end
```

Now when we use it like this, we can connect to a default server or override it.

```ruby
>> connect
Connecting to irc.freenode.net ...
>> connect({:server => "irc.efnet.net"})
Connecting to irc.efnet.net ...
```

Now a more complicated example.  All we're doing here is loading defaults from a YAML file and doing the same thing as before.

```ruby
require 'yaml'
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
```

Go ahead and give it a try and play with it.  It's a good recipe with many uses.
