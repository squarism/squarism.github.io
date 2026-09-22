---
title: "Alphabet sequences with factorygirl"
description: "Blog post about alphabet sequences with factorygirl"
date: 2010-09-03T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2010/09/factory_alphabet.png "factory_alphabet")
I was trying to use this in a factorygirl class to create test data with names like Product A, Product B etc.  This isn't very sophisticated.  If you want some smarter dummy data generation with factorygirl, check out [this post at the PMA media group](http://www.pmamediagroup.com/2009/05/smarter-sequencing-in-factory-girl/).

Anyway, here's the pure ruby part if you fire up irb:
```ruby
i = 0
hash = Hash.new
"a".upto("z") do |letter|
  hash[i] = letter
  i+=1
end
```

Gives you:
```text
hash.sort
 => [[0, "a"], [1, "b"], [2, "c"], [3, "d"], [4, "e"], [5, "f"], [6, "g"], [7, "h"], [8, "i"], [9, "j"], [10, "k"], [11, "l"], [12, "m"], [13, "n"], [14, "o"], [15, "p"], [16, "q"], [17, "r"], [18, "s"], [19, "t"], [20, "u"], [21, "v"], [22, "w"], [23, "x"], [24, "y"], [25, "z"]]
```

Or even cleaner:
```text
hash.sort.each {|k,v| print "#{v} "}
a b c d e f g h i j k l m n o p q r s t u v w x y z
```

It has an off-by-one problem for readability.  You actually need to change the i=0 to i=1 for factory girl because the factorygirl sequence starts on 1.  Here's my factorygirl product class:

```ruby
# let's make an alphabet.
i = 1
hash = Hash.new
"A".upto("Z") do |letter|
  hash[i] = letter
  i+=1
end

Factory.define :product do |p|
  p.sequence(:name) { |n| "Product #{hash[n]}" }
  p.price 19.95
  p.platform "Example Platform"
end
```

If you need more than 26 products, just change the upto("Z") to "ZZ" or whatever.  It'll scale as far as you want.  If you need infinite scaling, don't use letters.  :)

To test, in the console:
```text
script/console test
> 40.times { Factory(:product) }
```

And this will generate some madness as depicted in the screenshot to the right.
