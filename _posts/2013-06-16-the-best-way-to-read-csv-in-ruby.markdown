---
layout: post
status: publish
published: true
title: The Best Way to Read CSV in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 2013
wordpress_url: http://squarism.com/?p=2013
date: !binary |-
  MjAxMy0wNi0xNiAxMzo0MDo0NCAtMDQwMA==
date_gmt: !binary |-
  MjAxMy0wNi0xNiAxODo0MDo0NCAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
<p>CSV is awful.  CSV isn't well formed.  It isn't hard to use because it's bloated and slow.  CSV is hard to use because it's just a dumb data format.  However, sometimes all you have is stupid data and <em>who cares, let's do this thing and blot out the memories</em>.</p>
<p>I assume you know how to use the CSV module that's built into Ruby.  It's pretty easy.  You just read a file in and you get some 2D array back.  It usually comes out pretty horrible with long methods and little room for nice abstractions.</p>
<p>So what if you want to polish it up a little bit?  Maybe you aren't just going to kludge this thing again and hate yourself later?  What if you aren't just going to load this into a database?  What if you want to do some quick CSV analysis but at the same time make it come out sort of readable?</p>
<p>Let's take a look at an abstraction layer and see how we could write a CSV loader for a guest list.  We're going to have a dinner party and evite gave us a crappy CSV dump of who's responded so far.  Well, it's what we have.  But how many people are coming and how many groups aren't allergic to peanuts?  We want to know how many peanut M&Ms to buy.</p>

<p>Here's our data:</p>
<pre>
Name, Plus, RSVP'd, Peanut Allergies
Tom DeLuise, 1, No, Yes
Mel Brooks, 3, Yes, Yes
Lewis Black, 5, Yes, No
Jon Stewart, 3, Yes, Yes
Jim Gaffigan, 0, Yes, No
</pre>

<!-- more -->

<p>Supermodel is pretty old and I like it a lot but it hasn't been updated in a while and has some open pull requests.  I took at look at some alternatives but it didn't work out.
- ActiveModel from Rails 3 is hard to make generic
- ActiveModel::Model from Rails 4 is a great upgrade from 3.x.  You can  make anything look like a database object but it still doesn't have the concept of a collection.  So now I have to make an array variable called table?  This is weird.
- Sequel has a nice interface to an in-memory sqlite3 database.  It's probably the most 'real' that I found but it requires you to do a CREATE TABLE statement even for your in-memory database.</p>
<p>None of these alternatives above are bad but let's take a look and see how nice we can get it with Supermodel.</p>
<p>First, we are going to use a supermodel fork so that we automatically get rails 3.2.13 instead of 3.0.x.  Create a project folder and a Gemfile file:</p>

{% highlight ruby %}
source "https://rubygems.org"
gem 'supermodel', :git => 'https://github.com/amdtech/supermodel.git'
{% endhighlight %}


<p>Run bundle.</p>

{% highlight ruby %}
require 'csv'
require 'supermodel'

class Guest < SuperModel::Base
  validates_presence_of :name
end

class CSVImporter
  def import filename
    csv = CSV.read(File.open(filename))
    remove_headers csv

    csv.each do |row|
      Guest.create attributes_for(row)
    end
  end

  # i know i've gotten this to work more elegantly
  def remove_headers csv
    csv.delete_at 0
  end

  def attributes_for row
    row = strip_row!(row)
    {
      name:             row[0],
      plus:             row[1].to_i,
      rsvp:             row[2] == "Yes",
      peanut_allergies: row[3] == "Yes"
    }
  end

  def strip_row!(row)
    row.collect {|cell| cell.strip }
  end
end

CSVImporter.new.import('guests.csv')

puts "How many people are coming?"
puts Guest.all.reduce(0) {|sum, guest| sum += guest.plus + 1}

peanut_eating_guests = Guest.all.select {|guest| guest.peanut_allergies == false }
peanut_guest_count = peanut_eating_guests.inject(0) {|sum, guest| sum += guest.plus + 1 }
puts "Number of guests eating peanut M&Ms:"
puts peanut_guest_count

# How many people are coming?
# 17
# Number of guests eating peanut M&Ms:
# 7
{% endhighlight %}

<p>You can see that Guest.all is much more intent revealing than manipulating a 2D array by hand.</p>
