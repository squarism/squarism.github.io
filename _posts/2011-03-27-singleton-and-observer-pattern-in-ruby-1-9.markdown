---
layout: post
status: publish
published: true
title: Singleton and Observer Pattern in Ruby 1.9
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<img src=\"/uploads/2011/03/god_pix-150x150.png\"
  alt=\"\" title=\"god_pix\" width=\"150\" height=\"150\" class=\"alignright size-thumbnail
  wp-image-1105\" />\r\n<em>This post isn't specific to Ruby 1.9, I just want
  to differentiate this a little bit from other examples out there.</em>\r\n\r\n<h2>First
  cut of singleton</h2>\r\nA while ago, I wrote a singleton class as a proof of
  concept.  It turns out that this was the hard way.  Since then, I've just used the
  Singleton Mixin instead of writing it by hand.  For this post, I'll talk about both.
  \ First off, what we're going to create is a God class which, other than starting
  a quite dangerous religious debate, will illustrate a singleton object and how to
  work within and outside it.\r\n\r\nThe first example is very contrived.  We'll create
  a God class and define a metaclass with <code>class << self</code> which will
  keep us from creating a God instance with God.new and instead will force use to
  refer to only one God.  So essentially, any properties within that block will be
  constrained to one single instance.  Anything outside it, is a normal instance.\r\n\r\nLike
  I said, this is pretty old code and so it doesn't flow all that well.  First, we
  create the God class as a singleton because we'll just declare that all religions
  are about the same big guy (as an example).  It has instance variables like name,
  religion and soul because God doesn't have one name.  Everyone calls him something
  different.  This is also true for religion.  Soul as an instance variable of God
  actually doesn't make much sense.  But it does allow us to track what \"humans\"
  there are.  In the next example, this will be clearer.\r\n"
wordpress_id: 1098
wordpress_url: http://squarism.com/?p=1098
date: !binary |-
  MjAxMS0wMy0yNyAyMjoyOTo0NSAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wMy0yOCAwMzoyOTo0NSAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
![god_pix](/uploads/2011/03/god_pix-150x150.png)
*This post isn't specific to Ruby 1.9, I just want to differentiate this a little bit from other examples out there.*

### First cut of singleton

A while ago, I wrote a singleton class as a proof of concept.  It turns out that this was the hard way.  Since then, I've just used the Singleton Mixin instead of writing it by hand.  For this post, I'll talk about both.  First off, what we're going to create is a God class which, other than starting a quite dangerous religious debate, will illustrate a singleton object and how to work within and outside it.

The first example is very contrived.  We'll create a God class and define a metaclass with <code>class << self</code> which will keep us from creating a God instance with God.new and instead will force use to refer to only one God.  So essentially, any properties within that block will be constrained to one single instance.  Anything outside it, is a normal instance.

Like I said, this is pretty old code and so it doesn't flow all that well.  First, we create the God class as a singleton because we'll just declare that all religions are about the same big guy (as an example).  It has instance variables like name, religion and soul because God doesn't have one name.  Everyone calls him something different.  This is also true for religion.  Soul as an instance variable of God actually doesn't make much sense.  But it does allow us to track what "humans" there are.  In the next example, this will be clearer.

<!-- more -->

So we create a God (line 5), create some souls in a hash just for brevity and ease of typing (line 44).  Next, on line 50, we collect up all the gods so we can find some instances of it.  We have some put statements on 55 and 56 just showing that .name is not in the singleton.

Now we change state on 59.  God.mood will set the mood for everyone's God.  So essentially Frank ruined it for everyone.  :)  We'll also set God.rapture here although this is contrived design.

Lastly, we print out some more messages to show that God got mad.

{% highlight ruby %}
# this is the hard way, use include Singleton for easier way
require 'pp'

# playing god with singletons
class God

  # people have different names and religions for the same big guy
  attr_accessor :name
  attr_accessor :religion
  attr_accessor :soul

  def initialize(soul, name, religion)
    self.name = name
    self.religion = religion
    self.soul = soul
    God.souls.push soul

    God.rapture = false
    God.mood = "Sanctimonious"
  end

  # but the big guy only has one mood and rapture state
  class << self
    attr_accessor :mood
    attr_accessor :rapture
    attr_accessor :souls
    def rapture?
      @rapture
    end

    def souls
      @souls ||= []
      @souls
    end
  end

end

# printy helper
def god_status
  "God's mood:#{God.mood} and #{God.rapture? ? 'RAPTURE!!' : 'no rapture.'}"
end

