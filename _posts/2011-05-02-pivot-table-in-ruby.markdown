---
layout: post
status: publish
published: true
title: Pivot Table in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "Sometimes you need to transpose data from columns to rows or vice-versa.
  \ In the SQL world, this is called a pivot table.  Usually this happens when you're
  coming from a key-value store and want to turn it into something more structured
  but it can also happen in poorly designed or legacy databases.  The idea is pretty
  simple, pivot the data from rows into columns.  For example, here's a listing of
  CDs:\r\n<pre>\r\n-------------------------------------\r\nDJ Shadow       |  electronica\r\nDJ
  Shadow       |  1996\r\nDJ Shadow       |  Endtroducing\r\nThe Avalanches  |  Since
  I Left You\r\nThe Avalanches  |  2000\r\nThe Avalanches  |  electronica\r\n-------------------------------------\r\n</pre>\r\n\r\nThere
  are really only two CDs here but the data is presented to us as artist:attribute
  pairs.  We want the data to look like this:\r\n<pre>\r\nArtist         | Genre       |
  Album            | Year  \r\n------------------------------------------------------\r\nDJ
  Shadow      | electronica | Entroducing      | 1996\r\nThe Avalanches | electronica
  | Since I Left You | 2000\r\n</pre>\r\n"
wordpress_id: 1238
wordpress_url: http://squarism.com/?p=1238
date: !binary |-
  MjAxMS0wNS0wMiAyMjo0MjoyMiAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wNS0wMyAwMzo0MjoyMiAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
<p>Sometimes you need to transpose data from columns to rows or vice-versa.  In the SQL world, this is called a pivot table.  Usually this happens when you're coming from a key-value store and want to turn it into something more structured but it can also happen in poorly designed or legacy databases.  The idea is pretty simple, pivot the data from rows into columns.  For example, here's a listing of CDs:</p>
<pre>
-------------------------------------
DJ Shadow       |  electronica
DJ Shadow       |  1996
DJ Shadow       |  Endtroducing
The Avalanches  |  Since I Left You
The Avalanches  |  2000
The Avalanches  |  electronica
-------------------------------------
</pre></p>
<p>There are really only two CDs here but the data is presented to us as artist:attribute pairs.  We want the data to look like this:</p>
<pre>
Artist         | Genre       | Album            | Year
------------------------------------------------------
DJ Shadow      | electronica | Entroducing      | 1996
The Avalanches | electronica | Since I Left You | 2000
</pre>
<a id="more"></a><a id="more-1238"></a></p>
<h3>First Example</h3><p>
First of all, the starting data (the first key value pair listing) doesn't have the data labeled so this creates a problem.  We have to assume that the key is the artist and label that accordingly.  After that, the attributes are not labeled so we're not going to be able to create the column headings without more information.  So I'll show two examples here, one with unlabeled data and the second with proper labeling.</p>
<p>The first example makes an assumption that the order of the attributes is significant.  IE: album, year, genre.  We have to make this assumption for the pretty table printing.  If this is not the case, the logical impact is minimal and you can ignore this.</p>

{% highlight ruby %}
# FIRST EXAMPLE where data is associated by unique strings but
# not explicit with keys or labels, for example :year => 1996 is not explicit
unpivoted_data = [
  { "DJ Shadow" => "Endtroducing" },
  { "DJ Shadow" => "1996" },
  { "DJ Shadow" => "electronica" },
  { "The Avalanches" => "Since I Left You" },
  { "The Avalanches" => "2000" },
  { "The Avalanches" => "electronica" }
]

# make new array
pivoted = Hash.new

unpivoted_data.each do |d|
  # key of each hash element should be only one element long
  key = d.keys.first.to_sym

  if pivoted[key] == nil
    pivoted[key] = Array.new
  end

  pivoted[key] << d.values.first

end

# The variable pivoted at this point looks like this:
# {:"DJ Shadow"=>["electronica", "1996", "Endtroducing"],
# :"The Avalanches"=>["Since I Left You", "2000", "electronica"]}

# pretty table print
# first pass, determine biggest columns and store

# biggest size of key
max_lengths = []
pivoted.keys.each do |key|
  if max_lengths[0].nil? || key.length > max_lengths[0]
    max_lengths[0] = key.length
  end
end

# biggest size of values array inside key
pivoted.keys.each do |element|
  # we already have max_lengths[0] from key
  i = 1
  pivoted[element].each do |subelement|
   if max_lengths[i].nil? || subelement.length > max_lengths[i]
     max_lengths[i] = subelement.length
   end
   i += 1
  end
end

puts "Pivoted Unlabeled:"
line_size = max_lengths.inject{|sum,x| sum + x } + max_lengths.length * 3 - 1
puts "-" * line_size

