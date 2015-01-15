---
layout: post
status: publish
published: true
title: Alphabet sequences with factorygirl
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 674
wordpress_url: http://squarism.com/?p=674
date: !binary |-
  MjAxMC0wOS0wMyAxMzozNzoxMyAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wOS0wMyAxODozNzoxMyAtMDQwMA==
categories:
- Ruby
- Rails
tags: []
comments:
- id: 7460
  author: Sunny
  author_email: sunny@sunfox.org
  author_url: http://sunfox.org
  date: !binary |-
    MjAxMy0wMi0yNiAxMjo1MzowOCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMy0wMi0yNiAxNzo1MzowOCAtMDUwMA==
  content: ! "I used your technique but without the need to create a Hash with the
    help of Ruby's ranges :\r\n\r\n    sequence(:name) { |n| \"Product #{(\"A\"..\"ZZZ\").to_a[n]}\"
    }"
- id: 8698
  author: aimzatron
  author_email: maher.aimeej@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMy0wOS0yMyAxMToxMTowMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMy0wOS0yMyAxNjoxMTowMCAtMDQwMA==
  content: ! "The solution that Sunny contributed in the comments works but only if
    you remove the double quotes around A and ZZZ and replace them with single quotes.
    If you run it as it is written you will get an ASCII invalid byte sequence error.
    It should look like this:\r\n\r\nsequence(:name) { |n| &acirc;&euro;&oelig;Product
    #{('A'..'ZZZ').to_a[n]}&acirc;&euro;\x9D }"
---
![](/uploads/2010/09/factory_alphabet.png "factory_alphabet")
I was trying to use this in a factorygirl class to create test data with names like Product A, Product B etc.  This isn't very sophisticated.  If you want some smarter dummy data generation with factorygirl, check out [this post at the PMA media group](http://www.pmamediagroup.com/2009/05/smarter-sequencing-in-factory-girl/).

Anyway, here's the pure ruby part if you fire up irb:
`
i = 0
hash = Hash.new
"a".upto("z") do |letter|
  hash[i] = letter
  i+=1
end
`

Gives you:
`hash.sort
 => [[0, "a"], [1, "b"], [2, "c"], [3, "d"], [4, "e"], [5, "f"], [6, "g"], [7, "h"], [8, "i"], [9, "j"], [10, "k"], [11, "l"], [12, "m"], [13, "n"], [14, "o"], [15, "p"], [16, "q"], [17, "r"], [18, "s"], [19, "t"], [20, "u"], [21, "v"], [22, "w"], [23, "x"], [24, "y"], [25, "z"]]`

Or even cleaner:
`hash.sort.each {|k,v| print "#{v} "}
a b c d e f g h i j k l m n o p q r s t u v w x y z
`

It has an off-by-one problem for readability.  You actually need to change the i=0 to i=1 for factory girl because the factorygirl sequence starts on 1.  Here's my factorygirl product class:

`# let's make an alphabet.
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
`

If you need more than 26 products, just change the upto("Z") to "ZZ" or whatever.  It'll scale as far as you want.  If you need infinite scaling, don't use letters.  :)

To test, in the console:
`script/console test
> 40.times { Factory(:product) }
`

And this will generate some madness as depicted in the screenshot to the right.