souls = [
  { :name => "Sally", :god => "God", :religion => "Christian" },
  { :name => "Frank", :god => "Buddha", :religion => "Buddhist" },
  { :name => "Pat", :god => "Deus", :religion => "Pagan" }
]

gods = souls.collect {|s| God.new(s[:name], s[:god], s[:religion]) }

sally_god = gods.find {|g| g.soul == "Sally"}
frank_god = gods.find {|g| g.soul == "Frank"}

puts "Sally, a #{sally_god.religion}, calls God #{sally_god.name}. #{god_status}"
puts "Frank, a #{frank_god.religion}, calls God #{frank_god.name}. #{god_status}"

puts "*** God gets pissed at Frank. ***"
God.mood = "Pissed"
God.rapture = true

puts "Sally, a #{sally_god.religion}, calls God #{sally_god.name}. #{god_status}"
puts "Frank, a #{frank_god.religion}, calls God #{frank_god.name}. #{god_status}"
puts "Pat, a #{pat_god.religion}, calls God #{pat_god.name}. #{god_status}"
{% endhighlight %}


Running this gives us:
{% highlight text %}
Sally, a Christian, calls God God. God's mood:Sanctimonious and no rapture.
Frank, a Buddhist, calls God Buddha. God's mood:Sanctimonious and no rapture.
*** God gets pissed at Frank. ***
Sally, a Christian, calls God God. God's mood:Pissed and RAPTURE!!
Frank, a Buddhist, calls God Buddha. God's mood:Pissed and RAPTURE!!
Pat, a Pagan, calls God Deus. God's mood:Pissed and RAPTURE!!
{% endhighlight %}

Ok, pretty procedural and contrived.  We can do better.

## Refactor

Before showing this example, I should say that [Head First Design Patterns](http://www.amazon.com/First-Design-Patterns-Elisabeth-Freeman/dp/0596007124) is a great read and one of the very first lessons is *not to use design patterns just to use them*.  That being said, we'll be refactoring our singleton but also introducing a new pattern the Observer.  This will make our code less procedural and will react to events.

First off, we'll create a Universe class which will own the rapture state.  God doesn't really own the rapture, he might invoke it but it's a state of the universe (or earth or whatever).  We'll change our God class to <code>include Singleton</code> instead of writing the `class << self` bit and by doing that, we'll still not be able to call God.new.  Instead, you'll call God.instance to get the single reference of God.  We will move god_status into the God class, to avoid a global method.  We just use god_status for feedback on the console as to what's going on.  Also note that universe is a singleton because there's only one Universe.  :)

Next, we'll move our humans into a class called Soul.  Souls have attributes like our souls array before but now has a method commit_sin().  In commit_sin, we notify our observers, which is always just God, and we also pass the old state as a hash.  Now, this is a bit clunky.  First off, :sinned_was is not that clear.  The idea I had here was if you wanted God to do a switch() on old state or something, you could pass in the old state to the observer.  Normally, only the current state of the object is passed because you're doing a `notify_observers(self)`.  Self will be the current state of that object.  So even though it might be brittle design, I wanted to show that you could pass the old state to an Observer to make a decision or something.  In this case, I'm checking to see if the old sin count was 0 to give someone a second chance.  I could just as easily check to see if the current count is 1 but I'm illustrating options here.  The option to do something more specific could be handy.  The observer pattern only really fires on the entire object.  For example, if we wanted the rapture to start no matter what if someone changes religion, then we could do something like this:

{% highlight ruby %}
# more precise observation/update
# in Soul, send the old state
notify_observers(self, {:religion_was => old_religion})
# in God, see if someone changed religion
if args[:religion_was] != soul.religion
  # if so, start the rapture, God doesn't allow conversions.  :)
end
{% endhighlight %}


A more real-world example would be something that doesn't just react to count but more of a workflow.  Like, if I only lock an account if they have a failed login count of 3 but also have been warned 2 times.  I'd want to be more precise as to what I'm checking for in update().

The other big change is the addition of the <code>include Observable</code> in both the Universe and Soul class.  What this means is that these classes are going to be observed by another class.  When another class changes state, the update() method will be called by the Subject.  Put it another way:

> Universe is Observable by a Soul (a person sees the world around them).
> If the rapture happens, Universe goes nuts and thus notifies its observers (Souls).
> When it notifies, it sends a reference of itself.
> Soul.update is called and people do something (like panic).

So here's the refactored Singleton example with Observers thrown in.

{% highlight ruby %}
# a better way to do the original
require 'pp'
require 'observer'
require 'singleton'