# pad columns with spaces and bars from max_lengths
pivoted.keys.each do |key|
  string = key.to_s.ljust(max_lengths[0])
  string << " | "

  i = 1
  pivoted[key].each do |attribute|
    string << attribute.ljust(max_lengths[i]) << " | "
    i += 1
  end

  # string = key.to_s << " | " << pivoted[key].join(" | ")
  puts string
end

# spacer
puts ""
{% endhighlight %}

<p>This code will output:</p>
<pre>
Pivoted Unlabeled:
--------------------------------------------------------
DJ Shadow      | Endtroducing     | 1996 | electronica |
The Avalanches | Since I Left You | 2000 | electronica |
</pre></p>
<p>Nice bit of pretty printing there.  Completely unnecessary but gives a nice feel of a pivot table even if we are not working with a database or activerecord.</p>
<h3>Second Example</h3><p>
The second example of pivoting data involves a data structured that is related by a primary key and each subelement has a field with a name.  This could be a 2D data structure from a database or anything that is highly structured and organized.  The ID field in this case is barely significant.  It just acts as a label, in this example it is the ID of the album as pulled from freedb.org.</p>
<p>This code takes a different approach of creating a hash of hashes to pivot the data.  After that, it creates a 2D array for tablular printing.  The maximum column size is computed for pretty printing.</p>

{% highlight ruby %}
# SECOND EXAMPLE where data is labeled.  This is easier / cleaner.
# IDs represent CDs pulled from freedb.org
unpivoted_data = [
  { :freedb => "a70eb30d", :artist => "DJ Shadow" },
  { :freedb => "a70eb30d", :genre => "electronica" },
  { :freedb => "a70eb30d", :year => 1996 },
  { :freedb => "a70eb30d", :album => "Endtroducing" },
  { :freedb => "090e6012", :artist => "The Avalanches" },
  { :freedb => "090e6012", :genre => "electronica" },
  { :freedb => "090e6012", :year => 2000 },
  { :freedb => "090e6012", :album => "Since I Left You" }
]

# hash of hashes
pivoted = Hash.new

unpivoted_data.each do |d|
  # store the unique ID so we can remember if we've seen the CD before
  id = d.values.first.to_sym

  # attribute to merge
  attribute_key = d.keys[1]
  attribute = d[attribute_key]

  # if we haven't seen the CD, create an empty attribute hash
  if !pivoted.keys.include?(id)
    pivoted[id] = Hash.new
  end

  # add the new attribute
  pivoted[id][attribute_key] = attribute
end

# make data into 2d array
table = Array.new
pivoted.keys.each do |e|
  heading = Array.new
  heading << "ID"
  pivoted[e].keys.each do |sub_e|
    heading << sub_e.to_s.upcase
  end
  table << heading
  # only need first row of heading
  break
end

pivoted.keys.each do |e|
  row = Array.new
  row << e
  pivoted[e].values.each do |sub_e|
    row << sub_e
  end
  table << row
end

# biggest size of key
max_lengths = []
table.each_with_index do |x|
  i = 0
  x.each_with_index do |y|
    if max_lengths[i].nil? || y.to_s.length > max_lengths[i]
      max_lengths[i] = y.to_s.length
    end
    i += 1
  end
end

puts "Pivoted Labeled:"
line_size = max_lengths.inject{|sum,x| sum + x } + max_lengths.length * 3 - 1
puts "-" * line_size

# pad columns with spaces and bars from max_lengths
table.each_with_index do |x|
  string = ""
  i = 0
  x.each_with_index do |y|
    string << y.to_s.ljust(max_lengths[i]) << " | "
    i += 1
  end

  puts string
end

# spacer
puts ""
{% endhighlight %}

<p>This code will produce this text:</p>
<pre>Pivoted Labeled:
-------------------------------------------------------------------
ID       | ARTIST         | GENRE       | YEAR | ALBUM            |
a70eb30d | DJ Shadow      | electronica | 1996 | Endtroducing     |
090e6012 | The Avalanches | electronica | 2000 | Since I Left You |
</pre></p>
<h3>Conclusion</h3><p>
Both examples are very procedural.  There might be opportunities to make this code more OO or even functional by breaking up common tasks.  However, the problem I ran into was of the structure itself.  I don't see a generic way of creating code reuse except for creating methods that can handle a "hash of hashes" or other pre-defined types.  I wanted to post a copy and paste template that would help anyone out there trying to pivot data (or even find this name for a problem like this) but unfortunately the solutions are tightly bound to the data structure you are starting out with.  In the case of database rows, example #1 will probably work for you with minimal changes.</p>
