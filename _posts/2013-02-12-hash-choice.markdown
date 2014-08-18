---
layout: post
status: publish
published: true
title: Hash Choices
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1799
wordpress_url: http://squarism.com/?p=1799
date: !binary |-
  MjAxMy0wMi0xMiAyMzoyNjoyNyAtMDUwMA==
date_gmt: !binary |-
  MjAxMy0wMi0xMyAwNDoyNjoyNyAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
<p><img src="/uploads/2013/02/bttf.png" alt="bttf" width="188" height="91" class="alignright size-full wp-image-1803" /></p>
<p>As I've <a href="http://squarism.com/2011/12/04/hash-of-hashes-and-captain-planet/">previously talked about</a>, <em>Hashes of Hashes</em> are weird to work with.  In the previous post about Captain Planet, I showed how to select, filter and manipulate 2D hashes and arrays but ultimately concluded that a hash of hashes is both weird and unnecessary (most of the time).</p>
<p>If you can control the data, inline your key into the hash data and make an <em>Array of Hashes</em>.  It's really where it belongs.  If you don't, you'll find yourself doing a few extra iterations or work.  Below you'll see a simple example of the two data structures.</p>
{% highlight ruby %}
# Hash of Hashes
{
  :dave => { :age => 1, :height => 2 },
  :tony => { :age => 1, :height => 2 }
}
{% endhighlight %}


{% highlight ruby %}
# Better --> Array of Hashes
[
  { :id => 'dave', :age => 1, :height => 2 },
  { :id => 'tony', :age => 1, :height => 2 }
]
{% endhighlight %}


<p>In this case of an array of hashes, the data is easier to manipulate with array operations and filters.  But before talking about matching on arrays of hashes, I want to talk about matching on dates.</p>

{% highlight ruby %}
doc = Date.parse "Nov 12 1955"
marty = Date.parse "Oct 27 1985"
future = Date.parse "Jan 13 2094"
doc < marty
=> true
{% endhighlight %}


<p>So comparisons with dates work like you might expect.  But fuzzy matches do not.  Take this example.  Is Marty in between Doc Brown and the distant future?  The answer should be true.</p>
<p>We use a Range (x..y) object to make a date range.  Then we can use === to check if we get a match.</p>

{% highlight ruby %}
marty === (doc .. future)  # wrong, wrong, wrong
=> nil
{% endhighlight %}


<p>But wait, === on Date is different than === on Range.  The method === on Date checks to see if it's the same Date whereas === on Range checks to see if the argument is within the range.  So if you flip it, it returns true.</p>

{% highlight ruby %}
(doc .. future) === marty
=> true
{% endhighlight %}


{% highlight ruby %}
require 'date'

holidays = {
  :halloween => { :date => Date.parse("Oct 31 2012"), :presents => false },
  :christmas => { :date => Date.parse("Dec 25 2012"), :presents => true },
  :july_fourth => { :date => Date.parse("July 4 2013"), :presents => false },
  :valentines_day => { :date => Date.parse("Feb 14 2013"), :presents => true },
  :thanksgiving => { :date => Date.parse("Nov 28 2012"), :presents => false }
}

# turn hash of hashes into array of hashes
holiday_array = []
holidays.keys.each do |key|
  holiday_array << { :id => key }.merge(holidays[key])
end

# find all the holidays with presents
puts "yay presents!"
puts holiday_array.select {|holiday| holiday[:presents] == true }

# find all the holidays within a date range
winter = (Date.parse("Dec 21 2012")..Date.parse("Mar 20 2013"))

puts "Winter holidays"
puts holiday_array.select {|h| winter === h[:date] }
{% endhighlight %}


<p>So what we did in the middle there was flatten the hash of hashes into an array of hashes by merging the key with the 'data' part of the hash.  Hopefully that makes sense.</p>
