---
layout: post
status: publish
published: true
title: Messing with Method Missing
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1377
wordpress_url: http://squarism.com/?p=1377
date: !binary |-
  MjAxMS0xMS0xMiAxMTo0NjowMCAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMS0xMiAxNjo0NjowMCAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2011/11/method_missing-150x150.png "method_missing")
We're going to play with method_missing and less so, monkey patching.  All of this code is designed to work in one source file or irb session.  It will run procedurally from beginning to end.  So you can copy it in pieces into a single .rb file or follow along in irb.  No need to break it out into separate files or restart irb.

We'll start with a simple person class that is initialized with a name and an age.

{% highlight ruby %}
class Person
  attr_accessor :name, :age, :problems

  def initialize(name, age)
    @name = name
    @age = age
  end
end
{% endhighlight %}

Creating a person is as simple as passing "James" and 99 as arguments.

{% highlight ruby %}
puts Person.new("James", 99).inspect
# => #<Person:0x007f9e2a136878 @name="James", @age=99>
{% endhighlight %}

Now I have a Person object as expected.  The twist comes in when you look at this line by itself and realize that you can't get what 99 is.  Is it the age?  Is it the problems?  Of course, you might opt to simply get rid of the constructor and set the instance variables manually.  But let's try to do something more fancy.

First, we'll try to invoke a method that doesn't exist.

{% highlight ruby %}
begin
  Person.create_with_name_and_problems("James", 99)
  # => undefined method `create_with_name_and_problems'
  #    for Person:Class (NoMethodError)
rescue NoMethodError
  # just continue
end
{% endhighlight %}

We will get an exception here.  For the sake of our single source file, we'll catch the exception and continue.

So when we try to call #create_with_name_and_problems so that 99 is clearly a problem and not an age argument, the method doesn't exist.  We could create that method but that's not very scalable, we'd have to create every permutation of possible construction options.

Instead what we are going to do is use method_missing to handle calls to unknown methods and at the same time set the instance variables and return an object.

{% highlight ruby %}
class Person
  def initialize
  end

  def self.method_missing(meth, *args, &block)
    puts "OH NO!  No method!"
    if meth.to_s =~ /^create_with_(.+)$/
      self.run_create_with_method($1, *args, &block)
    else
      super
    end
  end

  def respond_to?(meth, *args, &block)
    if self.meth.to_s =~ /^create_with_.*$/
      true
    else
      super
    end
  end

  def self.run_create_with_method(attrs, *args, &block)
    attrs = attrs.split('_and_')
    # #transpose will zip the two arrays together like so:
    #   [[:a, :b, :c], [1, 2, 3]].transpose
    #   # => [[:a, 1], [:b, 2], [:c, 3]]
    attrs_with_args = [attrs, args].transpose
    attributes = Hash[attrs_with_args]
    p = Person.new
    attributes.keys.each do |a|
      p.instance_variable_set "@#{a}", attributes[a]
    end
    return p
  end

end
{% endhighlight %}

First we reopen the Person class (monkey patch) and redefine a parameter-less initialize method.  Next we create a method_missing method on the class object that looks for any method that starts with "create_with_".  If it does then it creates a new object with the correct instance variables set.  Finally, the respond_to? method ensures that our Person class is advertising that #create_with_ methods are valid to outside calls.

Ok, so now our Person object is ready to be used.  We can create James again this time with a name and a number of problems.  We can even create a person with all three attributes and vary the order.

{% highlight ruby %}
puts Person.create_with_name_and_problems("James",99).inspect
# <Person:0x007ffc8a835250 @name="James", @problems=99>

puts Person.create_with_age_and_problems_and_name(55, 99, "Jay-Z").inspect
# <Person:0x007ffc8b0ae990 @name="Jay-Z", @age=55, @problems=99>
{% endhighlight %}

So in actuality, this is a bit contrived.  It's cool to have these dynamic methods created for us but doing this way is a little too much work just to get parameterized constructors.  The better way would be to use a hash for initialization.  See below:

{% highlight ruby %}
class Person
  attr_reader :name, :age, :problems

  def initialize args
    args.each do |k,v|
      instance_variable_set("@#{k}", v) unless v.nil?
    end
  end
end

p = Person.new(:name => "James", :age => 99, :problems => 99)
# <Person:0x007fda421044f0 @name="James", @age=99, @problems=99>

puts p.name       # James
puts p.age        # 99
puts p.problems   # 99
{% endhighlight %}