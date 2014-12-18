---
layout: post
status: published
published: true
title: Nil, If and Collect in Ruby
date: 2014-12-18
---

Ruby's if statement returns the return value when matched.  If it falls through, it returns nil.
I sometimes forget this.  It's not a big deal until it bites you.

Here's an overly simple example where this works very well.
{% highlight ruby %}
numbers = [1,2,3,4,5].collect do |number|
  if number % 2 == 0
    "#{number}: even"
  else
    "#{number}: odd"
  end
end

numbers
# => ["1: odd", "2: even", "3: odd", "4: even", "5: odd"]
{% endhighlight %}

This is really handy because we don't have to create like
a temporary variable somewhere and use each.  But this is
also a really clean case because there's **only odd and even**.
In other words, our if statement never falls through to return
nil.  Nil is a pain in Ruby.  Avdi's book [Confident Ruby](http://www.confidentruby.com/)
is not just about nil but it talks about nil.  Avdi's [screencasts about nil](http://www.rubytapas.com/episodes/108-The-Trouble-with-nil) are a good place to learn more (and I often refer back to Avdi's work).

Ok, back to our collect.  When possible, I try to use collect to avoid mutation.
Maybe it's my concession to functional programming languages.
Maybe it's because state mutation in Ruby causes headaches.
I think the most important reason for exploring this is so we
know of one other way to skin a cat.  So let's look at a more real example.

{% highlight ruby %}
users = [
  { name: "Jay", enabled: false },
  { name: "Joan", enabled: false },
  { name: "John", enabled: true }
]

# enable everyone!
users.each do |user|
  user[:enabled] = true if user[:enabled] == false
end

# users
# {:name=>"Jay", :enabled=>true}
# {:name=>"Joan", :enabled=>true}
# {:name=>"John", :enabled=>true}
{% endhighlight %}

Meh.  Mutation.  It's good to know just one more way
for us to do this.  Return a new collection.

{% highlight ruby %}
users = [
  { name: "Jay", enabled: false },
  { name: "Joan", enabled: false },
  { name: "John", enabled: true }
]

# enable everyone!
enabled = users.collect do |user|
  user.merge({enabled:true}) if user[:enabled] == false
end

# enabled
# {:name=>"Jay", :enabled=>true}
# {:name=>"Joan", :enabled=>true}
{% endhighlight %}

Whoops.  Where did John go?  Here's that thing I was talking about.
Our collect needs to handle the fallthrough from the if.


{% highlight ruby %}
users = [
  { name: "Jay", enabled: false },
  { name: "Joan", enabled: false },
  { name: "John", enabled: true }
]

# enable everyone!
enabled = users.collect do |user|
  if user[:enabled] == false
    user.merge({enabled:true})
  else
    user
  end
end

# enabled
# {:name=>"Jay", :enabled=>true}
# {:name=>"Joan", :enabled=>true}
# {:name=>"John", :enabled=>true}#

# users
# {:name=>"Jay", :enabled=>false}
# {:name=>"Joan", :enabled=>false}
# {:name=>"John", :enabled=>true}#
{% endhighlight %}

Great!  You can see we didn't mutate state.  Now the problem
with doing this all the time in Ruby is tail call optimzation.
If you go to the ends of the earth with this your stack will
explode.  But I still like this style when I can do it
because I avoid changing state.

The end-game to this line of thinking is switching to or at least
playing with a function language like Clojure, Rust or Scala.