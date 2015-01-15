---
layout: post
status: publish
published: true
title: Hash of Hashes and Captain Planet
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1457
wordpress_url: http://squarism.com/?p=1457
date: !binary |-
  MjAxMS0xMi0wNCAwMDowOTozNiAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMi0wNCAwNTowOTozNiAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 7437
  author: SQUARISM &raquo; Turn a hash of hashes into an array of hashes in Ruby
  author_email: ''
  author_url: http://squarism.com/2013/02/12/turn-a-hash-of-hashes-into-an-array-of-hashes-in-ruby/
  date: !binary |-
    MjAxMy0wMi0xMiAyMzoyNjoyOSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMy0wMi0xMyAwNDoyNjoyOSAtMDUwMA==
  content: ! '[...] I&#8217;ve previously talked about, hashes of hashes are weird
    to work with. If you can avoid having a structure like [...]'
---
![](/uploads/2011/11/Don-Cheadle-Captain-Planet.jpg "Don-Cheadle-Captain-Planet")

Don Cheadle is the best version of Captain Planet there is.  I hope you've already seen [the video](http://www.funnyordie.com/videos/5876f2aced/don-cheadle-is-captain-planet).  If not, go now.  I'll wait.

As it typically happens, I was creating some nested data structure and was reminded of all the different combinations that there are.  For example:

*   An array of arrays.
`[ [1,2,3], [4,5,6] ]`
*   A hash of arrays.
`{ :lucky => [77,42], :unlucky => [666,13] }`
*   An array of hashes.
`[ {:cat=>"meow"}, {:dog=>"ruff"} ]`
*   A hash of hashes.
`{ :best_in_life => {:enemies => "crushed"}, :worst => { :meatloaf => "old"} }`

And I realized that I hadn't really played with a hash of hashes much.  And now I realize why.  It's really pretty useless.  It's hard to work with and the additional key really isn't all that useful.  I found it much better to just denormalize the key into the data attributes.  Anyway, you can see what I mean by reading and running what's below.

We're going to create Captain Planet and the planeteers in a 2D hash of hashes and do some searching, iterating and other simple things.  This should illustrate also how an array of hashes is a bit better.  You'll see halfway through the program we redefine the planeteers.

{% highlight ruby %}
# search a 2d hash

def spacer(msg)
  puts "\n"
  puts "-" * 50
  puts msg
  puts "-" * 50
end

# this is not really a good data structure but we'll use it anyway.
planeteers = {
  :kwame    => { :element => "earth", :from => "Ghana, Africa", :actor => "LeVar Burton" },
  :wheeler  => { :element => "fire", :from => "Brooklyn, NY", :actor => "Joey Dedio" },
  :linka    => { :element => "wind", :from => "Soviet Union", :actor => "Kath Soucie" },
  :gi       => { :element => "water", :from => "Thailand", :actor => "Janice Kawaye" },
  :ma_ti    => { :element => "heart", :from => "Brazil", :actor => "Scott Menville" }
}

spacer "Here are our planeteers and their elements:"
puts planeteers.keys.collect {|p| {p => planeteers[p][:element]} }

puts "\nFind the fire planeteer:\n"
fire = planeteers.keys.collect {|p| {p => planeteers[p][:element]=="fire"} }
# => [{:kwame=>false}, {:wheeler=>true}, {:linka=>false}, {:gi=>false}, {:ma_ti=>false}]

only_fire = fire.select{|h| h.values[0] == true}
# => {:wheeler=>true}

# print just one
puts only_fire.first.keys.first

spacer "Let's do this a bit cleaner with a better data structure."
planeteers = [
  { :name => "kwame", :element => "earth", :from => "Ghana, Africa", :actor => "LeVar Burton" },
  { :name => "wheeler", :element => "fire", :from => "Brooklyn, NY", :actor => "Joey Dedio" },
  { :name => "linka", :element => "wind", :from => "Soviet Union", :actor => "Kath Soucie" },
  { :name => "gi", :element => "water", :from => "Thailand", :actor => "Janice Kawaye" },
  { :name => "ma_ti", :element => "heart", :from => "Brazil", :actor => "Scott Menville" }
]

planeteers.max_by {|p| p[:name]}
# => {:name=>"ma_ti", :element=>"heart", :from=>"Brazil", :actor=>"Scott Menville"}

planeteers.max_by {|p| p[:element]}
# => {:name=>"linka", :element=>"wind", :from=>"Soviet Union", :actor=>"Kath Soucie"}

puts "Find the heart planeteer:"
puts planeteers.select {|p| p[:element] == "heart" }.first[:name]

# first we'll put a fake planeteer on the end for cpt planet
planeteers << { :name => "all", :element => "go planet" }

spacer "Let's summon Captain Planet!"
planeteers.each do |planeteer|
  puts "#{planeteer[:name].capitalize}: #{planeteer[:element].capitalize}!"
end

# pop off fake guy
planeteers.pop
{% endhighlight %}

Here's what it spits out:
<pre>
--------------------------------------------------
Here are our planeteers and their elements:
--------------------------------------------------
{:kwame=>"earth"}
{:wheeler=>"fire"}
{:linka=>"wind"}
{:gi=>"water"}
{:ma_ti=>"heart"}

Find the fire planeteer:
wheeler

--------------------------------------------------
Let's do this a bit cleaner with a better data structure.
--------------------------------------------------
Find the heart planeteer:
ma_ti

--------------------------------------------------
Let's summon Captain Planet!
--------------------------------------------------
Kwame: Earth!
Wheeler: Fire!
Linka: Wind!
Gi: Water!
Ma_ti: Heart!
All: Go planet!
</pre>