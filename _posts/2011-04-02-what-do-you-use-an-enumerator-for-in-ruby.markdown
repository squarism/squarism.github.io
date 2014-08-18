---
layout: post
status: publish
published: true
title: What do you use an Enumerator for in Ruby?
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<img src=\"/uploads/2011/04/ruby_enum.png\"
  alt=\"\" title=\"ruby_enum\" width=\"150\" height=\"139\" class=\"alignright size-full
  wp-image-1175\" />\r\n\r\nSometimes when I'm fumbling around in irb on an API
  I don't know, or with Active Record queries, I get an Enumerator object back when
  I don't want to.  So if I save this Enumerator as a variable, what the heck do I
  do with it?  And why do I get an Enumerator anyway?\r\n\r\nSo what we'll do is play
  around with a hash of elements.  Elements have a name, color and what happens when
  you touch them attributes.  We'll iterate through them and print out the values
  as normal but we'll also store the Enumerator by itself and iterate through it later.\r\n\r\n<pre
  lang=\"ruby\">\r\n# enumerator test\r\n# ie: why the ---- do i get an enumerable
  back when I'm cluelessly hacking?\r\n\r\nelements = [\r\n  { :name => \"earth\",
  \  :color => \"brown\",  :touch => \"I'm dirty.\" },\r\n  { :name => \"wind\",    :color
  => \"white\",  :touch => \"I'm flying.\" },\r\n  { :name => \"fire\",    :color
  => \"red\",    :touch => \"I'm on fire!\" },\r\n  { :name => \"water\",   :color
  => \"blue\",   :touch => \"I'm wet.\" },\r\n  { :name => \"ice\",     :color =>
  \"blue\",   :touch => \"Brr!\"}\r\n]\r\n\r\n# Here is the wtf moment.  What are
  we supposed to do with an Enumerator?!\r\nputs \"What do you use a Ruby enumerator
  for?\"\r\nputs elements.find\r\n\r\n# Fix it you dummy, you didn't pass in a block.\r\nputs
  \"\\nYou don't get an enumerator if you pass a block in:\"\r\nputs elements.find{|e|
  e[:name] == \"wind\"}\r\n\r\n# ok so ruby devs aren't dumb, wtf is enumerable\r\nenum
  = elements.each\r\n\r\ncolor_enum = enum.collect { |e| e[:touch] }\r\nputs \"\\nDelayed
  enum search: \"\r\nputs color_enum.collect { |c| c }.join(\", \")\r\n\r\nputs \"\\nStandard
  collect with no enumerator: \"\r\nputs elements.collect{|e| e[:color]}.join(\",\")\r\n#
  => [\"brown\", \"white\", \"red\", \"blue\", \"blue\"]\r\n\r\nmap = elements.collect
  {|e| {e[:name].to_sym => e[:color]} }\r\n# [{:earth=>\"brown\"}, {:wind=>\"white\"},
  {:fire=>\"red\"}, {:water=>\"blue\"}, {:ice=>\"blue\"}]\r\n# No!  This is an array
  of hashes.  Not what we want.\r\n\r\nh = {}\r\nelements.each {|e| k=e[:name]; v=e[:color];
  h[k]=v}\r\n# {\"earth\"=>\"brown\", \"wind\"=>\"white\", \"fire\"=>\"red\", \"water\"=>\"blue\",
  \"ice\"=>\"blue\"}\r\n# YES!  One hash, one deep.  Perfect.\r\n\r\nputs \"\\nNice
  hash associating element to color: \"\r\nputs h\r\n</pre>\r\n\r\n"
wordpress_id: 1161
wordpress_url: http://squarism.com/?p=1161
date: !binary |-
  MjAxMS0wNC0wMiAxMTo1NTo0MCAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wNC0wMiAxNjo1NTo0MCAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
<p><img src="/uploads/2011/04/ruby_enum.png" alt="" title="ruby_enum" width="150" height="139" class="alignright size-full wp-image-1175" /></p>
<p>Sometimes when I'm fumbling around in irb on an API I don't know, or with Active Record queries, I get an Enumerator object back when I don't want to.  So if I save this Enumerator as a variable, what the heck do I do with it?  And why do I get an Enumerator anyway?</p>
<p>So what we'll do is play around with a hash of elements.  Elements have a name, color and what happens when you touch them attributes.  We'll iterate through them and print out the values as normal but we'll also store the Enumerator by itself and iterate through it later.</p>

{% highlight ruby %}
# enumerator test
# ie: why the ---- do i get an enumerable back when I'm cluelessly hacking?

elements = [
  { :name => "earth",   :color => "brown",  :touch => "I'm dirty." },
  { :name => "wind",    :color => "white",  :touch => "I'm flying." },
  { :name => "fire",    :color => "red",    :touch => "I'm on fire!" },
  { :name => "water",   :color => "blue",   :touch => "I'm wet." },
  { :name => "ice",     :color => "blue",   :touch => "Brr!"}
]

# Here is the wtf moment.  What are we supposed to do with an Enumerator?!
puts "What do you use a Ruby enumerator for?"
puts elements.find

# Fix it you dummy, you didn't pass in a block.
puts "\nYou don't get an enumerator if you pass a block in:"
puts elements.find{|e| e[:name] == "wind"}

# ok so ruby devs aren't dumb, wtf is enumerable
enum = elements.each

color_enum = enum.collect { |e| e[:touch] }
puts "\nDelayed enum search: "
puts color_enum.collect { |c| c }.join(", ")

puts "\nStandard collect with no enumerator: "
puts elements.collect{|e| e[:color]}.join(",")
# => ["brown", "white", "red", "blue", "blue"]

map = elements.collect {|e| {e[:name].to_sym => e[:color]} }
# [{:earth=>"brown"}, {:wind=>"white"}, {:fire=>"red"}, {:water=>"blue"}, {:ice=>"blue"}]
# No!  This is an array of hashes.  Not what we want.

h = {}
elements.each {|e| k=e[:name]; v=e[:color]; h[k]=v}
# {"earth"=>"brown", "wind"=>"white", "fire"=>"red", "water"=>"blue", "ice"=>"blue"}
# YES!  One hash, one deep.  Perfect.

puts "\nNice hash associating element to color: "
puts h
{% endhighlight %}

<p><a id="more"></a><a id="more-1161"></a>
Run this and you get:</p>
<pre>What do you use a Ruby enumerator for?
#<Enumerator:0x00000100859c28></p>
<p>You don't get an enumerator if you pass a block in:
{:name=>"wind", :color=>"white", :touch=>"I'm flying."}</p>
<p>Delayed enum search:
I'm dirty., I'm flying., I'm on fire!, I'm wet., Brr!</p>
<p>Standard collect with no enumerator:
brown,white,red,blue,blue</p>
<p>Nice hash associating element to color:
{"earth"=>"brown", "wind"=>"white", "fire"=>"red", "water"=>"blue", "ice"=>"blue"}
</pre></p>
<p>Very simple example but for me, this was confusing and helped me to understand that many things can return an Enumerator and many methods can work with an Enumerator.  But what we're doing here is just really seeing that the find method returns an Enumerator.  What if we want to do something more original?</p>
<p>Let's create a class that mixes-in the Enumerable module.</p>

{% highlight ruby %}
class StagesOfLife
  include Enumerable

  attr_accessor :stages

  def initialize
    @stages = {
      :nothing => 0,
      :teenager => 5,
      :egg => 1,
      :dead => 7,
      :adult => 6,
      :baby => 2,
      :toddler => 3,
      :kid => 4
    }
  end

  def each
    @sorted_stages = @stages.sort{|a,b| a[1]<=>b[1]}
    @sorted_stages.each do |s|
      yield s[0]
    end
  end

  def max
    @stages.sort{|a,b| a[1]<=>b[1]}.last[0]
  end

  def min
    @stages.sort{|a,b| a[1]<=>b[1]}.first[0]
  end

end

stages_of_life = StagesOfLife.new
puts stages_of_life.max
# => dead

puts stages_of_life.min
# => nothing

puts "\nEach block"
stages_of_life.each do |s|
  puts "Stage: #{s}"
end
# Each block
# Stage: nothing
# Stage: egg
# Stage: baby
# Stage: toddler
# Stage: kid
# Stage: teenager
# Stage: adult
# Stage: dead

print "\nAs array: "
puts stages_of_life.collect {|s| s}.join(", ")
# => As array: nothing, egg, baby, toddler, kid, teenager, adult, dead
{% endhighlight %}

<p>I've included the output in the comments above.  We define our stages of life and include a value 0-7 for each stage.  I used a value in the @stages hash as the sort key so we could implement a custom sort for the #max and #min methods.  Also notice that we have to sort our hash by value in #each because otherwise our hash would have to be defined in order (ie: nothing, egg, baby ...).</p>
<p>So there you go, a very basic tour of Enumerable in Ruby.  If this is interesting also look at how to mixin and implement your own Comparable.</p>