# There is only one Universe
class Universe
  include Singleton
  include Observable

  attr_accessor :rapture

  def initialize
    @rapture = false
  end

  # when the universe changes, people notice  :)
  def rapture=(state)
    @rapture = state
    changed
    notify_observers(self)
  end

end

# There is only one God
class God
  include Singleton

  # people have different names and religions for the same big guy
  attr_accessor :name
  attr_accessor :mood
  attr_reader   :mankinds_transgressions

  def initialize
    @name = "God"
    @mood = "Sanctimonious"
    @mankinds_transgressions = 0
  end

  def mood=(mood)
    @mood = mood
    if mood == "pissed"
      Universe.instance.rapture = true
    end
  end

  # printy helper
  def god_status
    print "God's mood:#{God.mood} and rapture is "
    puts "#{God.rapture? ? 'ON! AAAHHH!' : 'not happening, whew.'}"
  end

  def mankinds_transgressions=(count)
    @mankinds_transgressions += 1
    puts "Mankind sins: #{@mankinds_transgressions}"
    if @mankinds_transgressions >= 3
      self.mood="pissed"
    end
  end

  # create a new person and really just add an observer
  def birth(soul)
    # God observes a person
    soul.add_observer(self)

    # People observe the universe
    Universe.instance.add_observer(soul)
  end

  # a soul changed, probably a person sinning
  def update(soul, args={})
    puts "#{soul.name} sinned."
    if !args.empty?
      if args.has_key? :sinned_was

        # yes, there's an easier way to do this by just looking at the soul.sin
        # but this is for flexibility and example
        if args[:sinned_was] == 0
          puts "God: First time offense for #{soul.name}.  I forgive."
        else
          self.mankinds_transgressions = @mankinds_transgressions + 1
        end
      end
    end

  end

end

class Soul
  include Observable
  attr_reader :name
  attr_reader :god
  attr_reader :religion
  attr_reader :sin

  def initialize(name, god, religion)
    @name = name
    @god = god
    @religion = religion
    @sin = 0
  end

  def commit_sin
    old_sin = @sin
    @sin += 1
    changed
    notify_observers(self, {:sinned_was => old_sin})
  end

  # People watch the universe
  def update(universe)
    print "#{self.name} sees that he universe changed.  "
    puts "And thinks #{self.god} did it.  Rapture: #{universe.rapture}"
  end

end

sally = Soul.new("Sally", "God", "Christianity")
frank = Soul.new("Frank", "Buddha", "Buddhism")
pat = Soul.new("Pat", "Deus", "Paganism")

God.instance.birth sally
God.instance.birth frank
God.instance.birth pat

puts "God's mood is #{God.instance.mood}."

sally.commit_sin

frank.commit_sin
frank.commit_sin
frank.commit_sin

pat.commit_sin
pat.commit_sin
puts "God's mood is #{God.instance.mood}."

{% endhighlight %}

The pay-off with all this code is in the main method.  You'll notice that lines 119 and down (the main) are very easy to read.  All the wiring has already been done and we can just interact with the objects very plainly.  We don't have to fire events, we don't have to care about the internal state.  We can simply commit sins and the universe goes into rapture (in this case, after three non first time sins have been committed).

{% highlight text %}
God's mood is Sanctimonious.
Sally sinned.
God: First time offense for Sally.  I forgive.
Frank sinned.
God: First time offense for Frank.  I forgive.
Frank sinned.
Mankind sins: 1
Frank sinned.
Mankind sins: 2
Pat sinned.
God: First time offense for Pat.  I forgive.
Pat sinned.
Mankind sins: 3
Sally sees that he universe changed.  And thinks God did it.  Rapture: true
Frank sees that he universe changed.  And thinks Buddha did it.  Rapture: true
Pat sees that he universe changed.  And thinks Deus did it.  Rapture: true
God's mood is pissed.
{% endhighlight %}

## Real World

So how would you really use this?  Well, I've used it for a Config class which there should only be one of.  My Config object can read a file once on load and I never have to worry about it hitting the filesystem excessively, if I want that.  You can also use it for a layer between you and a piece of data.  Like a database pool or a web proxy.  If you had a Proxy class, you could throttle the connection speed to a web service and avoid going over an API rate limit.  With a singleton, your Proxy could keep track of all connections, rates and bandwidth totals internally instead of pushing this problem to the database.

Any problem you solve, definitely use the built-in Singleton Mixin.  It's easier to implement and you don't have to maintain it.
